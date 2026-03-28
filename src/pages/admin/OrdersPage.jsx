import { useState, useEffect } from 'react'
import { formatPrice, formatDate } from '../../utils/helpers'
import { api } from '../../services/api'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  useEffect(() => { api.get('/orders').then(setOrders) }, [])

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}`, { status })
    setOrders(prev => prev.map(o => (o._id || o.id) === id ? { ...o, status } : o))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100"><h3 className="font-bold text-gray-900">Quản lý Đơn hàng</h3></div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">Mã đơn</th>
            <th className="p-4 text-left font-semibold text-gray-600">Khách hàng</th>
            <th className="p-4 text-left font-semibold text-gray-600">Tổng tiền</th>
            <th className="p-4 text-left font-semibold text-gray-600">Ngày</th>
            <th className="p-4 text-left font-semibold text-gray-600">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((o) => (
            <tr key={o._id || o.id} className="hover:bg-gray-50 transition">
              <td className="p-4 font-bold text-orange-600">#{o.orderId || o._id}</td>
              <td className="p-4">
                <p className="font-medium text-gray-800">{o.customerName}</p>
                <p className="text-xs text-gray-400">{o.customerPhone}</p>
              </td>
              <td className="p-4 font-bold text-gray-800">{formatPrice(o.total)}</td>
              <td className="p-4 text-gray-500 text-xs">{formatDate(o.date)}</td>
              <td className="p-4">
                <select value={o.status} onChange={(e) => updateStatus(o._id || o.id, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white">
                  {['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersPage
