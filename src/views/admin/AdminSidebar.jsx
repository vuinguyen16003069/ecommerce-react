import { LayoutDashboard, Package, Settings, Users, FileText, Key, Lock, LogOut } from '../../components/Icons'

const AdminSidebar = ({ activeTab, onTabChange, onNavigate }) => {
  const items = [
    { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Đơn hàng', icon: <Package size={18} /> },
    { id: 'products', label: 'Sản phẩm', icon: <Settings size={18} /> },
    { id: 'users', label: 'Người dùng', icon: <Users size={18} /> },
    { id: 'posts', label: 'Bài viết', icon: <FileText size={18} /> },
    { id: 'roles', label: 'Vai trò', icon: <Key size={18} /> },
    { id: 'permissions', label: 'Quyền hạn', icon: <Lock size={18} /> },
  ]

  return (
    <div className="w-60 bg-slate-900 text-slate-400 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto admin-scroll z-50">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="font-black text-xl text-white">J<span className="text-orange-500">ADMIN</span></div>
        <p className="text-xs text-slate-500 mt-0.5">Quản trị hệ thống</p>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-slate-200'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-slate-200 transition text-sm font-medium">
          <LogOut size={18} /> Về Website
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
