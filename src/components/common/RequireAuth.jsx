import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";

const RequireAuth = ({ children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const justLoggedOut = useAuthStore((state) => state.justLoggedOut);
  const addToast = useToastStore((state) => state.addToast);
  const location = useLocation();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!currentUser && !justLoggedOut && !notifiedRef.current) {
      addToast("Vui lòng đăng nhập để tiếp tục", "error");
      notifiedRef.current = true;
    }

    if (currentUser) {
      notifiedRef.current = false;
    }
  }, [currentUser, justLoggedOut, addToast]);

  if (!currentUser) {
    if (justLoggedOut) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
