import { useState } from 'react'
import { Trash2 } from '../../components/Icons'

const AdminPermissionManager = ({ db, setDb }) => {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  const add = (e) => {
    e.preventDefault()
    if (!name || !slug) return
    setDb((p) => ({ ...p, permissions: [...(p.permissions || []), { name, slug }] }))
    setName('')
    setSlug('')
  }

  const remove = (s) => {
    if (!confirm('Xóa quyền này?')) return
    setDb((p) => {
      const n = structuredClone(p)
      n.permissions = n.permissions.filter((x) => x.slug !== s)
      n.roles = n.roles.map((r) => ({ ...r, permissions: r.permissions.filter((ps) => ps !== s) }))
      return n
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-5">Quản lý Quyền</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={add} className="space-y-3">
          <input placeholder="Tên quyền" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
          <input placeholder="Slug (e.g. product.add)" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition font-mono" />
          <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition">Thêm quyền</button>
        </form>
        <div className="md:col-span-2 border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="p-3 text-left text-gray-600 font-semibold">Tên</th><th className="p-3 text-left text-gray-600 font-semibold">Slug</th><th className="p-3"></th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {(db.permissions || []).map((p) => (
                <tr key={p.slug} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-gray-500 font-mono text-xs">{p.slug}</td>
                  <td className="p-3 text-right"><button onClick={() => remove(p.slug)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"><Trash2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminPermissionManager
