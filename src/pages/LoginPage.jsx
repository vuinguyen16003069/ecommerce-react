import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, ShieldAlert } from '../components/common/Icons';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import AuthLayout from '../components/layout/AuthLayout';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setToken = useAuthStore((state) => state.setToken); // ✅ NEW: Lấy setToken method
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ SECURITY FIX: Server trả về { token, user }
      const response = await api.post('/users/login', { email, password });
      
      // ✅ NEW: Lưu JWT token vào store
      setToken(response.token);
      setCurrentUser(response.user);
      
      addToast(`Xin chào, ${response.user.name}!`, 'success');
      const fallback = response.user.role === 'admin' ? '/admin' : '/';
      const redirectTo = location.state?.from?.pathname ?? fallback;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Mừng trở lại!"
      subtitle="Vui lòng đăng nhập để tiếp tục mua sắm."
      image="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80"
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 font-medium mb-6 animate-shake">
          <ShieldAlert size={20} /> {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="relative group">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors"
            size={20}
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition outline-none"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-400 transition outline-none"
            placeholder="Mật khẩu"
          />
        </div>
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 transition cursor-pointer"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-gray-900 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-gray-200 hover:bg-orange-600 hover:shadow-orange-500/30 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 group mt-4 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              ĐĂNG NHẬP{' '}
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </>
          )}
        </button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-gray-500 font-medium">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-orange-600 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
