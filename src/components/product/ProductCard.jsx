import { ShoppingCart, Star, Heart } from '../common/Icons'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/helpers'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const addToCart = useCartStore((state) => state.addToCart)
  const { currentUser, toggleWishlist } = useAuthStore()
  const addToast = useToastStore((state) => state.addToast)

  const isWished = currentUser?.wishlist?.includes((product._id || product.id))

  const handleAddCart = (e) => {
    e.preventDefault()
    if (!currentUser) {
      addToast('Vui lòng đăng nhập để mua sản phẩm', 'error')
      navigate('/login')
      return
    }
    if (product.stock > 0) {
      addToCart(product)
      addToast(`Đã thêm ${product.name} vào giỏ`, 'success')
    }
  }

  const handleWish = (e) => {
    e.preventDefault()
    if (currentUser) {
      toggleWishlist((product._id || product.id))
      addToast(isWished ? 'Đã gỡ khỏi yêu thích' : 'Đã thêm vào yêu thích', 'info')
    } else {
      addToast('Vui lòng đăng nhập để lưu yêu thích', 'error')
    }
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      {/* Stock Overlay */}
      {product.stock <= 0 && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-xl border border-gray-200 shadow-sm shadow-black/5 transform -rotate-12 italic text-gray-800 font-bold whitespace-nowrap">Hết hàng</div>
        </div>
      )}
      {/* Image Area */}
      <Link to={`/product/${(product._id || product.id)}`} className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.isFlashSale && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-black">-{product.flashSaleDiscount || 50}%</div>
        )}
        <img src={product.image} alt={product.name} className="max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-500 ease-out" />
        <button
          className={`absolute top-2 right-2 p-2 rounded-full border border-gray-200 transition-colors z-10 cursor-pointer ${isWished ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'}`}
          onClick={handleWish}
          title="Yêu thích"
        >
          <Heart size={16} fill={isWished ? "currentColor" : "none"} />
        </button>
      </Link>
      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-orange-600 font-bold mb-1.5 uppercase tracking-wide">{product.category}</div>
        <Link to={`/product/${(product._id || product.id)}`} className="font-bold text-gray-800 mb-1 line-clamp-2 hover:text-orange-600 transition min-h-[40px] leading-tight">{product.name}</Link>
        <div className="flex items-center gap-1.5 mb-3"><div className="flex text-yellow-500"><Star size={12} fill="currentColor" /></div><span className="text-xs font-bold text-gray-700">{product.rating}</span><span className="text-xs text-gray-400">({product.reviews?.length || 0})</span><span className="text-xs text-gray-300 mx-1">•</span><span className="text-xs text-gray-500 font-medium">Đã bán {product.sold}</span></div>
        <div className="mt-auto flex items-end justify-between">
          {product.isFlashSale ? (
            <div className="flex items-end gap-2">
              <div className="font-black text-lg text-orange-600 tracking-tight">{formatPrice(product.price * (1 - (product.flashSaleDiscount || 50) / 100))}</div>
              <div className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</div>
            </div>
          ) : (
            <div className="font-black text-lg text-gray-900 tracking-tight">{formatPrice(product.price)}</div>
          )}
          <button
            onClick={handleAddCart}
            disabled={product.stock <= 0}
            className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-orange-600 transition shadow-sm hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group/btn"
          >
            <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
