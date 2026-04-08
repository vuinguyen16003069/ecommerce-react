import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Ticket } from '../../components/common/Icons'
import { Modal } from '../../components/common/Modal'
import { useToastStore } from '../../store/toastStore'
import { api } from '../../services/api'

const CouponsPage = () => {
  const addToast = useToastStore(state => state.addToast)
  const [coupons, setCoupons] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ code: '', discount: '', desc: '' })

  const fetchCoupons = () => api.get('/coupons').then(setCoupons)
  useEffect(() => { fetchCoupons() }, [])

  const openAdd = () => { setEditing(null); setForm({ code: '', discount: '', desc: '' }); setModal(true) }
  const openEdit = (c) => { setEditing(c); setForm({ code: c.code, discount: c.discount, desc: c.desc || '' }); setModal(true) }

  const submit = async (e) => {
    e.preventDefault()
    const data = { ...form, discount: +form.discount }
    try {
      if (editing) {
        await api.put(`/coupons/${editing._id}`, data)
        addToast('Cập nhật mã giảm giá thành công!', 'success')
      } else {
        await api.post('/coupons', data)
        addToast('Thêm mã giảm giá thành công!', 'success')
      }
      setModal(false)
      fetchCoupons()
    } catch (err) {
      addToast(err.message || 'Đã xảy ra lỗi', 'error')
    }
  }

  const handleDelete = async (id, code) => {
    if (confirm(`Xóa mã "${code}"?`)) {
      try {
        await api.delete(`/coupons/${id}`)
        addToast('Đã xóa mã giảm giá!', 'success')
        fetchCoupons()
      } catch (err) {
        addToast(err.message || 'Không thể xóa mã giảm giá', 'error')
      }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-gray-900">Quản lý Mã giảm giá</h3>
          <p className="text-xs text-gray-400 mt-0.5">{coupons.length} mã đang hoạt động</p>
        </div>
        <button onClick={openAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition flex items-center gap-1.5 cursor-pointer">
          <Plus size={15} /> Tạo mã mới
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="py-20 text-center">
          <Ticket size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Chưa có mã giảm giá nào</p>
          <button onClick={openAdd} className="mt-4 text-orange-600 text-sm font-bold hover:underline cursor-pointer">+ Tạo mã đầu tiên</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c._id} className="border border-gray-200 rounded-xl p-4 hover:border-orange-200 transition group relative bg-gray-50/50">
              {/* Coupon ticket style top bar */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Ticket size={16} />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 font-mono text-sm tracking-wider">{c.code}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Mã giảm giá</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => openEdit(c)} className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition cursor-pointer"><Edit size={13} /></button>
                  <button onClick={() => handleDelete(c._id, c.code)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"><Trash2 size={13} /></button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 mt-3">
                <div>
                  <p className="text-2xl font-black text-orange-600">{c.discount}%</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Giảm giá</p>
                </div>
                {c.desc && (
                  <p className="text-xs text-gray-500 text-right max-w-[120px] italic">{c.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá mới'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Mã code</label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
              placeholder="vd: SALE50, GIAM20"
              disabled={!!editing}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 transition font-mono uppercase tracking-wider disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Mức giảm (%)</label>
            <input
              required
              type="number"
              min="1"
              max="100"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              placeholder="vd: 10, 20, 50"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Mô tả (tùy chọn)</label>
            <input
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="vd: Áp dụng cho đơn từ 200k"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
            {editing ? 'Lưu thay đổi' : 'Tạo mã giảm giá'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default CouponsPage
