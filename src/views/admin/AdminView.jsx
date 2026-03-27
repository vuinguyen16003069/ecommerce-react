import { useState } from 'react'
import { Lock, Unlock } from '../../components/Icons'
import { formatPrice, formatDate } from '../../utils/helpers'
import AdminSidebar from './AdminSidebar'
import AdminDashboard from './AdminDashboard'
import AdminProductManager from './AdminProductManager'
import AdminPostManager from './AdminPostManager'
import AdminRoleManager from './AdminRoleManager'
import AdminPermissionManager from './AdminPermissionManager'

const AdminView = ({ db, setDb, currentUser, navigate, toast }) => {
  const [adminTab, setAdminTab] = useState('dashboard')

  const tabLabels = {
    dashboard: 'Tổng quan',
    products: 'Sản phẩm',
    orders: 'Đơn hàng',
    users: 'Người dùng',
    posts: 'Bài viết',
    roles: 'Vai trò',
    permissions: 'Quyền hạn',
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar activeTab={adminTab} onTabChange={setAdminTab} onNavigate={navigate} />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">{tabLabels[adminTab]}</h2>
            <p className="text-sm text-gray-400">JSHOP Admin Panel</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-xl border border-gray-100">
            <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">{currentUser?.name?.[0]}</div>
            {currentUser?.name}
          </div>
        </div>

        {adminTab === 'dashboard' && <AdminDashboard db={db} />}

        {adminTab === 'products' && (
          <AdminProductManager
            products={db.products}
            onAdd={(p) => { setDb((prev) => ({ ...prev, products: [...prev.products, { ...p, id: Date.now(), sold: 0, rating: 0, reviews: [] }] })); toast('Thêm sản phẩm thành công!', 'success') }}
            onEdit={(p) => { setDb((prev) => ({ ...prev, products: prev.products.map((pr) => pr.id === p.id ? { ...pr, ...p } : pr) })); toast('Cập nhật thành công!', 'success') }}
            onDelete={(id) => { setDb((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) })); toast('Đã xóa sản phẩm!', 'success') }}
          />
        )}

        {adminTab === 'posts' && (
          <AdminPostManager
            posts={db.posts || []}
            currentUser={currentUser}
            onAdd={(p) => { setDb((prev) => ({ ...prev, posts: [...(prev.posts || []), p] })); toast('Đăng bài thành công!', 'success') }}
            onEdit={(p) => { setDb((prev) => ({ ...prev, posts: prev.posts.map((po) => po.id === p.id ? { ...po, ...p } : po) })); toast('Cập nhật bài viết!', 'success') }}
            onDelete={(id) => { setDb((prev) => ({ ...prev, posts: prev.posts.filter((p) => p.id !== id) })); toast('Đã xóa bài viết!', 'success') }}
          />
        )}

        {adminTab === 'roles' && <AdminRoleManager db={db} setDb={setDb} />}
        {adminTab === 'permissions' && <AdminPermissionManager db={db} setDb={setDb} />}

        {adminTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">Người dùng</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Email</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Vai trò</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Trạng thái</th>
                  <th className="p-4 text-left font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {db.users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">{u.name[0]}</div><span className="font-medium text-gray-800">{u.name}</span></div></td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4"><span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold">{u.role}</span></td>
                    <td className="p-4"><span className={`text-xs px-2 py-1 rounded-lg font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}</span></td>
                    <td className="p-4">{u.role !== 'admin' && (
                      <button
                        onClick={() => setDb((prev) => { const n = structuredClone(prev); n.users = n.users.map((usr) => usr.id === u.id ? { ...usr, status: usr.status === 'active' ? 'locked' : 'active' } : usr); return n })}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition ${u.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                      >
                        {u.status === 'active' ? <><Lock size={13} /> Khóa</> : <><Unlock size={13} /> Mở khóa</>}
                      </button>
                    )}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'orders' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
                {db.orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-orange-600">#{o.id}</td>
                    <td className="p-4"><p className="font-medium text-gray-800">{o.customerName}</p><p className="text-xs text-gray-400">{o.customerPhone}</p></td>
                    <td className="p-4 font-bold text-gray-800">{formatPrice(o.total)}</td>
                    <td className="p-4 text-gray-500 text-xs">{formatDate(o.date)}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => setDb((prev) => ({ ...prev, orders: prev.orders.map((or) => or.id === o.id ? { ...or, status: e.target.value } : or) }))}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white"
                      >
                        {['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminView
