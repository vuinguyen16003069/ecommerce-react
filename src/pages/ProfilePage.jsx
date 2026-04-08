import { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { User, Package, Heart, LogOut, Trash2 } from '../components/common/Icons'
import ProductCard from '../components/product/ProductCard'
import { formatPrice, formatDate, resolveImageUrl } from '../utils/helpers'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { api } from '../services/api'

const ORDER_STATUSES = ['Tất cả', 'Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy']

const STATUS_STYLE = {
  'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
  'Đang giao': 'bg-blue-100 text-blue-700',
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Đã hủy': 'bg-red-100 text-red-700',
}

const ProfilePage = () => {
  const { currentUser, logout, setCurrentUser } = useAuthStore()
  const addToast = useToastStore(state => state.addToast)
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('account')
  const [myOrders, setMyOrders] = useState([])
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [orderStatusFilter, setOrderStatusFilter] = useState('Tất cả')
  const [cancelingOrderId, setCancelingOrderId] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  })

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

  useEffect(() => {
    if (!currentUser) return
    setProfileForm((prev) => ({
      ...prev,
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      bio: currentUser.bio || '',
    }))
  }, [currentUser])

  if (!currentUser) return <Navigate to="/" replace />

  const handleLogout = () => {
    logout()
    addToast('Đã đăng xuất tài khoản', 'success')
    navigate('/')
  }

  const tabs = [
    { id: 'account', label: 'Thông tin tài khoản', icon: <User size={18} /> },
    { id: 'orders', label: 'Lịch sử mua hàng', icon: <Package size={18} /> },
    { id: 'wishlist', label: 'Yêu thích (' + wishlistProducts.length + ')', icon: <Heart size={18} /> },
  ]

  const counts = ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = status === 'Tất cả' ? myOrders.length : myOrders.filter(o => o.status === status).length
    return acc
  }, {})

  const filteredOrders = orderStatusFilter === 'Tất cả'
    ? myOrders
    : myOrders.filter(o => o.status === orderStatusFilter)

  const canCancelOrder = (orderStatus) => orderStatus === 'Chờ xác nhận'

  const onFormChange = (key, value) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!currentUser) return

    const userId = currentUser._id || currentUser.id
    const payload = {
      name: profileForm.name.trim(),
      email: profileForm.email.trim().toLowerCase(),
      phone: profileForm.phone.trim(),
      address: profileForm.address.trim(),
      bio: profileForm.bio.trim(),
    }

    if (!payload.name || !payload.email) {
      addToast('Tên và email là bắt buộc', 'error')
      return
    }

    try {
      setSavingProfile(true)
      const updatedUser = await api.put(`/users/${userId}`, payload)
      setCurrentUser(updatedUser)
      addToast('Cập nhật thông tin thành công', 'success')
    } catch (err) {
      addToast(err.message || 'Không thể cập nhật tài khoản', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return

    try {
      setUploadingAvatar(true)
      const userId = currentUser._id || currentUser.id
      const formData = new FormData()
      formData.append('avatar', file)
      const updatedUser = await api.post(`/users/${userId}/avatar`, formData)
      setCurrentUser(updatedUser)
      addToast('Cập nhật ảnh đại diện thành công', 'success')
    } catch (err) {
      addToast(err.message || 'Tải ảnh thất bại', 'error')
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const handleDeleteAccount = async () => {
    if (!currentUser) return
    const ok = window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')
    if (!ok) return

    try {
      setDeletingAccount(true)
      const userId = currentUser._id || currentUser.id
      await api.delete(`/users/${userId}`)
      logout()
      addToast('Tài khoản đã được xóa', 'info')
      navigate('/')
    } catch (err) {
      addToast(err.message || 'Không thể xóa tài khoản', 'error')
    } finally {
      setDeletingAccount(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!currentUser) return
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return

    try {
      setCancelingOrderId(orderId)
      const uid = currentUser._id || currentUser.id
      const updatedOrder = await api.put(`/orders/${orderId}/cancel`, { userId: uid })
      setMyOrders(prev => prev.map(o => (o._id || o.id) === orderId ? updatedOrder : o))
      addToast('Đã hủy đơn hàng thành công', 'success')
    } catch (err) {
      addToast(err.message || 'Không thể hủy đơn hàng', 'error')
    } finally {
      setCancelingOrderId(null)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 mb-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
              {currentUser.avatar ? (
                <img
                  src={resolveImageUrl(currentUser.avatar)}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-3xl mx-auto object-cover shadow-lg shadow-orange-500/20 mb-4"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-3xl mx-auto flex items-center justify-center text-4xl font-black shadow-lg shadow-orange-500/30 mb-4 transform -rotate-6">
                  <div className="rotate-6">{currentUser.name[0]}</div>
                </div>
              )}
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
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Thông tin tài khoản</h3>

                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
                    {currentUser.avatar ? (
                      <img
                        src={resolveImageUrl(currentUser.avatar)}
                        alt={currentUser.name}
                        className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center text-3xl font-black">
                        {currentUser.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <label className="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition cursor-pointer">
                        {uploadingAvatar ? 'Đang tải ảnh...' : 'Tải ảnh profile'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={uploadingAvatar}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Hỗ trợ JPG, PNG, WEBP. Tối đa 2MB.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên</label>
                      <input value={profileForm.name} onChange={(e) => onFormChange('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <input type="email" value={profileForm.email} onChange={(e) => onFormChange('email', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                      <input value={profileForm.phone} onChange={(e) => onFormChange('phone', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                      <input value={profileForm.address} onChange={(e) => onFormChange('address', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Giới thiệu</label>
                      <textarea rows="3" value={profileForm.bio} onChange={(e) => onFormChange('bio', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none" />
                    </div>
                    <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
                      <button type="submit" disabled={savingProfile} className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-orange-600 transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed">
                        {savingProfile ? 'Đang lưu...' : 'Lưu thông tin'}
                      </button>
                      <button type="button" onClick={handleDeleteAccount} disabled={deletingAccount} className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2">
                        <Trash2 size={16} /> {deletingAccount ? 'Đang xóa...' : 'Xóa tài khoản'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Đơn hàng của tôi</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${orderStatusFilter === status ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                      {status}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${orderStatusFilter === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {counts[status]}
                      </span>
                    </button>
                  ))}
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
                    <p className="text-gray-500 font-medium mb-6">
                      {myOrders.length === 0 ? 'Bạn chưa có đơn hàng nào.' : 'Không có đơn hàng ở trạng thái đã chọn.'}
                    </p>
                    {myOrders.length === 0 && (
                      <Link to="/shop" className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-orange-600 transition">Mua sắm ngay</Link>
                    )}
                  </div>
                ) : (
                  filteredOrders.map((o) => (
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
                          <span className={`inline-block px-3 py-1 pb-1.5 rounded-lg text-xs font-bold ${STATUS_STYLE[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                          {canCancelOrder(o.status) && (
                            <button
                              onClick={() => handleCancelOrder(o._id || o.id)}
                              disabled={cancelingOrderId === (o._id || o.id)}
                              className="mt-2 block ml-auto px-3 py-1.5 text-xs font-bold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {cancelingOrderId === (o._id || o.id) ? 'Đang hủy...' : 'Hủy đơn'}
                            </button>
                          )}
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
