import { useState, useEffect } from 'react'
import { Zap } from '../Icons'
import { formatPrice, seededPercent } from '../../utils/helpers'

const FlashSale = ({ products, onProductClick }) => {
  const [timeLeft, setTimeLeft] = useState(7200)

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':')
  }

  const items = products.filter((p) => p.stock > 0).slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 text-orange-600 font-black text-xl uppercase italic tracking-tight">
          <Zap size={22} fill="currentColor" /> Flash Sale
        </div>
        <div className="flex gap-1 font-mono font-bold text-sm">
          {fmt(timeLeft).split(':').map((n, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-orange-500">:</span>}
              <span className="bg-gray-900 text-white px-2 py-1 rounded-md min-w-[32px] text-center">{n}</span>
            </span>
          ))}
        </div>
        <span className="ml-auto text-xs text-gray-500">Kết thúc sau khi hết giờ</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((p) => {
          const pct = seededPercent(p.id)
          return (
            <div key={p.id} className="bg-white border border-orange-100 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group" onClick={() => onProductClick(p)}>
              <div className="relative">
                <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-br-lg z-10">-50%</div>
                <img src={p.image} className="w-full h-36 object-cover group-hover:scale-105 transition duration-500" alt={p.name} />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate text-gray-700 mb-1">{p.name}</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-orange-600 font-bold text-sm">{formatPrice(p.price * 0.5)}</span>
                  <span className="text-gray-400 text-xs line-through">{formatPrice(p.price)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
                <p className="text-[10px] text-orange-600 font-semibold mt-1">Đã bán {pct}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FlashSale
