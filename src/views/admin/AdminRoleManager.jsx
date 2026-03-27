import { useState } from 'react'
import { Plus } from '../../components/Icons'

const AdminRoleManager = ({ db, setDb }) => {
  const [roleName, setRoleName] = useState('')
  const [selected, setSelected] = useState(null)

  const togglePerm = (role, slug) => {
    setDb((p) => {
      const n = structuredClone(p)
      n.roles = n.roles.map((r) => {
        if (r.name !== role) return r
        const s = new Set(r.permissions || [])
        s.has(slug) ? s.delete(slug) : s.add(slug)
        return { ...r, permissions: [...s] }
      })
      return n
    })
  }

  const addRole = (e) => {
    e.preventDefault()
    if (!roleName) return
    setDb((p) => ({ ...p, roles: [...(p.roles || []), { name: roleName, permissions: [] }] }))
    setRoleName('')
  }

  const selectedRole = db.roles?.find((r) => r.name === selected)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-5">Quản lý Vai trò</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <form onSubmit={addRole} className="flex gap-2">
            <input placeholder="Tên vai trò mới" value={roleName} onChange={(e) => setRoleName(e.target.value)} className="flex-1 border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
            <button className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition"><Plus size={16} /></button>
          </form>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {(db.roles || []).map((r) => (
              <button key={r.name} onClick={() => setSelected(r.name)} className={`w-full text-left px-4 py-3 text-sm font-medium transition border-b border-gray-50 last:border-0 ${selected === r.name ? 'bg-orange-50 text-orange-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}>
                {r.name} <span className="text-xs opacity-60">({r.permissions?.length || 0} quyền)</span>
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          {selected ? (
            <>
              <h4 className="font-bold text-gray-800 mb-3">Quyền hạn: <span className="text-orange-600">{selected}</span></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(db.permissions || []).map((p) => (
                  <label key={p.slug} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition">
                    <input type="checkbox" checked={!!(selectedRole?.permissions?.includes(p.slug))} onChange={() => togglePerm(selected, p.slug)} className="rounded accent-orange-600" />
                    <span className="text-sm text-gray-700">{p.name}</span>
                    <span className="text-xs text-gray-400 font-mono ml-auto">{p.slug}</span>
                  </label>
                ))}
              </div>
            </>
          ) : <div className="flex items-center justify-center h-full text-gray-400 text-sm">Chọn vai trò để quản lý quyền hạn</div>}
        </div>
      </div>
    </div>
  )
}

export default AdminRoleManager
