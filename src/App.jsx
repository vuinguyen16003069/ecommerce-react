import { useEffect } from "react";
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useToastStore } from "./store/toastStore";
import { Toast } from "./components/common/Toast";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const { toasts, removeToast } = useToastStore();
  const justLoggedOut = useAuthStore((state) => state.justLoggedOut);
  const clearJustLoggedOut = useAuthStore((state) => state.clearJustLoggedOut);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!justLoggedOut) return;

    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      return;
    }

    clearJustLoggedOut();
  }, [justLoggedOut, location.pathname, navigate, clearJustLoggedOut]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-orange-200">
      <Outlet />
      <Toast toasts={toasts} removeToast={removeToast} />
      <ScrollRestoration />
    </div>
  );
};

export default App;
