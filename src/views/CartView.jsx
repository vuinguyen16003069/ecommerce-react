import { useState } from 'react'
import { ShoppingCart, Trash2, CheckCircle } from '../components/Icons'
import { formatPrice } from '../utils/helpers'

const CartView = ({ cart, onUpdate, onRemove, onNavigate, coupons }) => {
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const discountAmt = subtotal * discount

  const applyCoupon = () => {
    const coupon = coupons.find((c) => c.code === code.trim().toUpperCase())
    if (coupon) { setDiscount(coupon.discount) }
    else { setDiscount(0); alert('Mã giảm giá không hợp lệ!') }
  }

  if (cart.length === 0) return (
    <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
      <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingCart size={44} className="text-orange-300" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
      <p className="text-gray-400 mb-6">Hãy thêm vài sản phẩm yêu thích vào giỏ nhé!</p>
      <button onClick={() => onNavigate('shop')} className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition shadow-lg">
        Khám phá cửa hàng
      </button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Giỏ Hàng ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
              <img src={item.image} className="w-20 h-20 object-cover rounded-xl border border-gray-100 flex-shrink-0" alt={item.name} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                  <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition flex-shrink-0"><Trash2 size={16} /></button>
                </div>
                <p className="text-xs text-gray-400 mb-2">{item.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-600">{formatPrice(item.price * item.quantity)}</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                    <button className="px-2.5 hover:bg-gray-50 h-full text-gray-600 transition text-sm" onClick={() => onUpdate(item.id, -1)}>−</button>
                    <span className="px-2 text-sm font-bold text-gray-700 min-w-[28px] text-center">{item.quantity}</span>
                    <button className="px-2.5 hover:bg-gray-50 h-full text-gray-600 transition text-sm" onClick={() => onUpdate(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:sticky lg:top-24 space-y-4">
            <h3 className="font-bold text-gray-900">Tóm tắt đơn hàng</h3>
            <div className="flex gap-2">
              <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm uppercase tracking-wider focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                placeholder="Mã giảm giá" value={code} onChange={(e) => setCode(e.target.value)} />
              <button onClick={applyCoupon} className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition">Áp dụng</button>
            </div>
            {discount > 0 && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle size={13} /> Mã giảm giá đã được áp dụng!</p>}
            <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
              <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá ({discount * 100}%)</span><span>-{formatPrice(discountAmt)}</span></div>}
              <div className="flex justify-between"><span>Phí vận chuyển</span><span className="text-green-600 font-medium">Miễn phí</span></div>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-orange-600">{formatPrice(subtotal - discountAmt)}</span>
            </div>
            <button onClick={() => onNavigate('checkout')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition shadow-lg shadow-orange-200 active:scale-95">
              Tiến hành thanh toán →
            </button>
            <button onClick={() => onNavigate('shop')} className="w-full text-center text-sm text-gray-500 hover:text-orange-600 transition font-medium">← Tiếp tục mua sắm</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartView
