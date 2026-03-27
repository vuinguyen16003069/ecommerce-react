import { useState } from 'react'
import { Plus, Edit, Trash2 } from '../../components/Icons'
import { Modal } from '../../components/ui/SharedUI'
import { formatDate } from '../../utils/helpers'

const AdminPostManager = ({ posts, onAdd, onEdit, onDelete, currentUser }) => {
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', image: '' })

  const openAdd = () => { setEditing(null); setForm({ title: '', content: '', image: '' }); setModal(true) }
  const openEdit = (p) => { setEditing(p); setForm(p); setModal(true) }

  const submit = (e) => {
    e.preventDefault()
    const data = { ...form, author: currentUser?.name || 'Admin', date: new Date().toISOString() }
    editing ? onEdit({ ...data, id: editing.id }) : onAdd({ ...data, id: Date.now() })
    setModal(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900">Bài viết ({posts.length})</h3>
        <button onClick={openAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center gap-1.5"><Plus size={15} /> Viết bài mới</button>
      </div>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex gap-4 items-center hover:border-gray-200 transition">
            {p.image && <img src={p.image} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" alt="" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{p.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.author} · {formatDate(p.date)}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(p)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition"><Edit size={15} /></button>
              <button onClick={() => { if (confirm('Xóa bài này?')) onDelete(p.id) }} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">Chưa có bài viết nào</p>}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Sửa bài viết' : 'Bài viết mới'}>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Tiêu đề</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" /></div>
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Link ảnh bìa</label><input value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" /></div>
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Nội dung</label><textarea required rows="5" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none transition"></textarea></div>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">{editing ? 'Cập nhật' : 'Đăng bài'}</button>
        </form>
      </Modal>
    </div>
  )
}

export default AdminPostManager
