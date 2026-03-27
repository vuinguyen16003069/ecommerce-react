import { useState, useCallback, useEffect } from 'react'
import { DEFAULT_DB } from './data/db'
import { useStickyState } from './hooks'
import { Toast, ScrollToTop } from './components/ui/SharedUI'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomeView from './views/HomeView'
import ShopView from './views/ShopView'
import ProductDetailView from './views/ProductDetailView'
import CartView from './views/CartView'
import CheckoutView from './views/CheckoutView'
import ProfileView from './views/ProfileView'
import { LoginView, RegisterView } from './views/AuthViews'
import AdminView from './views/admin/AdminView'

const App = () => {
  const [db, setDb] = useStickyState('jshop_db_v2', DEFAULT_DB)
  const [currentUser, setCurrentUser] = useStickyState('jshop_user_v2', null)
  const [cart, setCart] = useStickyState('jshop_cart_v2', [])
  const [view, setView] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((p) => [...p.slice(-4), { id, message, type }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500)
  }, [])

  const removeToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), [])

  const toggleWishlist = useCallback((productId) => {
    if (!currentUser) return toast('Vui lòng đăng nhập!', 'error')
    setDb((prev) => {
      const next = structuredClone(prev)
      const user = next.users.find((u) => u.id === currentUser.id)
      if (!user) return prev
      user.wishlist = user.wishlist?.includes(productId)
        ? user.wishlist.filter((id) => id !== productId)
        : [...(user.wishlist || []), productId]
      return next
    })
    setCurrentUser((prev) => {
      if (!prev) return prev
      const wl = prev.wishlist || []
      return { ...prev, wishlist: wl.includes(productId) ? wl.filter((id) => id !== productId) : [...wl, productId] }
    })
  }, [currentUser, setDb, setCurrentUser, toast])

  const addReview = useCallback((productId, review) => {
    setDb((prev) => {
      const n = structuredClone(prev)
      n.products = n.products.map((p) => p.id === productId ? { ...p, reviews: [review, ...(p.reviews || [])] } : p)
      return n
    })
    setSelectedProduct((prev) => prev?.id === productId ? { ...prev, reviews: [review, ...(prev.reviews || [])] } : prev)
    toast('Cảm ơn đánh giá của bạn!', 'success')
  }, [setDb, toast])

  const addToCart = useCallback((product) => {
    const qty = product.quantity || 1
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id)
      return ex ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i) : [...prev, { ...product, quantity: qty }]
    })
    toast(`Đã thêm "${product.name}" vào giỏ!`, 'success')
  }, [setCart, toast])

  const handleProductClick = useCallback((p) => { setSelectedProduct(p); setView('product-detail') }, [])
  const isWishlisted = useCallback((id) => currentUser?.wishlist?.includes(id) || false, [currentUser])
  const navigate = useCallback((v) => setView(v), [])

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  // Sync currentUser from db when db changes (e.g. admin locks user)
  useEffect(() => {
    if (currentUser) {
      const freshUser = db.users.find((u) => u.id === currentUser.id)
      if (freshUser && freshUser.status === 'locked') {
        setCurrentUser(null)
        toast('Tài khoản của bạn đã bị khóa.', 'error')
        setView('home')
      }
    }
  }, [db.users, currentUser, setCurrentUser, toast])

  // Admin views
  if (view.startsWith('admin')) {
    return (
      <>
        <Toast toasts={toasts} removeToast={removeToast} />
        <AdminView db={db} setDb={setDb} currentUser={currentUser} navigate={navigate} toast={toast} />
      </>
    )
  }

  // Auth views
  if (view === 'login') return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <LoginView db={db} onLogin={(user) => { setCurrentUser(user); toast('Đăng nhập thành công!', 'success'); setView('home') }} onNavigate={navigate} />
    </>
  )
  if (view === 'register') return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <RegisterView db={db} onRegister={(user) => { setDb((p) => ({ ...p, users: [...p.users, user] })); setCurrentUser(user); toast('Đăng ký thành công!', 'success'); setView('home') }} onNavigate={navigate} />
    </>
  )

  // Main content renderer
  const renderMainContent = () => {
    switch (view) {
      case 'product-detail':
        return <ProductDetailView product={selectedProduct} products={db.products} onAddToCart={addToCart} onBack={() => setView('shop')} onAddReview={addReview} currentUser={currentUser} onProductClick={handleProductClick} />
      case 'cart':
        return <CartView cart={cart} onUpdate={(id, n) => setCart((p) => p.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + n) } : i))} onRemove={(id) => setCart((p) => p.filter((i) => i.id !== id))} onNavigate={navigate} coupons={db.coupons} />
      case 'checkout':
        return <CheckoutView cart={cart} currentUser={currentUser} onConfirm={(info) => {
          const updatedProducts = db.products.map((p) => { const c = cart.find((x) => x.id === p.id); return c ? { ...p, stock: p.stock - c.quantity, sold: p.sold + c.quantity } : p })
          const newOrder = { id: `DH${Date.now().toString().slice(-6)}`, userId: currentUser?.id || 'guest', customerName: info.name, customerPhone: info.phone, address: info.address, note: info.note, date: new Date().toISOString(), total: cart.reduce((s, i) => s + i.price * i.quantity, 0), status: 'Chờ xác nhận', items: cart }
          setDb((prev) => ({ ...prev, products: updatedProducts, orders: [newOrder, ...prev.orders] }))
          setCart([])
          toast('Đặt hàng thành công! 🎉', 'success')
          setView(currentUser ? 'profile' : 'home')
        }} onNavigate={navigate} />
      case 'profile':
        return <ProfileView currentUser={currentUser} db={db} onProductClick={handleProductClick} onToggleWishlist={toggleWishlist} onNavigate={navigate} />
      case 'shop':
        return <ShopView products={db.products} onAddToCart={addToCart} onProductClick={handleProductClick} searchTerm={searchTerm} isWishlisted={isWishlisted} onToggleWishlist={toggleWishlist} />
      default:
        return <HomeView db={db} navigate={navigate} handleProductClick={handleProductClick} addToCart={addToCart} isWishlisted={isWishlisted} toggleWishlist={toggleWishlist} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toast toasts={toasts} removeToast={removeToast} />
      <ScrollToTop />
      <Header cartCount={cartCount} onViewChange={navigate} currentUser={currentUser}
        onLogout={() => { setCurrentUser(null); setView('home'); toast('Đã đăng xuất.', 'info') }}
        onSearch={setSearchTerm} currentView={view} />
      <main className="flex-1">{renderMainContent()}</main>
      <Footer onNavigate={navigate} />
    </div>
  )
}

export default App
