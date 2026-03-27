import { ChevronRight } from '../components/Icons'
import FlashSale from '../components/product/FlashSale'
import ProductCard from '../components/product/ProductCard'
import BlogView from './BlogView'

const HomeView = ({ db, navigate, handleProductClick, addToCart, isWishlisted, toggleWishlist }) => (
  <>
    {/* Hero */}
    <section className="relative h-[520px] md:h-[600px] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" className="absolute inset-0 w-full h-full object-cover" alt="hero" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl animate-slide-up">
            <p className="text-orange-400 font-bold uppercase tracking-widest text-sm mb-3">Bộ sưu tập 2024</p>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-none mb-6">THỜI TRANG<br /><span className="text-orange-500">MỚI NHẤT</span></h1>
            <p className="text-white/70 mb-8 leading-relaxed">Khám phá những xu hướng thời trang được chọn lọc kỹ lưỡng, phù hợp với mọi phong cách của bạn.</p>
            <div className="flex gap-3">
              <button onClick={() => navigate('shop')} className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 rounded-full font-bold transition shadow-xl hover:-translate-y-0.5 active:scale-95">Mua sắm ngay →</button>
              <button onClick={() => navigate('shop')} className="bg-white/10 hover:bg-white/20 text-white px-7 py-3.5 rounded-full font-bold transition backdrop-blur-sm border border-white/20">Xem tất cả</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[['🚚', 'Miễn phí vận chuyển', 'Cho đơn hàng từ 299K'], ['🔒', 'Thanh toán an toàn', 'Bảo mật 100%'], ['↩️', 'Đổi trả 30 ngày', 'Miễn phí đổi trả'], ['💬', 'Hỗ trợ 24/7', 'Luôn sẵn sàng']].map(([icon, title, desc]) => (
            <div key={title} className="px-6 py-5 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm font-bold text-gray-800">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <FlashSale products={db.products} onProductClick={handleProductClick} />

    {/* Featured Products */}
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">Nổi bật</p>
          <h2 className="text-3xl font-black text-gray-900">Sản Phẩm Hot</h2>
        </div>
        <button onClick={() => navigate('shop')} className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition">Xem tất cả <ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {db.products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} onClick={handleProductClick} onAddToCart={addToCart} isWishlisted={isWishlisted(p.id)} onToggleWishlist={toggleWishlist} />
        ))}
      </div>
    </section>

    {/* Blog */}
    <section className="bg-gray-50 border-t border-gray-100">
      <BlogView posts={db.posts || []} />
    </section>
  </>
)

export default HomeView
