import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import { ShoppingCart, Search, User, LayoutDashboard, LogOut, Menu } from '../common/Icons';
import { formatPrice, resolveImageUrl } from '../../utils/helpers';
import { api } from '../../services/api';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { currentUser, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const addToast = useToastStore((state) => state.addToast);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isNavActive = (view) => {
    if (view.includes('?')) {
      const [path, query] = view.split('?');
      return location.pathname === path && location.search === `?${query}`;
    }
    return location.pathname === view;
  };

  const searchValue = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(searchValue);
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    api.get('/products').then(setProducts);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Sync input khi URL thay đổi (ví dụ click nav Adidas)
  useEffect(() => {
    const syncInput = () => setInputValue(searchParams.get('q') || '');
    syncInput();
  }, [searchParams]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.trim().length >= 2) {
      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(val.toLowerCase()) ||
            p.category.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const submitSearch = (val) => {
    if (val.trim()) {
      navigate(`/shop?q=${encodeURIComponent(val)}`);
      setShowSuggestions(false);
    }
  };

  const navItems = [
    { label: 'Trang chủ', view: '/' },
    { label: 'Cửa hàng', view: '/shop' },
    { label: 'Blog', view: '/blog' },
    { label: 'Adidas', view: '/shop?q=adidas' },
  ];

  const handleLogout = () => {
    logout();
    addToast('Đã đăng xuất', 'info');
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-orange-200 transition">
              J
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block tracking-tight">
              <span className="text-orange-600">SHOP</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.view}
                to={item.view}
                className={`nav-link text-sm font-semibold transition-colors ${isNavActive(item.view) ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(inputValue);
              }}
              className="relative group"
            >
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={inputValue}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition"
                onChange={handleSearch}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
              />

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50 ring-1 ring-black/5">
                  <div className="p-2">
                    {suggestions.map((p) => (
                      <button
                        key={p._id || p.id}
                        type="button"
                        onClick={() => {
                          setInputValue(p.name);
                          submitSearch(p.name);
                        }}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-orange-50 rounded-xl transition text-left cursor-pointer group/item"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-gray-100/50">
                          <img
                            src={p.image}
                            alt=""
                            className="max-h-full object-contain group-hover/item:scale-110 transition"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                          <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">
                            {p.category}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => submitSearch(inputValue)}
                      className="w-full mt-1 p-2.5 text-center text-xs font-bold text-gray-500 hover:text-orange-600 transition border-t border-gray-50"
                    >
                      Xem tất cả kết quả cho "{inputValue}"
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition cursor-pointer"
              onClick={() => setMobileSearch((v) => !v)}
            >
              <Search size={20} />
            </button>

            {/* Cart with Mini-cart Dropdown */}
            <div className="relative group/cart">
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition block"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Dropdown menu */}
              <div className="absolute right-0 top-full pt-2 w-80 hidden group-hover/cart:block z-50">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-fade-in ring-1 ring-black/5">
                  <div className="p-4 border-b bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-900">
                      Giỏ hàng của tôi ({cartCount})
                    </h3>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {cart.length > 0 ? (
                      <div className="divide-y divide-gray-50">
                        {cart.slice(0, 3).map((item) => (
                          <div
                            key={item._id || item.id}
                            className="p-4 flex gap-3 hover:bg-gray-50 transition"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="max-h-[80%] object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">
                                {item.name}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-[10px] text-gray-500 font-medium">
                                  SL: {item.quantity}
                                </p>
                                <p className="text-xs font-bold text-orange-600">
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {cart.length > 3 && (
                          <div className="p-2 text-center text-[10px] text-gray-400 font-medium bg-gray-50/30">
                            Và {cart.length - 3} sản phẩm khác...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="text-3xl mb-2">🛒</div>
                        <p className="text-xs text-gray-500">Giỏ hàng đang trống</p>
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 border-t bg-gray-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Tổng cộng
                        </span>
                        <span className="text-sm font-black text-gray-900">
                          {formatPrice(cart.reduce((s, i) => s + i.price * i.quantity, 0))}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/cart"
                          className="w-full text-center py-2.5 bg-gray-100 text-gray-900 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
                        >
                          GIỎ HÀNG
                        </Link>
                        <Link
                          to="/checkout"
                          className="w-full text-center py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition shadow-lg shadow-gray-200"
                        >
                          THANH TOÁN
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User */}
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                  {currentUser.avatar ? (
                    <img
                      src={resolveImageUrl(currentUser.avatar)}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {currentUser.name[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden lg:block max-w-[90px] truncate text-gray-700">
                    {currentUser.name}
                  </span>
                </button>
                <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block">
                  <div className="bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-fade-in ring-1 ring-black/5">
                    <div className="px-4 py-3 bg-gradient-to-br from-orange-50 to-red-50 border-b">
                      <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-bold uppercase">
                        {currentUser.role}
                      </span>
                    </div>
                    {currentUser.role !== 'user' && (
                      <Link
                        to="/admin"
                        className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-2.5 text-sm text-gray-700 hover:text-orange-700 transition font-medium"
                      >
                        <LayoutDashboard size={15} /> Quản trị hệ thống
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2.5 text-sm text-gray-700 transition"
                    >
                      <User size={15} /> Tài khoản & Yêu thích
                    </Link>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2.5 text-sm text-red-500 transition cursor-pointer"
                    >
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gray-900 hover:bg-orange-600 transition px-4 py-2 rounded-full"
              >
                <User size={15} /> Đăng nhập
              </Link>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              onClick={() => setMobileMenu((v) => !v)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearch && (
          <div className="md:hidden pb-3 animate-fade-in">
            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                autoFocus
                type="text"
                value={inputValue}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                onChange={handleSearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    submitSearch(inputValue);
                    setMobileSearch(false);
                  }
                }}
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
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${isNavActive(item.view) ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
