import { useState, useEffect } from 'react'
import { ShoppingCart, Search, User, LayoutDashboard, LogOut, Menu } from '../Icons'

const Header = ({ cartCount, onViewChange, currentUser, onLogout, onSearch, currentView }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const navItems = [
    { label: 'Trang chủ', view: 'home' },
    { label: 'Cửa hàng', view: 'shop' },
  ]

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => onViewChange('home')}>
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-orange-200 transition">J</div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block tracking-tight">J<span className="text-orange-600">SHOP</span></span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className={`nav-link text-sm font-semibold transition-colors ${currentView === item.view ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition" onClick={() => setMobileSearch((v) => !v)}>
              <Search size={20} />
            </button>

            {/* Cart */}
            <button onClick={() => onViewChange('cart')} className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition">
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
                      <button onClick={() => onViewChange('admin_dashboard')} className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-2.5 text-sm text-gray-700 hover:text-orange-700 transition font-medium">
                        <LayoutDashboard size={15} /> Quản trị hệ thống
                      </button>
                    )}
                    <button onClick={() => onViewChange('profile')} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2.5 text-sm text-gray-700 transition">
                      <User size={15} /> Tài khoản & Yêu thích
                    </button>
                    <div className="border-t my-1"></div>
                    <button onClick={onLogout} className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2.5 text-sm text-red-500 transition">
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => onViewChange('login')} className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gray-900 hover:bg-orange-600 transition px-4 py-2 rounded-full">
                <User size={15} /> Đăng nhập
              </button>
            )}

            {/* Mobile menu */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" onClick={() => setMobileMenu((v) => !v)}>
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
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Mobile Nav Menu */}
        {mobileMenu && (
          <div className="md:hidden pb-4 border-t pt-3 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => { onViewChange(item.view); setMobileMenu(false) }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${currentView === item.view ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
