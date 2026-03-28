import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, ShieldAlert, CheckCircle, Lock } from '../components/common/Icons'
import { api } from '../services/api'
import { useToastStore } from '../store/toastStore'
import AuthLayout from '../components/layout/AuthLayout'

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP + New Password, 3: Success
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const addToast = useToastStore(state => state.addToast)

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/users/forgot-password', { email })
      addToast('Mã OTP đã được gửi đến email của bạn!', 'success')
      setStep(2)
    } catch (err) {
      addToast(err.message || 'Email không tồn tại', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!otp || !newPassword) {
      addToast('Vui lòng nhập đầy đủ OTP và mật khẩu mới!', 'error')
      return
    }

    setLoading(true)
    try {
      await api.post('/users/reset-password', { email, otp, newPassword })
      addToast('Mật khẩu của bạn đã được đặt lại thành công!', 'success')
      setStep(3)
    } catch (err) {
      addToast(err.message || 'Mã OTP không hợp lệ', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (step === 3) {
    return (
      <AuthLayout title="Thành công!" subtitle="Bạn đã đặt lại mật khẩu thành công." image="https://images.unsplash.com/photo-1516321318423-f06f70a504f9?auto=format&fit=crop&w=1200&q=80">
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex flex-col items-center text-center mb-8">
          <CheckCircle size={48} className="text-green-500 mb-4" />
          <h3 className="font-bold text-lg text-green-800 mb-2">Thành công!</h3>
          <p className="text-green-700 text-sm mb-4">Mật khẩu của bạn đã được thay đổi. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.</p>
        </div>
        <Link to="/login" className="w-full bg-green-600 text-white font-black py-4.5 rounded-2xl shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 group">
          QUAY LẠI ĐĂNG NHẬP <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </AuthLayout>
    )
  }

  if (step === 2) {
    return (
      <AuthLayout title="Xác nhận OTP" subtitle="Nhập mã OTP 6 số từ email và mật khẩu mới." image="https://images.unsplash.com/photo-1516321318423-f06f70a504f9?auto=format&fit=crop&w=1200&q=80">
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="relative group">
            <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
            <input
              required
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition outline-none tracking-[0.5em] text-center font-mono"
              placeholder="Nhập 6 số OTP"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
            <input
              required
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition outline-none"
              placeholder="Mật khẩu mới"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-600 text-white font-black py-4.5 rounded-2xl shadow-lg hover:bg-orange-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 group cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>ĐẶT LẠI MẬT KHẨU <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button type="button" onClick={() => setStep(1)} className="text-gray-500 font-medium hover:text-orange-600 transition-colors cursor-pointer">
            Chưa nhận được mã? Gửi lại
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Quên mật khẩu?" subtitle="Nhập email của bạn để nhận mã OTP." image="https://images.unsplash.com/photo-1516321318423-f06f70a504f9?auto=format&fit=crop&w=1200&q=80">
      <form onSubmit={handleRequestOTP} className="space-y-6">
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition outline-none"
            placeholder="Email đăng nhập"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-orange-600 text-white font-black py-4.5 rounded-2xl shadow-lg hover:bg-orange-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 group cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>GỬI MÃ OTP <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" /></>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-500 font-medium">Nhớ mật khẩu rồi? <Link to="/login" className="text-orange-600 font-bold hover:underline">Đăng nhập ngay</Link></p>
      </div>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
