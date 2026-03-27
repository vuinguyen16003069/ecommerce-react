import { memo } from 'react'
import { ShoppingCart, Heart, Star } from '../Icons'
import { formatPrice } from '../../utils/helpers'

const ProductCard = memo(({ product, onAddToCart, onClick, isWishlisted, onToggleWishlist }) => (
  <div
    className="bg-white border border-gray-100 rounded-2xl card-hover flex flex-col group overflow-hidden relative cursor-pointer"
    onClick={() => onClick(product)}
  >
    <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {product.stock <= 0 && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
          <span className="text-white font-bold border border-white/60 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest backdrop-blur-sm">Hết hàng</span>
        </div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id) }}
        className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 shadow-md transition-all hover:scale-110 z-20 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>
      {product.stock > 0 && (
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product) }}
            className="bg-white text-gray-800 px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-600 hover:text-white transition shadow-lg flex items-center gap-1.5"
          >
            <ShoppingCart size={14} /> Thêm giỏ
          </button>
        </div>
      )}
    </div>
    <div className="p-3.5 flex flex-col flex-grow">
      <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider mb-1">{product.category}</p>
      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug group-hover:text-orange-600 transition-colors" title={product.name}>{product.name}</h3>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-base font-bold text-orange-600">{formatPrice(product.price)}</span>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Star size={10} fill="#FBBF24" stroke="none" />
          <span>{product.rating}</span>
          <span className="text-gray-300">·</span>
          <span>{product.sold} bán</span>
        </div>
      </div>
    </div>
  </div>
))

export default ProductCard
