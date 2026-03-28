import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useToastStore } from './store/toastStore'
import { Toast } from './components/common/Toast'

const App = () => {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-orange-200">
      <Outlet />
      <Toast toasts={toasts} removeToast={removeToast} />
      <ScrollRestoration />
    </div>
  )
}

export default App
