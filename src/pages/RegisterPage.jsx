import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, User, Mail, ShieldAlert, CheckCircle } from '../components/common/Icons';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import AuthLayout from '../components/layout/AuthLayout';

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Register form, 2: OTP verification, 3: Success
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/users/register', form);
      addToast('Mã OTP đã được gửi đến email của bạn!', 'success');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/users/verify-register-otp', {
        email: form.email,
        otp,
      });
      setCurrentUser(response.user);
      addToast('Xác nhận email thành công!', 'success');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await api.post('/users/resend-register-otp', { email: form.email });
      addToast('Mã OTP mới đã được gửi đến email của bạn!', 'success');
    } catch (err) {
      addToast(err.message || 'Không thể gửi lại mã OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Success
  if (step === 3) {
    return (
      <AuthLayout
        title="Thành công!"
        subtitle="Bạn đã đăng ký tài khoản thành công."
        image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
      >
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex flex-col items-center text-center mb-8">
          <CheckCircle size={48} className="text-green-500 mb-4" />
          <h3 className="font-bold text-lg text-green-800 mb-2">Thành công!</h3>
          <p className="text-green-700 text-sm mb-4">
            Bạn đã xác nhận email và có thể bắt đầu mua sắm ngay.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-green-600 text-white font-black py-4.5 rounded-2xl shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 group cursor-pointer"
        >
          TIẾP TỤC SHOPPING{' '}
          <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
      </AuthLayout>
    );
  }

  // Step 2: OTP verification
  if (step === 2) {
    return (
      <AuthLayout
        title="Xác nhận OTP"
        subtitle="Nhập mã OTP 6 số từ email của bạn."
        image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 font-medium mb-6 animate-shake">
            <ShieldAlert size={20} /> {error}
          </div>
        )}
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="relative group">
            <ShieldAlert
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors"
              size={20}
            />
            <input
              required
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition outline-none tracking-[0.5em] text-center font-mono"
              placeholder="Nhập 6 số OTP"
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
              <>
                XÁC NHẬN{' '}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1.5 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading}
            className="text-gray-500 font-medium hover:text-orange-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            Chưa nhận được mã? Gửi lại
          </button>
        </div>
      </AuthLayout>
    );
  }

  // Step 1: Register form
  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Trở thành thành viên để nhận ngay ưu đãi độc quyền."
      image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 font-medium mb-6 animate-shake">
          <ShieldAlert size={20} /> {error}
        </div>
      )}
      <form onSubmit={handleRegister} className="space-y-5">
        <div className="relative group">
          <User
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors"
            size={20}
          />
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition"
            placeholder="Họ và tên"
          />
        </div>
        <div className="relative group">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors"
            size={20}
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition"
            placeholder="Email đăng nhập"
          />
        </div>
        <div className="relative group">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors"
            size={20}
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition"
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-orange-600 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 group mt-6 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              ĐĂNG KÝ{' '}
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </>
          )}
        </button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-gray-500 font-medium">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-gray-900 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
