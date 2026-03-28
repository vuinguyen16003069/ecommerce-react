import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useToastStore } from '../../store/toastStore'
import { ShoppingCart, Search, User, LayoutDashboard, LogOut, Menu } from '../common/Icons'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  
  const { currentUser, logout } = useAuthStore()
  const cart = useCartStore((state) => state.cart)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const addToast = useToastStore((state) => state.addToast)
  
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentView = location.pathname

  const initialSearch = searchParams.get('q') || ''
  const [searchValue, setSearchValue] = useState(initialSearch)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setSearchValue(val)
    if (val.trim()) {
      navigate(`/shop?q=${encodeURIComponent(val)}`)
    } else if (currentView === '/shop') {
      navigate('/shop')
    }
  }

  const navItems = [
    { label: 'Trang chủ', view: '/' },
    { label: 'Cửa hàng', view: '/shop' },
  ]

  const handleLogout = () => {
    logout()
    addToast('Đã đăng xuất', 'info')
  }

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-orange-200 transition">J</div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block tracking-tight"><span className="text-orange-600">SHOP</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.view}
                to={item.view}
                className={`nav-link text-sm font-semibold transition-colors ${currentView === item.view ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchValue}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition"
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition cursor-pointer" onClick={() => setMobileSearch((v) => !v)}>
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                  <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden lg:block max-w-[90px] truncate text-gray-700">{currentUser.name}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block">
                  <div className="bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-fade-in ring-1 ring-black/5">
                    <div className="px-4 py-3 bg-gradient-to-br from-orange-50 to-red-50 border-b">
                      <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-bold uppercase">{currentUser.role}</span>
                    </div>
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-2.5 text-sm text-gray-700 hover:text-orange-700 transition font-medium">
                        <LayoutDashboard size={15} /> Quản trị hệ thống
                      </Link>
                    )}
                    <Link to="/profile" className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2.5 text-sm text-gray-700 transition">
                      <User size={15} /> Tài khoản & Yêu thích
                    </Link>
                    <div className="border-t my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2.5 text-sm text-red-500 transition cursor-pointer">
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gray-900 hover:bg-orange-600 transition px-4 py-2 rounded-full">
                <User size={15} /> Đăng nhập
              </Link>
            )}

            {/* Mobile menu */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer" onClick={() => setMobileMenu((v) => !v)}>
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearch && (
          <div className="md:hidden pb-3 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                autoFocus
                type="text"
                value={searchValue}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                onChange={handleSearch}
              />
            </div>
          </div>
        )}

        {/* Mobile Nav Menu */}
        {mobileMenu && (
          <div className="md:hidden pb-4 border-t pt-3 animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.view}
                to={item.view}
                onClick={() => setMobileMenu(false)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${currentView === item.view ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
