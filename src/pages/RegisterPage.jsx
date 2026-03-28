import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, User, Mail, ShieldAlert } from '../components/common/Icons'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import AuthLayout from '../components/layout/AuthLayout'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const setCurrentUser = useAuthStore(state => state.setCurrentUser)
  const addToast = useToastStore(state => state.addToast)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (form.password.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự.')
      setLoading(false)
      return
    }

    try {
      const user = await api.post('/users/register', form)
      setCurrentUser(user)
      addToast('Tạo tài khoản thành công!', 'success')
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Trở thành thành viên để nhận ngay ưu đãi độc quyền." image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 font-medium mb-6 animate-shake"><ShieldAlert size={20} /> {error}</div>}
      <form onSubmit={handleRegister} className="space-y-5">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
          <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition" placeholder="Họ và tên" />
        </div>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition" placeholder="Email đăng nhập" />
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition" placeholder="Mật khẩu (tối thiểu 6 ký tự)" />
        </div>
        <button disabled={loading} type="submit" className="w-full bg-orange-600 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-gray-900 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 group mt-6">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>ĐĂNG KÝ <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" /></>}
        </button>
      </form>
      <div className="mt-8 text-center"><p className="text-gray-500 font-medium">Đã có tài khoản? <Link to="/login" className="text-gray-900 font-bold hover:underline">Đăng nhập ngay</Link></p></div>
    </AuthLayout>
  )
}

export default RegisterPage
