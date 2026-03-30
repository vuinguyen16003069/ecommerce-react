import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Package,
  Heart,
  LogOut,
  AlertCircle,
} from "../components/common/Icons";
import ProductCard from "../components/product/ProductCard";
import { formatPrice, formatDate } from "../utils/helpers";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { api } from "../services/api";
import { Modal } from "../components/common/Modal";

const ProfilePage = () => {
  const { currentUser, profileCache, logout } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [activeTab, setActiveTab] = useState("orders");
  const [myOrders, setMyOrders] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (currentUser) {
      api.get("/orders").then((orders) => {
        setMyOrders(
          orders.filter(
            (o) => o.userId === (currentUser._id || currentUser.id),
          ),
        );
      });
      if (currentUser.wishlist?.length > 0) {
        api.get("/products").then((products) => {
          setWishlistProducts(
            products.filter((p) =>
              currentUser.wishlist?.includes(p._id || p.id),
            ),
          );
        });
      } else {
        setWishlistProducts([]);
      }
    } else {
      setMyOrders([]);
      setWishlistProducts([]);
    }
  }, [currentUser]);

  const account = currentUser || profileCache;

  if (!account) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    addToast("Đã đăng xuất tài khoản", "success");
  };

  const handleCancelOrder = async () => {
    if (!cancelTarget) return;
    const orderKey = cancelTarget._id || cancelTarget.id;
    if (!orderKey) return;
    setCancellingId(orderKey);
    try {
      const updated = await api.put(`/orders/${orderKey}`, {
        status: "Đã hủy",
      });
      setMyOrders((prev) =>
        prev.map((o) => ((o._id || o.id) === orderKey ? updated : o)),
      );
      addToast("Đơn hàng đã được huỷ", "success");
      setCancelTarget(null);
    } catch (error) {
      addToast(error.message || "Không thể huỷ đơn hàng", "error");
    } finally {
      setCancellingId(null);
    }
  };

  const closeCancelModal = () => {
    if (cancellingId) return;
    setCancelTarget(null);
  };

  const tabs = [
    { id: "orders", label: "Lịch sử mua hàng", icon: <Package size={18} /> },
    {
      id: "wishlist",
      label: "Yêu thích (" + wishlistProducts.length + ")",
      icon: <Heart size={18} />,
    },
  ];

  const filteredOrders = myOrders.filter((order) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "pending") return order.status === "Chờ xác nhận";
    if (statusFilter === "completed") return order.status === "Hoàn thành";
    if (statusFilter === "cancelled") return order.status === "Đã hủy";
    return true;
  });

  const filterOptions = [
    { id: "pending", label: "Đang chờ" },
    { id: "completed", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã huỷ" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 mb-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-3xl mx-auto flex items-center justify-center text-4xl font-black shadow-lg shadow-orange-500/30 mb-4 transform -rotate-6">
                <div className="rotate-6">{account.name?.[0] || "U"}</div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {account.name}
              </h2>
              <p className="text-gray-500 mt-1">{account.email}</p>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                  {account.role}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col gap-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-3 w-full p-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === t.id ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
              <div className="h-px bg-gray-100 my-2 mx-4"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                disabled={!currentUser}
              >
                <LogOut size={18} /> Đăng xuất
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
                  Đơn hàng của tôi
                </h3>
                {myOrders.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest border transition cursor-pointer ${statusFilter === "all" ? "bg-gray-900 text-white border-gray-900" : "text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"}`}
                    >
                      Tất cả ({myOrders.length})
                    </button>
                    {filterOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setStatusFilter(opt.id)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest border transition cursor-pointer ${statusFilter === opt.id ? "bg-orange-50 text-orange-600 border-orange-200" : "text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
                {myOrders.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                      📦
                    </div>
                    <p className="text-gray-500 font-medium mb-6">
                      Bạn chưa có đơn hàng nào.
                    </p>
                    <Link
                      to="/shop"
                      className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-orange-600 transition"
                    >
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-200 text-center">
                    <p className="text-gray-500 font-medium">
                      Không có đơn phù hợp với bộ lọc này.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((o) => {
                    const orderKey = o._id || o.id;
                    const canCancel =
                      o.status !== "Hoàn thành" && o.status !== "Đã hủy";
                    return (
                      <div
                        key={orderKey}
                        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition"
                      >
                        <div className="bg-gray-50/50 p-6 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                              Mã hợp đồng
                            </p>
                            <p className="font-black text-orange-600 text-lg">
                              #{o.orderId || o._id}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                              Ngày mua
                            </p>
                            <p className="font-bold text-gray-900">
                              {formatDate(o.date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                              Tổng tiền
                            </p>
                            <p className="font-black text-gray-900 text-lg">
                              {formatPrice(o.total)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-3 py-1 pb-1.5 rounded-lg text-xs font-bold ${o.status === "Hoàn thành" ? "bg-green-100 text-green-700" : o.status === "Đã hủy" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                            >
                              {o.status}
                            </span>
                            {canCancel && (
                              <button
                                onClick={() => setCancelTarget(o)}
                                className="block w-full mt-3 text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-800"
                                disabled={cancellingId === orderKey}
                              >
                                {cancellingId === orderKey
                                  ? "Đang huỷ..."
                                  : "Huỷ đơn hàng"}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {o.items.map((i, idx) => (
                              <div
                                key={idx}
                                className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100"
                              >
                                <img
                                  src={i.image}
                                  alt={i.name}
                                  className="w-16 h-16 bg-white object-contain rounded-xl p-1 shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                  <Link
                                    to={`/product/${i._id || i.id}`}
                                    className="font-bold text-gray-900 text-sm hover:text-orange-600 transition line-clamp-1"
                                  >
                                    {i.name}
                                  </Link>
                                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1 mb-2">
                                    SL: {i.quantity}
                                  </p>
                                </div>
                                <div className="font-black text-gray-800">
                                  {formatPrice(i.price)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
                  Danh sách Yêu thích
                </h3>
                {wishlistProducts.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                    <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      Bạn chưa lưu sản phẩm nào.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {wishlistProducts.map((p) => (
                      <ProductCard key={p._id || p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!cancelTarget}
        onClose={closeCancelModal}
        title="Xác nhận huỷ đơn hàng"
      >
        {cancelTarget && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
              <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm font-bold text-red-600">
                  Bạn có chắc chắn muốn huỷ đơn hàng này?
                </p>
                <p className="text-xs text-red-500 mt-1">
                  Sau khi huỷ, đơn hàng sẽ không thể khôi phục lại.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-sm">
              <div className="flex items-center justify-between font-semibold text-gray-900 mb-2">
                <span>Mã đơn: #{cancelTarget.orderId || cancelTarget._id}</span>
                <span className="text-orange-600">
                  {formatPrice(cancelTarget.total)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-500 text-xs uppercase tracking-wide">
                <span>{formatDate(cancelTarget.date)}</span>
                <span>
                  {cancelTarget.items?.length || 0} sản phẩm • Trạng thái:{" "}
                  <strong className="text-gray-700">
                    {cancelTarget.status}
                  </strong>
                </span>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={closeCancelModal}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm cursor-pointer"
                disabled={!!cancellingId}
              >
                Giữ đơn hàng
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-sm shadow-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                disabled={!!cancellingId}
              >
                {cancellingId ? "Đang huỷ..." : "Huỷ ngay"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProfilePage;
