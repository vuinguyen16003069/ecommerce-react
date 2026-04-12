import { Link } from 'react-router-dom';
import { ArrowRight } from '../common/Icons';

const AuthLayout = ({ children, title, subtitle, image }) => (
  <div className="min-h-screen bg-white flex animate-fade-in relative z-50">
    <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 xl:px-32 relative">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 group cursor-pointer z-10 hover:text-orange-600 transition font-bold"
      >
        <ArrowRight
          size={20}
          className="rotate-180 group-hover:-translate-x-1 transition-transform"
        />{' '}
        Về trang chủ
      </Link>
      <div className="w-full max-w-md mx-auto relative z-10 pt-16">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-orange-500/30 mb-8 transform -rotate-12 hover:rotate-0 transition duration-500">
          J
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-3">
          {title}
        </h2>
        <p className="text-gray-500 mb-10 font-medium">{subtitle}</p>
        {children}
      </div>
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
    </div>
    <div className="hidden lg:flex flex-1 bg-gray-900 relative items-center justify-center overflow-hidden p-12">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/40 to-transparent"></div>
        <img
          src={image}
          alt="Fashion"
          className="w-full h-full object-cover mix-blend-overlay opacity-60"
        />
      </div>
      <div className="relative z-10 max-w-lg text-center backdrop-blur-md bg-white/10 p-12 rounded-[3rem] border border-white/20 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <div className="flex -space-x-4">
            <img
              className="w-12 h-12 rounded-full border-2 border-gray-900"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt=""
            />
            <img
              className="w-12 h-12 rounded-full border-2 border-gray-900"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
              alt=""
            />
            <div className="w-12 h-12 rounded-full border-2 border-gray-900 bg-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              +99
            </div>
          </div>
        </div>
        <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
          Tham gia với chúng tôi
        </h3>
        <p className="text-gray-300 font-medium">
          Hàng triệu sản phẩm thời trang xu hướng đang chờ đón bạn.
        </p>
      </div>
    </div>
  </div>
);

export default AuthLayout;
