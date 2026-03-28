import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from '../../components/common/Icons'
import { Modal } from '../../components/common/Modal'
import { formatPrice } from '../../utils/helpers'
import { useToastStore } from '../../store/toastStore'
import { api } from '../../services/api'

const ProductsPage = () => {
  const addToast = useToastStore(state => state.addToast)
  const [products, setProducts] = useState([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', category: 'Thời trang nam', stock: '', image: '', desc: '', isFlashSale: false, flashSaleDiscount: 50 })

  const fetchProducts = () => api.get('/products').then(setProducts)
  useEffect(() => { fetchProducts() }, [])

  const openAdd = () => { setEditing(null); setForm({ name: '', price: '', category: 'Thời trang nam', stock: '', image: 'https://via.placeholder.com/400', desc: '', isFlashSale: false, flashSaleDiscount: 50 }); setModal(true) }
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setModal(true) }

  const submit = async (e) => {
    e.preventDefault()
    const data = {
      ...form,
      price: +form.price,
      stock: +form.stock,
      flashSaleDiscount: form.isFlashSale ? +form.flashSaleDiscount : 0
    }
    if (editing) {
      await api.put(`/products/${editing._id || editing.id}`, data)
      addToast('Cập nhật thành công!', 'success')
    } else {
      await api.post('/products', { ...data, sold: 0, rating: 0, reviews: [] })
      addToast('Thêm sản phẩm thành công!', 'success')
    }
    setModal(false)
    fetchProducts()
  }
  
  const handleDelete = async (id, name) => {
    if (confirm(`Xóa "${name}"?`)) {
      await api.delete(`/products/${id}`)
      addToast('Đã xóa sản phẩm!', 'success')
      fetchProducts()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-900">Danh sách sản phẩm ({products.length})</h3>
        <button onClick={openAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition flex items-center gap-1.5 cursor-pointer"><Plus size={15} /> Thêm mới</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-semibold text-gray-600">Sản phẩm</th>
              <th className="p-3 font-semibold text-gray-600">Giá</th>
              <th className="p-3 font-semibold text-gray-600">Tồn</th>
              <th className="p-3 font-semibold text-gray-600">Danh mục</th>
              <th className="p-3 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p._id || p.id} className="hover:bg-gray-50 transition">
                <td className="p-3"><div className="flex items-center gap-3"><img src={p.image} className="w-9 h-9 rounded-lg object-cover border flex-shrink-0" alt="" /><span className="font-medium text-gray-800 truncate max-w-[200px]">{p.name}</span></div></td>
                <td className="p-3 font-bold text-orange-600">{formatPrice(p.price)}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-md text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{p.stock}</span></td>
                <td className="p-3 text-gray-500 text-xs">{p.category}</td>
                <td className="p-3 text-right">
                  <button onClick={() => openEdit(p)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition cursor-pointer"><Edit size={15} /></button>
                  <button onClick={() => handleDelete(p._id || p.id, p.name)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition ml-1 cursor-pointer"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Tên sản phẩm</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-gray-600 block mb-1">Giá (VND)</label><input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" /></div>
            <div><label className="text-xs font-bold text-gray-600 block mb-1">Tồn kho</label><input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" /></div>
          </div>
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Danh mục</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition">
              {['Thời trang nam', 'Thời trang nữ', 'Giày dép', 'Phụ kiện', 'Công nghệ'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Link ảnh</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" /></div>
          <div><label className="text-xs font-bold text-gray-600 block mb-1">Mô tả</label><textarea rows="3" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none transition"></textarea></div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Flash Sale</h4>
            <div className="flex items-center gap-3 mb-3">
              <input type="checkbox" id="isFlashSale" checked={form.isFlashSale} onChange={(e) => setForm({ ...form, isFlashSale: e.target.checked })} className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
              <label htmlFor="isFlashSale" className="text-sm text-gray-700 font-medium cursor-pointer">Bật Flash Sale cho sản phẩm này</label>
            </div>
            {form.isFlashSale && (
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Mức giảm giá (%)</label>
                <input type="number" min="0" max="100" value={form.flashSaleDiscount} onChange={(e) => setForm({ ...form, flashSaleDiscount: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
              </div>
            )}
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">{editing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</button>
        </form>
      </Modal>
    </div>
  )
}

export default ProductsPage
