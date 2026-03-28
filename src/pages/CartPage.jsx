import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ArrowRight } from '../components/common/Icons'
import { formatPrice } from '../utils/helpers'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { api } from '../services/api'

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore()
  const addToast = useToastStore(state => state.addToast)
  const navigate = useNavigate()

  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cartTotal > 299000 ? 0 : 30000
  const finalTotal = cartTotal + shipping - discount

  const handleApplyCoupon = async () => {
    const coupons = await api.get('/coupons')
    const valid = coupons?.find((c) => c.code === coupon.toUpperCase())
    if (valid) {
      setDiscount(valid.value || Math.round(cartTotal * (valid.discount || 0)))
      addToast(`Áp dụng mã ${valid.code} thành công!`, 'success')
    } else {
      setDiscount(0)
      addToast('Mã giảm giá không hợp lệ!', 'error')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 animate-fade-in max-w-2xl text-center">
        <div className="bg-orange-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-5xl">🛒</div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto">Có vẻ như bạn chưa chọn sản phẩm nào. Khám phá những xu hướng thời trang mới nhất ngay!</p>
        <Link to="/shop" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-1 transition-all inline-block">Tiếp tục mua sắm</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in max-w-6xl">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Giỏ hàng ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
        <button onClick={() => { if (confirm('Xóa toàn bộ giỏ?')) { clearCart(); addToast('Đã xóa giỏ', 'info') } }} className="text-sm font-bold text-red-500 hover:text-red-600 hover:underline transition cursor-pointer">Xóa toàn bộ</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div key={item._id || item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-5 hover:border-orange-200 transition group relative overflow-hidden">
              <Link to={`/product/${item._id || item.id}`} className="w-28 h-28 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="max-h-[85%] object-contain group-hover:scale-110 transition duration-500" />
              </Link>
              <div className="flex-1 flex flex-col pt-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <Link to={`/product/${item._id || item.id}`} className="font-bold text-gray-900 text-lg hover:text-orange-600 transition line-clamp-2 leading-tight">{item.name}</Link>
                  <button onClick={() => { removeFromCart(item._id || item.id); addToast('Đã xóa sản phẩm', 'info') }} className="text-gray-300 hover:bg-red-50 hover:text-red-500 p-2 rounded-xl transition cursor-pointer"><Trash2 size={18} /></button>
                </div>
                <div className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-3">{item.category}</div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="font-black text-gray-900 text-xl tracking-tight">{formatPrice(item.price)}</div>
                  <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100">
                    <button onClick={() => updateQuantity(item._id || item.id, -1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center rounded-md font-bold text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer">-</button>
                    <div className="w-10 h-8 flex items-center justify-center font-bold text-sm text-gray-900">{item.quantity}</div>
                    <button onClick={() => updateQuantity(item._id || item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-md font-bold text-gray-500 hover:bg-white hover:shadow-sm transition cursor-pointer">+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-[400px] sticky top-24">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-3xl -z-10 rounded-full translate-x-10 -translate-y-10"></div>
            <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Tổng thanh toán</h3>
            <div className="space-y-4 mb-6">
              <div className="flex bg-gray-50 rounded-xl p-1.5 border border-gray-100 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition">
                <input type="text" placeholder="Nhập mã DEAL..." value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium px-4" />
                <button onClick={handleApplyCoupon} className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 transition shadow-sm uppercase tracking-wide cursor-pointer">Áp dụng</button>
              </div>
            </div>
            <div className="space-y-4 text-sm border-t border-gray-100 py-6 mb-2">
              <div className="flex justify-between text-gray-600 font-medium"><span>Tạm tính</span><span className="text-gray-900 font-bold">{formatPrice(cartTotal)}</span></div>
              <div className="flex justify-between text-gray-600 font-medium"><span>Phí giao hàng</span><span className={shipping === 0 ? 'text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-0.5 rounded-md' : 'text-gray-900 font-bold'}>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600 font-bold animate-fade-in"><span className="flex items-center gap-1">↳ Mã giảm giá</span><span>-{formatPrice(discount)}</span></div>}
            </div>
            <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8 flex justify-between items-end">
              <span className="text-base font-bold text-gray-600 uppercase tracking-wide">Tổng cộng</span>
              <span className="text-4xl font-black text-orange-600 tracking-tighter">{formatPrice(finalTotal)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full bg-gray-900 text-white font-bold py-4.5 rounded-2xl hover:bg-orange-600 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg uppercase tracking-wide group cursor-pointer">
              THANH TOÁN <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center text-xs text-gray-500 font-medium">Thanh toán an toàn • Đổi trả 30 ngày • Bảo mật 100%</div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
