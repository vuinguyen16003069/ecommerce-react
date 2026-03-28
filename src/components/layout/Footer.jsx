import { MapPin, Mail } from '../common/Icons'

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 pt-12 pb-6">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <div className="font-black text-2xl text-white mb-3">J<span className="text-orange-500">SHOP</span></div>
          <p className="text-sm leading-relaxed text-slate-500">Hệ thống thời trang uy tín hàng đầu Việt Nam. Chất lượng — Phong cách — Đẳng cấp.</p>
        </div>
        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Liên hệ</h4>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><MapPin size={14} className="text-orange-500" /> 90 Lưu Quý Kỳ,Hòa Cường Nam,Đà Nẵng</p>
            <p className="flex items-center gap-2"><Mail size={14} className="text-orange-500" /> vuinguyen16003069@gmail.com</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Theo dõi JSHOP</h4>
          <div className="flex gap-3">
            {['Facebook', 'Instagram', 'TikTok'].map((s) => (
              <button key={s} className="text-xs bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-400 px-3 py-2 rounded-lg transition font-medium cursor-pointer">{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
        <p>© 2024 JSHOP. All rights reserved.</p>
        <p>Made with ❤️ in Vietnam</p>
      </div>
    </div>
  </footer>
)

export default Footer
