import { useState, useEffect } from 'react'
import { ArrowLeft, ShoppingCart, Star } from '../components/Icons'
import { StarRating } from '../components/ui/SharedUI'
import { formatPrice, formatDate } from '../utils/helpers'

const ProductDetailView = ({ product, products, onAddToCart, onBack, onAddReview, currentUser, onProductClick }) => {
  const [qty, setQty] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [activeImg, setActiveImg] = useState(product?.image)
  const [tab, setTab] = useState('desc')

  useEffect(() => {
    if (product) { setActiveImg(product.image); setQty(1) }
  }, [product])

  if (!product) return null

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleReview = (e) => {
    e.preventDefault()
    if (!currentUser) return alert('Vui lòng đăng nhập để đánh giá!')
    onAddReview(product.id, { id: Date.now(), user: currentUser.name, rating: reviewRating, text: reviewText, date: new Date().toISOString() })
    setReviewText('')
  }

  const allImgs = [product.image, ...(product.images || []).filter((i) => i !== product.image)]
  const uniqueImgs = [...new Set(allImgs)]

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 mb-6 transition group font-medium">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-3 lg:sticky lg:top-24 h-fit">
          <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square border border-gray-100">
            <img src={activeImg} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          {uniqueImgs.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {uniqueImgs.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImg(img)}
                  className={`w-16 h-16 flex-shrink-0 object-cover rounded-xl cursor-pointer border-2 transition ${activeImg === img ? 'border-orange-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  alt=""
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">{product.category}</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-3 mb-2 leading-tight">{product.name}</h1>
            <div className="flex items-center flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5"><StarRating rating={product.rating} /><span className="font-bold text-gray-700">{product.rating}</span></div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">{product.sold} đã bán</span>
              <span className="text-gray-300">|</span>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}</span>
            </div>
          </div>

          <div className="text-3xl font-black text-orange-600">{formatPrice(product.price)}</div>

          {/* Tabs */}
          <div className="border-b">
            {['desc', 'reviews'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`mr-6 pb-2 text-sm font-semibold transition border-b-2 ${tab === t ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                {t === 'desc' ? 'Mô tả' : `Đánh giá (${product.reviews?.length || 0})`}
              </button>
            ))}
          </div>

          {tab === 'desc' && (
            <div className="text-gray-600 leading-relaxed text-sm bg-gray-50 rounded-xl p-4 border border-gray-100">
              {product.desc || 'Chưa có mô tả chi tiết.'}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-4">
              {currentUser && (
                <form onSubmit={handleReview} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Đánh giá:</span>
                    <StarRating rating={reviewRating} setRating={setReviewRating} interactive size={20} />
                  </div>
                  <textarea rows="3" required value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none transition"
                    placeholder="Chia sẻ cảm nhận của bạn..."></textarea>
                  <button className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">Gửi đánh giá</button>
                </form>
              )}
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {product.reviews?.length > 0 ? product.reviews.map((r, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-gray-800">{r.user}</span>
                      <span className="text-xs text-gray-400">{formatDate(r.date)}</span>
                    </div>
                    <StarRating rating={r.rating} />
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.text}</p>
                  </div>
                )) : <p className="text-gray-400 text-sm italic text-center py-6">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>}
              </div>
            </div>
          )}

          {/* Qty + Cart */}
          <div className="flex gap-3 pt-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-12">
              <button className="px-4 hover:bg-gray-50 h-full transition text-lg font-bold text-gray-600" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="w-10 text-center font-bold text-gray-800">{qty}</span>
              <button className="px-4 hover:bg-gray-50 h-full transition text-lg font-bold text-gray-600" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button
              onClick={() => onAddToCart({ ...product, quantity: qty })}
              disabled={product.stock <= 0}
              className={`flex-1 h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition active:scale-95 ${product.stock > 0 ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-200' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              <ShoppingCart size={18} /> {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-5">Sản Phẩm Liên Quan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group" onClick={() => onProductClick(p)}>
                <img src={p.image} className="w-full h-44 object-cover group-hover:scale-105 transition duration-500" loading="lazy" alt={p.name} />
                <div className="p-3">
                  <p className="font-semibold text-sm truncate text-gray-800">{p.name}</p>
                  <p className="text-orange-600 font-bold text-sm mt-1">{formatPrice(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailView
