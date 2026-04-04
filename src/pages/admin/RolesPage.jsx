import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from '../../components/common/Icons'
import { Modal } from '../../components/common/Modal'
import { useToastStore } from '../../store/toastStore'
import { api } from '../../services/api'

const RolesPage = () => {
  const addToast = useToastStore(state => state.addToast)
  const [roles, setRoles] = useState([])
  const [allPerms, setAllPerms] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', permissions: [] })

  useEffect(() => {
    api.get('/roles').then(setRoles)
    api.get('/permissions').then(setAllPerms)
  }, [])

  const openAdd = () => { setEditing(null); setForm({ name: '', permissions: [] }); setModal(true) }
  const openEdit = (r) => { setEditing(r); setForm({ name: r.name, permissions: [...(r.permissions || [])] }); setModal(true) }

  const togglePerm = (slug) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(slug)
        ? f.permissions.filter(s => s !== slug)
        : [...f.permissions, slug]
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (editing) {
      await api.put(`/roles/${editing._id}`, form)
      addToast('Cập nhật vai trò thành công!', 'success')
    } else {
      await api.post('/roles', form)
      addToast('Tạo vai trò thành công!', 'success')
    }
    setModal(false)
    api.get('/roles').then(setRoles)
  }

  const handleDelete = async (id, name) => {
    if (confirm(`Xóa vai trò "${name}"?`)) {
      await api.delete(`/roles/${id}`)
      addToast('Đã xóa vai trò!', 'success')
      api.get('/roles').then(setRoles)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900">Quản lý Vai trò (Roles)</h3>
        <button onClick={openAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition flex items-center gap-1.5 cursor-pointer">
          <Plus size={15} /> Tạo Vai trò mới
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div key={r._id || r.name} className="border border-gray-200 rounded-xl p-4 hover:border-orange-200 transition bg-gray-50/50">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-gray-800">{r.name}</h4>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(r)}
                  className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition cursor-pointer"
                >
                  <Edit size={14} />
                </button>
                {r.name !== 'admin' && (
                  <button
                    onClick={() => handleDelete(r._id, r.name)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Quyền hạn ({r.permissions?.length || 0})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(r.permissions || []).map(slug => (
                  <span key={slug} className="text-xs bg-white border px-2 py-0.5 rounded text-gray-700 truncate max-w-full">{slug}</span>
                ))}
                {(!r.permissions || r.permissions.length === 0) && (
                  <span className="text-xs text-gray-400 italic">Chưa cấp quyền</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? `Sửa vai trò: ${editing.name}` : 'Tạo Vai trò mới'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Tên vai trò</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!!editing}
              placeholder="vd: editor, manager"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 transition disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div className="border-t pt-3 mt-2">
            <label className="text-xs font-bold text-gray-600 block mb-3">
              Cấp quyền hạn — đã chọn {form.permissions.length}/{allPerms.length}
            </label>
            {allPerms.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Chưa có quyền nào. Tạo quyền trước tại trang Quyền hạn.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto admin-scroll pr-2">
                {allPerms.map(p => (
                  <label
                    key={p._id || p.slug}
                    className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition ${form.permissions.includes(p.slug) ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(p.slug)}
                      onChange={() => togglePerm(p.slug)}
                      className="mt-1 flex-shrink-0 text-orange-600 focus:ring-orange-500 rounded border-gray-300"
                    />
                    <div className="overflow-hidden">
                      <p className={`text-xs font-semibold truncate ${form.permissions.includes(p.slug) ? 'text-orange-800' : 'text-gray-700'}`}>{p.name}</p>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{p.slug}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition mt-4">
            {editing ? 'Lưu thay đổi' : 'Tạo cấu hình'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default RolesPage
