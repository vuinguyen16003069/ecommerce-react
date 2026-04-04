import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Loader } from "./components/common/Loader";
import RequireAuth from "./components/common/RequireAuth";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Lazy-loaded pages
// eslint-disable-next-line react-refresh/only-export-components
const HomePage = lazy(() => import("./pages/HomePage"));
// eslint-disable-next-line react-refresh/only-export-components
const ShopPage = lazy(() => import("./pages/ShopPage"));
// eslint-disable-next-line react-refresh/only-export-components
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
// eslint-disable-next-line react-refresh/only-export-components
const CartPage = lazy(() => import("./pages/CartPage"));
// eslint-disable-next-line react-refresh/only-export-components
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
// eslint-disable-next-line react-refresh/only-export-components
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
// eslint-disable-next-line react-refresh/only-export-components
const LoginPage = lazy(() => import("./pages/LoginPage"));
// eslint-disable-next-line react-refresh/only-export-components
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
// eslint-disable-next-line react-refresh/only-export-components
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
// eslint-disable-next-line react-refresh/only-export-components
const BlogPage = lazy(() => import("./pages/BlogPage"));
// eslint-disable-next-line react-refresh/only-export-components
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));

// Admin pages
// eslint-disable-next-line react-refresh/only-export-components
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
// eslint-disable-next-line react-refresh/only-export-components
const ProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
// eslint-disable-next-line react-refresh/only-export-components
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
// eslint-disable-next-line react-refresh/only-export-components
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
// eslint-disable-next-line react-refresh/only-export-components
const PostsPage = lazy(() => import("./pages/admin/PostsPage"));
// eslint-disable-next-line react-refresh/only-export-components
const RolesPage = lazy(() => import("./pages/admin/RolesPage"));
// eslint-disable-next-line react-refresh/only-export-components
const PermissionsPage = lazy(() => import("./pages/admin/PermissionsPage"));
// eslint-disable-next-line react-refresh/only-export-components
const CouponsPage = lazy(() => import("./pages/admin/CouponsPage"));

// eslint-disable-next-line no-unused-vars
const wrap = (Component, { protectedRoute = false } = {}) => (
  <Suspense fallback={<Loader />}>
    {protectedRoute ? (
      <RequireAuth>
        <Component />
      </RequireAuth>
    ) : (
      <Component />
    )}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: wrap(HomePage) },
      { path: "shop", element: wrap(ShopPage) },
      { path: "product/:id", element: wrap(ProductDetailPage) },
      { path: "cart", element: wrap(CartPage) },
      {
        path: "checkout",
        element: wrap(CheckoutPage, { protectedRoute: true }),
      },
      { path: "profile", element: wrap(ProfilePage, { protectedRoute: true }) },
      { path: "blog", element: wrap(BlogPage) },
      { path: "blog/:id", element: wrap(BlogDetailPage) },
    ],
  },
  {
    path: "/login",
    element: wrap(LoginPage),
  },
  {
    path: "/register",
    element: wrap(RegisterPage),
  },
  {
    path: "/forgot-password",
    element: wrap(ForgotPasswordPage),
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: wrap(DashboardPage) },
      { path: "products", element: wrap(ProductsPage) },
      { path: "orders", element: wrap(OrdersPage) },
      { path: "users", element: wrap(UsersPage) },
      { path: "posts", element: wrap(PostsPage) },
      { path: "coupons", element: wrap(CouponsPage) },
      { path: "roles", element: wrap(RolesPage) },
      { path: "permissions", element: wrap(PermissionsPage) },
    ],
  },
]);
