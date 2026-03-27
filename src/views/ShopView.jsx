import { useState, useMemo, useEffect } from 'react'
import { Filter, ChevronRight, Search } from '../components/Icons'
import { SkeletonCard } from '../components/ui/SharedUI'
import ProductCard from '../components/product/ProductCard'
import { useDebounce } from '../hooks'

const ShopView = ({ products, onAddToCart, onProductClick, searchTerm, isWishlisted, onToggleWishlist }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortOption, setSortOption] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const ITEMS_PER_PAGE = 8
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [activeCategory, debouncedSearch, sortOption])

  useEffect(() => { setCurrentPage(1) }, [activeCategory, debouncedSearch, sortOption])

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products])

  const processed = useMemo(() => {
    let list = products.filter((p) => {
      const catOk = activeCategory === 'All' || p.category === activeCategory
      const searchOk = p.name.toLowerCase().includes((debouncedSearch || '').toLowerCase())
      return catOk && searchOk
    })
    if (sortOption === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sortOption === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    else list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    return list
  }, [products, activeCategory, debouncedSearch, sortOption])

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE)
  const current = processed.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 animate-fade-in">
      {/* Sidebar */}
      <aside className="w-full md:w-56 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:sticky md:top-24 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2 px-1"><Filter size={13} /> Danh Mục</h3>
          <ul className="space-y-0.5">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1) }}
                className={`cursor-pointer px-3 py-2.5 rounded-xl text-sm flex justify-between items-center transition-all font-medium ${activeCategory === cat ? 'bg-orange-600 text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <span>{cat === 'All' ? 'Tất cả' : cat}</span>
                {activeCategory === cat && <ChevronRight size={13} />}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{activeCategory === 'All' ? 'Tất Cả Sản Phẩm' : activeCategory}</h2>
            {!loading && <p className="text-sm text-gray-400">{processed.length} sản phẩm</p>}
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[400px]">
          {loading
            ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            : current.length > 0
              ? current.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onClick={onProductClick} isWishlisted={isWishlisted(p.id)} onToggleWishlist={onToggleWishlist} />
              ))
              : (
                <div className="col-span-full py-24 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search size={28} className="text-gray-300" /></div>
                  <p className="font-semibold text-gray-500">Không tìm thấy sản phẩm nào</p>
                  <p className="text-sm text-gray-400 mt-1">Thử từ khóa khác hoặc chọn danh mục khác</p>
                </div>
              )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">← Trước</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 text-sm border rounded-lg transition ${currentPage === i + 1 ? 'bg-orange-600 text-white border-orange-600' : 'hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">Sau →</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopView
