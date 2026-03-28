import { useState, useEffect } from 'react'
import { Lock, Unlock } from '../../components/common/Icons'
import { api } from '../../services/api'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  useEffect(() => { api.get('/users').then(setUsers) }, [])

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'locked' : 'active'
    await api.put(`/users/${id}`, { status: newStatus })
    setUsers(prev => prev.map(u => (u._id || u.id) === id ? { ...u, status: newStatus } : u))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100"><h3 className="font-bold text-gray-900">Quản lý người dùng</h3></div>
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
          {users.map((u) => (
            <tr key={u._id || u.id} className="hover:bg-gray-50 transition">
              <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">{u.name[0]}</div><span className="font-medium text-gray-800">{u.name}</span></div></td>
              <td className="p-4 text-gray-500">{u.email}</td>
              <td className="p-4"><span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold">{u.role}</span></td>
              <td className="p-4"><span className={`text-xs px-2 py-1 rounded-lg font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}</span></td>
              <td className="p-4">{u.role !== 'admin' && (
                <button onClick={() => toggleStatus(u._id || u.id, u.status)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${u.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                  {u.status === 'active' ? <><Lock size={13} /> Khóa</> : <><Unlock size={13} /> Mở khóa</>}
                </button>
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage
