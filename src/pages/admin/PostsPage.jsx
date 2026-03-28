import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from '../../components/common/Icons'
import { Modal } from '../../components/common/Modal'
import { formatDate } from '../../utils/helpers'
import { useToastStore } from '../../store/toastStore'
import { api } from '../../services/api'

const PostsPage = () => {
  const addToast = useToastStore(state => state.addToast)
  const [posts, setPosts] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', category: 'Tin tức', image: '', excerpt: '', content: '' })

  const fetchPosts = () => api.get('/posts').then(setPosts)
  useEffect(() => { fetchPosts() }, [])

  const openAdd = () => { setEditing(null); setForm({ title: '', category: 'Tin tức', image: 'https://via.placeholder.com/600x400', excerpt: '', content: '' }); setModal(true) }
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setModal(true) }

  const submit = async (e) => {
    e.preventDefault()
    if (editing) {
      await api.put(`/posts/${editing._id || editing.id}`, form)
      addToast('Cập nhật thành công!', 'success')
    } else {
      await api.post('/posts', { ...form, date: new Date().toISOString() })
      addToast('Thêm bài viết thành công!', 'success')
    }
    setModal(false)
    fetchPosts()
  }
  
  const handleDelete = async (id, title) => {
    if (confirm(`Xóa bài viết "${title}"?`)) {
      await api.delete(`/posts/${id}`)
      addToast('Đã xóa bài viết!', 'success')
      fetchPosts()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900">Danh sách bài viết</h3>
        <button onClick={openAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition flex items-center gap-1.5 cursor-pointer"><Plus size={15} /> Tạo bài viết</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-semibold text-gray-600 text-center w-12">#</th>
              <th className="p-3 font-semibold text-gray-600">Bài viết</th>
              <th className="p-3 font-semibold text-gray-600">Danh mục</th>
              <th className="p-3 font-semibold text-gray-600">Ngày đăng</th>
              <th className="p-3 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((p, idx) => (
              <tr key={p._id || p.id} className="hover:bg-gray-50 transition">
                <td className="p-3 font-mono text-xs text-center text-gray-400">{idx + 1}</td>
                <td className="p-3"><div className="flex items-center gap-3"><img src={p.image} className="w-12 h-8 rounded object-cover border" alt="" /><span className="font-medium text-gray-800 line-clamp-1">{p.title}</span></div></td>
                <td className="p-3 text-orange-600 text-xs font-semibold">{p.category}</td>
                <td className="p-3 text-gray-500 text-xs">{formatDate(p.date)}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(p)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition cursor-pointer"><Edit size={15} /></button>
                  <button onClick={() => handleDelete(p._id || p.id, p.title)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition ml-1 cursor-pointer"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Sửa bài viết' : 'Bài viết mới'}>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Tiêu đề</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 transition" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-gray-600 block mb-1">Danh mục</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white">
                <option value="Tin tức">Tin tức</option><option value="Xu hướng">Xu hướng</option><option value="Khuyến mãi">Khuyến mãi</option>
              </select>
            </div>
            <div><label className="text-xs font-bold text-gray-600 block mb-1">Link ảnh bìa</label><input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 transition" /></div>
          </div>
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Tóm tắt (Excerpt)</label><textarea required rows="2" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 resize-none transition"></textarea></div>
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Nội dung chính</label><textarea required rows="5" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 resize-none transition"></textarea></div>
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">{editing ? 'Ghi đè thay đổi' : 'Đăng bài vào DB'}</button>
        </form>
      </Modal>
    </div>
  )
}

export default PostsPage
