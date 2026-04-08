import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { User, Package, Heart, LogOut } from '../components/common/Icons'
import ProductCard from '../components/product/ProductCard'
import { formatPrice, formatDate } from '../utils/helpers'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { api } from '../services/api'

const ProfilePage = () => {
  const { currentUser, logout } = useAuthStore()
  const addToast = useToastStore(state => state.addToast)
  
  const [activeTab, setActiveTab] = useState('orders')
  const [myOrders, setMyOrders] = useState([])
  const [wishlistProducts, setWishlistProducts] = useState([])

  useEffect(() => {
    if (currentUser) {
      const uid = currentUser._id || currentUser.id
      api.get(`/orders/user/${uid}`).then(setMyOrders).catch(() => {})
      if (currentUser.wishlist?.length > 0) {
        api.get('/products').then(products => {
          setWishlistProducts(products.filter(p => currentUser.wishlist?.includes(p._id || p.id)))
        }).catch(() => {})
      }
    }
  }, [currentUser])

  if (!currentUser) return <Navigate to="/login" replace />

  const handleLogout = () => {
    logout()
    addToast('Đã đăng xuất tài khoản', 'success')
    // Navigate handled by the redirect below after currentUser becomes null
  }

  const tabs = [
    { id: 'orders', label: 'Lịch sử mua hàng', icon: <Package size={18} /> },
    { id: 'wishlist', label: 'Yêu thích (' + wishlistProducts.length + ')', icon: <Heart size={18} /> },
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 mb-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-3xl mx-auto flex items-center justify-center text-4xl font-black shadow-lg shadow-orange-500/30 mb-4 transform -rotate-6">
                <div className="rotate-6">{currentUser.name[0]}</div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{currentUser.name}</h2>
              <p className="text-gray-500 mt-1">{currentUser.email}</p>
              <div className="mt-4"><span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full uppercase tracking-widest">{currentUser.role}</span></div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col gap-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-3 w-full p-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === t.id ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
              <div className="h-px bg-gray-100 my-2 mx-4"></div>
              <button onClick={handleLogout} className="flex items-center gap-3 w-full p-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer">
                <LogOut size={18} /> Đăng xuất
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Đơn hàng của tôi</h3>
                {myOrders.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
                    <p className="text-gray-500 font-medium mb-6">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/shop" className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-orange-600 transition">Mua sắm ngay</Link>
                  </div>
                ) : (
                  myOrders.map((o) => (
                    <div key={o._id || o.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                      <div className="bg-gray-50/50 p-6 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Mã hợp đồng</p>
                          <p className="font-black text-orange-600 text-lg">#{o.orderId || o._id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Ngày mua</p>
                          <p className="font-bold text-gray-900">{formatDate(o.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Tổng tiền</p>
                          <p className="font-black text-gray-900 text-lg">{formatPrice(o.total)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 pb-1.5 rounded-lg text-xs font-bold ${o.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' : o.status === 'Đã hủy' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{o.status}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {o.items.map((i, idx) => (
                            <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                              <img src={i.image} alt={i.name} className="w-16 h-16 bg-white object-contain rounded-xl p-1 shadow-sm" />
                              <div className="flex-1 min-w-0">
                                <Link to={`/product/${i.productId}`} className="font-bold text-gray-900 text-sm hover:text-orange-600 transition line-clamp-1">{i.name}</Link>
                                <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1 mb-2">SL: {i.quantity}</p>
                              </div>
                              <div className="font-black text-gray-800">{formatPrice(i.price)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Danh sách Yêu thích</h3>
                {wishlistProducts.length === 0 ? (
                  <div className="bg-white p-16 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Heart size={48} className="text-red-400" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-2">Chưa có sản phẩm yêu thích</p>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Hãy thả tim cho những sản phẩm bạn yêu thích để xem lại sau này nhé!</p>
                    <Link to="/shop" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg">Khám phá ngay</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {wishlistProducts.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage
