import { useState } from 'react'
import { formatPrice } from '../utils/helpers'

const CheckoutView = ({ cart, currentUser, onConfirm, onNavigate }) => {
  const [info, setInfo] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: '',
    note: '',
  })
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const set = (key) => (e) => setInfo((p) => ({ ...p, [key]: e.target.value }))

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Xác nhận đơn hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">Thông tin giao hàng</h3>
            <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); onConfirm(info) }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required className="border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition col-span-1" placeholder="Họ và tên *" value={info.name} onChange={set('name')} />
                <input required className="border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" placeholder="Số điện thoại *" value={info.phone} onChange={set('phone')} />
              </div>
              <textarea required rows="2" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none transition" placeholder="Địa chỉ giao hàng *" value={info.address} onChange={set('address')}></textarea>
              <textarea rows="2" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none transition" placeholder="Ghi chú (tùy chọn)" value={info.note} onChange={set('note')}></textarea>
            </form>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">Đơn hàng của bạn</h3>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Tổng thanh toán</span>
              <span className="text-orange-600">{formatPrice(total)}</span>
            </div>
            <button form="checkout-form" type="submit"
              className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition shadow-lg active:scale-95">
              Xác nhận đặt hàng →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutView
