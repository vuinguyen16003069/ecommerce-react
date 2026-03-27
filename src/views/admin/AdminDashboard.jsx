import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { TrendingUp, Package, Settings, Users } from '../../components/Icons'
import { formatPrice } from '../../utils/helpers'

Chart.register(...registerables)

const AdminDashboard = ({ db }) => {
  const revenueRef = useRef(null)
  const statusRef = useRef(null)
  const revenueChart = useRef(null)
  const statusChart = useRef(null)

  useEffect(() => {
    if (revenueRef.current) {
      if (revenueChart.current) revenueChart.current.destroy()
      revenueChart.current = new Chart(revenueRef.current, {
        type: 'line',
        data: {
          labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
          datasets: [{
            label: 'Doanh thu (VND)',
            data: [500000, 750000, 600000, 900000, 1100000, 1250000],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249,115,22,0.08)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#f97316',
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } },
        },
      })
    }
    if (statusRef.current) {
      if (statusChart.current) statusChart.current.destroy()
      const counts = db.orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})
      statusChart.current = new Chart(statusRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(counts),
          datasets: [{
            data: Object.values(counts),
            backgroundColor: ['#fbbf24', '#60a5fa', '#34d399', '#f87171'],
            borderWidth: 0,
          }],
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' },
      })
    }
    return () => { revenueChart.current?.destroy(); statusChart.current?.destroy() }
  }, [db.orders])

  const totalRevenue = db.orders.filter((o) => o.status !== 'Đã hủy').reduce((s, o) => s + o.total, 0)
  const stats = [
    { label: 'Doanh thu', value: formatPrice(totalRevenue), icon: <TrendingUp size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Đơn hàng', value: db.orders.length, icon: <Package size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sản phẩm', value: db.products.length, icon: <Settings size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Khách hàng', value: db.users.filter((u) => u.role === 'user').length, icon: <Users size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Doanh thu 6 tháng</h3>
          <canvas ref={revenueRef}></canvas>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Trạng thái đơn hàng</h3>
          <canvas ref={statusRef}></canvas>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
