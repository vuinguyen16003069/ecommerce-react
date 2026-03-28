import { useState, useEffect } from 'react'
import { Plus, Trash2 } from '../../components/common/Icons'
import { Modal } from '../../components/common/Modal'
import { useToastStore } from '../../store/toastStore'
import { api } from '../../services/api'

const PermissionsPage = () => {
  const addToast = useToastStore(state => state.addToast)
  const [perms, setPerms] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ slug: '', name: '' })

  const fetchPerms = () => api.get('/permissions').then(setPerms)
  useEffect(() => { fetchPerms() }, [])

  const openAdd = () => { setForm({ slug: '', name: '' }); setModal(true) }

  const submit = async (e) => {
    e.preventDefault()
    await api.post('/permissions', form)
    addToast('Thêm quyền hạn thành công!', 'success')
    setModal(false)
    fetchPerms()
  }

  const handleDelete = async (id, name) => {
    if (confirm(`Bạn có chắc muốn xóa quyền "${name}"?`)) {
      await api.delete(`/permissions/${id}`)
      addToast('Đã xóa quyền hệ thống', 'success')
      fetchPerms()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Quản lý Quyền (Permissions)</h3>
          <p className="text-sm text-gray-500 mt-1">Hệ thống phân quyền</p>
        </div>
        <button onClick={openAdd} className="bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-700 transition flex items-center gap-1.5 cursor-pointer"><Plus size={16} /> Tạo quyền mới</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {perms.map((p) => (
          <div key={p._id || p.slug} className="border border-gray-100 p-3 rounded-lg hover:border-orange-200 transition bg-white flex justify-between group">
            <div>
              <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">{p.slug}</p>
            </div>
            <button onClick={() => handleDelete(p._id, p.name)} className="text-gray-300 hover:text-red-600 transition opacity-0 group-hover:opacity-100 self-start p-1 bg-red-50 rounded-md cursor-pointer"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Tạo quyền hệ thống mới">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Mã Quyền (slug)</label><input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') })} placeholder="vd: view_users" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 transition font-mono" /></div>
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Tên hiển thị</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="vd: Xem danh sách thành viên" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 transition" /></div>
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition mt-2">Thêm quyền</button>
        </form>
      </Modal>
    </div>
  )
}

export default PermissionsPage
