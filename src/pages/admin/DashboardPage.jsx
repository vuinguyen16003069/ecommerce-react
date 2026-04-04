import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'
import { TrendingUp, Package, Settings, Users } from '../../components/common/Icons'
import { formatPrice, formatDate } from '../../utils/helpers'
import { api } from '../../services/api'

Chart.register(...registerables)

const STATUS_COLORS = {
  'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
  'Đang giao': 'bg-blue-100 text-blue-700',
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Đã hủy': 'bg-red-100 text-red-700',
}

const DashboardPage = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const revenueRef = useRef(null)
  const statusRef = useRef(null)
  const revenueChart = useRef(null)
  const statusChart = useRef(null)

  useEffect(() => {
    api.get('/orders').then(setOrders)
    api.get('/products').then(setProducts)
    api.get('/users').then(setUsers)
  }, [])

  useEffect(() => {
    if (!revenueRef.current || orders.length === 0) return

    // Tính doanh thu 6 tháng gần nhất từ dữ liệu thực
    const now = new Date()
    const monthLabels = []
    const monthRevenue = Array(6).fill(0)

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      monthLabels.push(`T${d.getMonth() + 1}/${d.getFullYear().toString().slice(2)}`)
    }

    orders
      .filter(o => o.status !== 'Đã hủy')
      .forEach(o => {
        const d = new Date(o.date)
        for (let i = 0; i < 6; i++) {
          const target = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
          if (d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth()) {
            monthRevenue[i] += o.total
            break
          }
        }
      })

    if (revenueChart.current) revenueChart.current.destroy()
    revenueChart.current = new Chart(revenueRef.current, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Doanh thu (VND)',
          data: monthRevenue,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249,115,22,0.08)',
          tension: 0.4, fill: true, pointBackgroundColor: '#f97316',
        }],
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#f1f5f9' }, ticks: { callback: v => formatPrice(v) } }, x: { grid: { display: false } } } },
    })

    if (statusRef.current) {
      if (statusChart.current) statusChart.current.destroy()
      const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})
      statusChart.current = new Chart(statusRef.current, {
        type: 'doughnut',
        data: { labels: Object.keys(counts), datasets: [{ data: Object.values(counts), backgroundColor: ['#fbbf24', '#60a5fa', '#34d399', '#f87171'], borderWidth: 0 }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' },
      })
    }

    return () => { revenueChart.current?.destroy(); statusChart.current?.destroy() }
  }, [orders])

  const totalRevenue = orders.filter((o) => o.status !== 'Đã hủy').reduce((s, o) => s + o.total, 0)
  const stats = [
    { label: 'Doanh thu', value: formatPrice(totalRevenue), icon: <TrendingUp size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Đơn hàng', value: orders.length, icon: <Package size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sản phẩm', value: products.length, icon: <Settings size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Khách hàng', value: users.filter((u) => u.role === 'user').length, icon: <Users size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  const topProducts = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="mb-6"><h2 className="text-xl font-black text-gray-900">Tổng quan</h2></div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Doanh thu 6 tháng gần nhất</h3>
          <canvas ref={revenueRef}></canvas>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Trạng thái đơn hàng</h3>
          <canvas ref={statusRef}></canvas>
        </div>
      </div>

      {/* Recent orders + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">5 Đơn hàng gần nhất</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-500">Mã đơn</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500">Khách hàng</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500">Tổng</th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-bold text-orange-600 text-xs">#{o.orderId || o._id?.slice(-6)}</td>
                  <td className="p-3 text-gray-700 text-xs font-medium truncate max-w-[100px]">{o.customerName}</td>
                  <td className="p-3 text-gray-800 text-xs font-bold">{formatPrice(o.total)}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan="4" className="p-6 text-center text-xs text-gray-400">Chưa có đơn hàng</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">Top 5 sản phẩm bán chạy</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                <span className="text-xs font-black text-gray-300 w-5 text-center">{i + 1}</span>
                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-black text-orange-600">{p.sold || 0}</p>
                  <p className="text-[10px] text-gray-400">đã bán</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="p-6 text-center text-xs text-gray-400">Chưa có sản phẩm</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
