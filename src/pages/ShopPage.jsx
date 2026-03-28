import { useState, useMemo, useEffect } from 'react'
import { Filter, Star, ChevronDown, Check } from '../components/common/Icons'
import { useDebounce } from '../hooks/useDebounce'
import ProductCard from '../components/product/ProductCard'
import { SkeletonCard } from '../components/common/SkeletonCard'
import { useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

const ShopPage = () => {
  const [products, setProducts] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'Tất cả'

  const [filterData, setFilterData] = useState({ category: initialCategory, priceRange: [0, 50000000], rating: 0, showInStockOnly: false })
  const [sortField, setSortField] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  const debouncedSearch = useDebounce(searchQuery, 300)
  const debouncedFilter = useDebounce(filterData, 300)

  useEffect(() => {
    api.get('/products').then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  // When filter changes, show skeleton briefly
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [debouncedSearch, debouncedFilter, sortField])

  const categories = ['Tất cả', ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (debouncedSearch) {
      result = result.filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    }
    if (debouncedFilter.category !== 'Tất cả') {
      result = result.filter((p) => p.category === debouncedFilter.category)
    }
    result = result.filter((p) => p.price >= debouncedFilter.priceRange[0] && p.price <= debouncedFilter.priceRange[1])
    if (debouncedFilter.rating > 0) {
      result = result.filter((p) => p.rating >= debouncedFilter.rating)
    }
    if (debouncedFilter.showInStockOnly) {
      result = result.filter((p) => p.stock > 0)
    }

    switch (sortField) {
      case 'priceAsc': result.sort((a, b) => a.price - b.price); break
      case 'priceDesc': result.sort((a, b) => b.price - a.price); break
      case 'ratingDesc': result.sort((a, b) => b.rating - a.rating); break
      case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      default: break
    }
    return result
  }, [debouncedSearch, debouncedFilter, sortField, products])

  const ITEMS_PER_PAGE = 12
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleCategoryChange = (cat) => {
    setFilterData(prev => ({ ...prev, category: cat }))
    setCurrentPage(1)
    if (cat === 'Tất cả') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-sm">
          <div className="flex items-center gap-2 mb-6 font-black text-gray-900 text-lg border-b pb-4"><Filter size={20} className="text-orange-500" /> BỘ LỌC TÌM KIẾM</div>
          
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-sm tracking-wide uppercase">Danh Mục</h3>
            <ul className="space-y-1.5 list-none m-0 p-0 text-sm">
              {categories.map((c) => (
                <li key={c}>
                  <button onClick={() => handleCategoryChange(c)} className={`w-full text-left px-3 py-2 rounded-xl transition font-medium flex items-center justify-between group cursor-pointer ${filterData.category === c ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {c} {filterData.category === c && <Check size={14} className="animate-fade-in" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-sm tracking-wide uppercase">Khoảng Giá (VND)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <input type="number" value={filterData.priceRange[0]} onChange={(e) => { setFilterData((f) => ({ ...f, priceRange: [+e.target.value, f.priceRange[1]] })); setCurrentPage(1) }} className="border border-gray-200 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-200 transition" />
              <input type="number" value={filterData.priceRange[1]} onChange={(e) => { setFilterData((f) => ({ ...f, priceRange: [f.priceRange[0], +e.target.value] })); setCurrentPage(1) }} className="border border-gray-200 rounded-lg p-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-200 transition" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-sm tracking-wide uppercase">Đánh Giá</h3>
            {[5, 4, 3].map((r) => (
              <button key={r} onClick={() => { setFilterData((f) => ({ ...f, rating: f.rating === r ? 0 : r })); setCurrentPage(1) }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer ${filterData.rating === r ? 'bg-orange-50 border-orange-200' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className="flex text-yellow-400">{Array(5).fill(0).map((_, i) => <Star key={i} size={14} fill={i < r ? 'currentColor' : 'none'} className={i >= r ? 'text-gray-300' : ''} />)}</div>
                <span className="text-sm font-medium ml-1">từ {r} sao</span>
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-orange-50 transition border border-transparent hover:border-orange-100 group">
            <input type="checkbox" checked={filterData.showInStockOnly} onChange={(e) => { setFilterData((f) => ({ ...f, showInStockOnly: e.target.checked })); setCurrentPage(1) }} className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 transition" />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-700 transition">Chỉ hiện MỚI CÒN HÀNG</span>
          </label>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="bg-white p-4 rounded-2xl flex flex-wrap items-center justify-between mb-8 shadow-sm border border-gray-100 gap-4">
          <p className="font-medium text-gray-600"><strong className="text-gray-900 text-lg">{filteredProducts.length}</strong> sản phẩm được tìm thấy {(searchQuery || debouncedSearch) && <span className="text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded inline-block ml-1">"{searchQuery || debouncedSearch}"</span>}</p>
          <div className="flex items-center gap-2 relative">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Sắp xếp:</span>
            <div className="relative">
              <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="appearance-none border border-gray-200 text-gray-800 font-semibold rounded-xl pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-gray-50 focus:bg-white cursor-pointer transition text-sm">
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
                <option value="ratingDesc">Đánh giá cao nhất</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 min-h-[500px] content-start">
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : paginatedProducts.length > 0 ? (
            paginatedProducts.map((p) => <ProductCard key={p._id || p.id} product={p} />)
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Vui lòng thử điều chỉnh lại bộ lọc hoặc thay đổi từ khóa tìm kiếm để có kết quả phù hợp hơn.</p>
              <button
                onClick={() => { setFilterData({ category: 'Tất cả', priceRange: [0, 50000000], rating: 0, showInStockOnly: false }); setSearchParams({}) }}
                className="mt-6 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:border-gray-400 transition cursor-pointer"
              >Xóa bộ lọc</button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 bg-white inline-flex mx-auto rounded-full p-2 border border-gray-100 shadow-sm shadow-orange-900/5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent font-bold transition cursor-pointer">←</button>
            {Array(totalPages).fill(0).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-full font-bold text-sm transition-all cursor-pointer ${currentPage === i + 1 ? 'bg-orange-600 text-white shadow-md shadow-orange-500/40' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}>{i + 1}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent font-bold transition cursor-pointer">→</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default ShopPage
