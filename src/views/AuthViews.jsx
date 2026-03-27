import { useState } from 'react'
import { Mail, Key, User, Chrome, Facebook } from '../components/Icons'

const AuthLayout = ({ side, children }) => (
  <div className="min-h-screen flex items-stretch animate-fade-in">
    <div className="hidden lg:flex lg:w-5/12 relative bg-gray-900">
      <img src={side.img} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
      <div className="relative z-10 flex items-center justify-center p-12 text-white">
        <div>
          <div className="text-4xl font-black mb-1"><span className="text-orange-500">SHOP</span></div>
          <h2 className="text-3xl font-bold mt-4 mb-3 leading-tight">{side.title}</h2>
          <p className="text-white/70 leading-relaxed">{side.desc}</p>
        </div>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  </div>
)

export const LoginView = ({ db, onLogin, onNavigate }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const user = db.users.find((u) => u.email === form.email && u.password === form.password)
      setLoading(false)
      if (!user) return alert('Sai email hoặc mật khẩu!')
      if (user.status === 'locked') return alert('Tài khoản đã bị khóa!')
      onLogin(user)
    }, 600)
  }

  return (
    <AuthLayout side={{ img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000', title: 'Chào mừng trở lại', desc: 'Đăng nhập để khám phá ưu đãi đặc biệt và theo dõi đơn hàng của bạn.' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Đăng nhập</h1>
        <p className="text-gray-400 text-sm mt-1">Điền thông tin để tiếp tục</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input required type="email" placeholder="Email" value={form.email} onChange={set('email')} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" /></div>
        <div className="relative"><Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input required type="password" placeholder="Mật khẩu" value={form.password} onChange={set('password')} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" /></div>
        <button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold transition active:scale-95 shadow-lg shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>
      <div className="grid grid-cols-2 gap-3 mt-5">
        <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 gap-2 text-sm font-medium text-gray-600 transition"><Chrome size={16} className="text-red-500" /> Google</button>
        <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 gap-2 text-sm font-medium text-gray-600 transition"><Facebook size={16} className="text-blue-600" /> Facebook</button>
      </div>
      <p className="text-center text-sm text-gray-500 mt-6">Chưa có tài khoản? <button onClick={() => onNavigate('register')} className="text-orange-600 font-bold hover:underline">Đăng ký ngay</button></p>
      <p className="text-center text-xs text-gray-400 mt-3 bg-gray-50 rounded-lg p-2">Demo: admin@jshop.com / 123</p>
    </AuthLayout>
  )
}

export const RegisterView = ({ db, onRegister, onNavigate }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return alert('Mật khẩu không khớp!')
    if (form.password.length < 6) return alert('Mật khẩu tối thiểu 6 ký tự!')
    if (db.users.some((u) => u.email === form.email)) return alert('Email đã tồn tại!')
    const newUser = { id: Date.now(), ...form, role: 'user', status: 'active', wishlist: [] }
    onRegister(newUser)
  }

  return (
    <AuthLayout side={{ img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1000', title: 'Tham gia JSHOP', desc: 'Tạo tài khoản để nhận ưu đãi và trải nghiệm mua sắm tốt hơn.' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Tạo tài khoản</h1>
        <p className="text-gray-400 text-sm mt-1">Điền thông tin để đăng ký</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Họ tên *" value={form.name} onChange={set('name')} className="border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
          <input required placeholder="Số điện thoại *" value={form.phone} onChange={set('phone')} className="border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
        </div>
        <input required type="email" placeholder="Email *" value={form.email} onChange={set('email')} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
        <input required type="password" placeholder="Mật khẩu *" value={form.password} onChange={set('password')} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
        <input required type="password" placeholder="Nhập lại mật khẩu *" value={form.confirmPassword} onChange={set('confirmPassword')} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition" />
        <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold transition active:scale-95 shadow-lg shadow-orange-200">Đăng ký</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-5">Đã có tài khoản? <button onClick={() => onNavigate('login')} className="text-orange-600 font-bold hover:underline">Đăng nhập</button></p>
    </AuthLayout>
  )
}
