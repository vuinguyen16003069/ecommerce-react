import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AdminSidebar from '../components/layout/AdminSidebar'

const AdminLayout = () => {
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar onNavigate={(path) => navigate(path === 'home' ? '/' : path)} />
      <main className="ml-60 flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
