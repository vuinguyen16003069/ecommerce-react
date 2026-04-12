import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from '../components/common/Icons';
import { formatPrice } from '../utils/helpers';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { api } from '../services/api';

const CheckoutPage = () => {
  const { cart, clearCart, couponDiscount, couponCode } = useCartStore();
  const { currentUser } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [loading, setLoading] = useState(false);

  // Calculate item price with flash sale consideration
  const getItemPrice = (item) => {
    if (item.isFlashSale) {
      return item.price * (1 - (item.flashSaleDiscount || 50) / 100);
    }
    return item.price;
  };

  const cartTotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const shipping = cartTotal > 299000 ? 0 : 30000;
  const finalTotal = Math.max(0, cartTotal + shipping - couponDiscount);

  useEffect(() => {
    if (currentUser) {
      setForm((f) => ({ ...f, name: currentUser.name, phone: currentUser.phone || '' }));
    }
    if (cart.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [currentUser, cart, navigate]);

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      addToast('Vui lòng đăng nhập để đặt hàng', 'error');
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;
    setLoading(true);

    try {
      const orderData = {
        userId: currentUser._id || currentUser.id,
        customerName: form.name,
        customerPhone: form.phone,
        address: form.address,
        note: form.note,
        items: cart.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: getItemPrice(item),
          image: item.image,
        })),
        couponCode: couponCode || '',
        total: finalTotal,
      };

      await api.post('/orders', orderData);
      addToast('Đặt hàng thành công! Mã đơn đã được tạo.', 'success');
      navigate('/profile');
      setTimeout(() => clearCart(), 100);
    } catch (err) {
      addToast('Có lỗi xảy ra: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl animate-fade-in">
        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-8 bg-orange-600 rounded-full"></div> Thanh toán an toàn
        </h2>

        {!currentUser && (
          <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl mb-8 flex items-start gap-4 shadow-sm">
            <AlertCircle className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-bold mb-1">Bạn chưa đăng nhập</p>
              <p className="text-sm text-gray-500 mb-3">
                Đăng nhập ngay để theo dõi lịch sử đơn hàng và nhận các ưu đãi hấp dẫn dành riêng
                cho thành viên.
              </p>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="text-xs bg-white border font-bold text-gray-700 px-4 py-2 hover:bg-orange-600 hover:text-white rounded-lg transition shadow-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-xs bg-white border font-bold text-gray-700 px-4 py-2 hover:bg-orange-600 hover:text-white rounded-lg transition shadow-sm"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="font-bold text-xl text-gray-900 mb-6 uppercase tracking-wide text-sm border-b pb-4">
              Thông tin giao hàng
            </h3>
            <form id="checkoutForm" onSubmit={submitOrder} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 font-medium transition"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 font-medium transition"
                    placeholder="VD: 0912 345 678"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                  Địa chỉ nhận hàng (Chi tiết)
                </label>
                <textarea
                  required
                  rows="3"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none transition font-medium"
                  placeholder="VD: Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố..."
                ></textarea>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest block mb-1.5">
                  Ghi chú thêm (Tùy chọn)
                </label>
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                  placeholder="VD: Giao giờ hành chính..."
                />
              </div>
              <div className="pt-6 border-t mt-6">
                <h3 className="font-bold text-xl text-gray-900 mb-6 uppercase tracking-wide text-sm">
                  Phương thức thanh toán
                </h3>
                <label className="flex items-center gap-4 p-4 border border-orange-200 bg-orange-50 rounded-xl cursor-pointer shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                  <input
                    type="radio"
                    checked
                    readOnly
                    className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-xs text-gray-500 font-medium mt-0.5 block">
                      Nhận hàng, kiểm tra và thanh toán trực tiếp
                    </span>
                  </div>
                </label>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-[420px]">
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-3xl -z-10 rounded-full translate-x-10 -translate-y-10"></div>
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <CheckCircle size={20} className="text-green-400" /> Tóm tắt đơn hàng
              </h3>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto admin-scroll pr-2">
                {cart.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="flex gap-4 items-center bg-white/5 p-3 rounded-xl border border-white/10"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 bg-white rounded-lg object-contain p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate pr-2 text-gray-100">{item.name}</p>
                      <p className="text-orange-400 text-xs font-bold mt-1">
                        {item.isFlashSale ? (
                          <>
                            <span>{formatPrice(getItemPrice(item))}</span>
                            <span className="text-gray-400 line-through ml-1">
                              {formatPrice(item.price)}
                            </span>
                          </>
                        ) : (
                          <span>{formatPrice(item.price)}</span>
                        )}
                        <span className="text-gray-400 font-normal ml-1">x {item.quantity}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 border-t border-white/10 pt-6 pb-2 text-sm">
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Tạm tính</span>
                  <span className="text-gray-100">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Vận chuyển</span>
                  <span className="text-green-400">
                    {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-dashed border-white/20 pt-6 mb-8 mt-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Tổng cộng
                </span>
                <span className="text-3xl font-black text-orange-500 tracking-tighter">
                  {formatPrice(finalTotal)}
                </span>
              </div>
              <button
                type="submit"
                form="checkoutForm"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4.5 rounded-2xl transition shadow-lg shadow-orange-600/20 uppercase tracking-widest text-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Xác nhận Đặt hàng'
                )}
              </button>
            </div>
            <Link
              to="/cart"
              className="flex justify-center mt-6 text-sm font-semibold text-gray-500 hover:text-gray-900 transition"
            >
              ← Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
