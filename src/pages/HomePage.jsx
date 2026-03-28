import { ArrowRight } from '../components/common/Icons'
import ProductCard from '../components/product/ProductCard'
import FlashSale from '../components/product/FlashSale'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import { api } from '../services/api'
import { useState, useEffect } from 'react'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/products').then(setProducts)
    api.get('/posts').then(setPosts)
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white min-h-[500px] flex items-center mb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" alt="Hero" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="text-orange-500 font-bold tracking-wider text-sm uppercase mb-4 block">Bộ sưu tập 2024</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">THỜI TRANG<br /><span className="text-orange-600 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">MỚI NHẤT</span></h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">Khám phá những xu hướng thời trang được chọn lọc kỹ lưỡng, phù hợp với mọi phong cách của bạn.</p>
            <div className="flex gap-4">
              <Link to="/shop" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/30 flex items-center gap-2 group">
                Mua sắm ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full font-bold transition">Xem tất cả</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="container mx-auto px-4 -mt-24 relative z-20 mb-16 hidden md:block">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-3 gap-8 divide-x divide-gray-100 border border-gray-50">
          <div className="flex items-center gap-4 px-4"><div className="w-12 h-12 flex items-center justify-center text-3xl">🚚</div><div><h4 className="font-bold text-gray-900">Miễn phí vận chuyển</h4><p className="text-sm text-gray-500">Cho đơn hàng từ 299K</p></div></div>
          <div className="flex items-center gap-4 px-4"><div className="w-12 h-12 flex items-center justify-center text-3xl">🔒</div><div><h4 className="font-bold text-gray-900">Thanh toán an toàn</h4><p className="text-sm text-gray-500">Bảo mật 100%</p></div></div>
          <div className="flex items-center gap-4 px-4"><div className="w-12 h-12 flex items-center justify-center text-3xl">🔄</div><div><h4 className="font-bold text-gray-900">Đổi trả 30 ngày</h4><p className="text-sm text-gray-500">Miễn phí đổi trả</p></div></div>
        </div>
      </section>

      <div className="container mx-auto px-4 mb-16">
        <FlashSale products={products} />
      </div>

      <section className="container mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-8">
          <div><h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Sản phẩm nổi bật</h2><div className="h-1 w-20 bg-orange-600 rounded-full"></div></div>
          <Link to="/shop" className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-1 group">Xem thêm <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.slice(0, 10).map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Tin tức & Xu hướng</h2>
          <p className="text-gray-500">Cập nhật những thông tin thời trang mới nhất</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((p) => (
            <div key={p._id || p.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-4 h-[240px]"><img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div>
              <div className="flex gap-2 mb-3"><span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">{p.category}</span><span className="text-xs font-medium text-gray-500 flex items-center">{formatDate(p.date)}</span></div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition line-clamp-2">{p.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{p.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
