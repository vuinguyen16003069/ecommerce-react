import { User, Package, Heart } from '../components/Icons'
import { formatPrice, formatDate } from '../utils/helpers'

const ProfileView = ({ currentUser, db, onProductClick, onToggleWishlist, onNavigate }) => {
  if (!currentUser) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <User size={48} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">Chưa đăng nhập</h2>
      <button onClick={() => onNavigate('login')} className="bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold mt-2 hover:bg-orange-700 transition">Đăng nhập ngay</button>
    </div>
  )

  const myOrders = db.orders.filter((o) => o.userId === currentUser.id)
  const wishlistProducts = db.products.filter((p) => currentUser.wishlist?.includes(p.id))

  const statusColors = {
    'Hoàn thành': 'bg-green-100 text-green-700',
    'Đang giao': 'bg-blue-100 text-blue-700',
    'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
    'Đã hủy': 'bg-red-100 text-red-700',
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl text-white mb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-black backdrop-blur-sm">{currentUser.name[0]}</div>
          <div>
            <h2 className="text-2xl font-bold">{currentUser.name}</h2>
            <p className="text-orange-100 text-sm">{currentUser.email}</p>
            <span className="inline-block mt-1 text-[10px] px-2.5 py-1 bg-white/20 rounded-full font-bold uppercase tracking-wider">{currentUser.role}</span>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-2xl font-black">{myOrders.length}</p>
            <p className="text-orange-100 text-xs">Đơn hàng</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={18} className="text-orange-500" /> Lịch sử đơn hàng</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {myOrders.length > 0 ? myOrders.map((o) => (
                <div key={o.id} className="border border-gray-100 rounded-xl p-3 hover:border-orange-200 transition">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-orange-600">#{o.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{formatDate(o.date)}</p>
                  <p className="text-xs text-gray-600 truncate">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</p>
                  <p className="font-bold text-orange-600 text-sm mt-1.5">{formatPrice(o.total)}</p>
                </div>
              )) : <div className="py-8 text-center text-gray-400 text-sm">Chưa có đơn hàng nào</div>}
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Heart size={18} className="text-red-500" /> Yêu thích ({wishlistProducts.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {wishlistProducts.length > 0 ? wishlistProducts.map((p) => (
                <div key={p.id} className="border border-gray-100 rounded-xl p-3 flex gap-3 hover:border-orange-200 transition cursor-pointer" onClick={() => onProductClick(p)}>
                  <img src={p.image} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" alt={p.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{p.name}</p>
                    <p className="text-orange-600 font-bold text-sm">{formatPrice(p.price)}</p>
                    <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id) }} className="text-[11px] text-red-500 hover:text-red-700 font-medium mt-0.5">Xóa khỏi danh sách</button>
                  </div>
                </div>
              )) : <div className="py-8 text-center text-gray-400 text-sm">Danh sách yêu thích trống</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView
