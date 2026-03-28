import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Loader } from './components/common/Loader'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))

// Admin pages
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const ProductsPage = lazy(() => import('./pages/admin/ProductsPage'))
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage'))
const UsersPage = lazy(() => import('./pages/admin/UsersPage'))
const PostsPage = lazy(() => import('./pages/admin/PostsPage'))
const RolesPage = lazy(() => import('./pages/admin/RolesPage'))
const PermissionsPage = lazy(() => import('./pages/admin/PermissionsPage'))

const wrap = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: wrap(HomePage) },
      { path: 'shop', element: wrap(ShopPage) },
      { path: 'product/:id', element: wrap(ProductDetailPage) },
      { path: 'cart', element: wrap(CartPage) },
      { path: 'checkout', element: wrap(CheckoutPage) },
      { path: 'profile', element: wrap(ProfilePage) },
      { path: 'blog', element: wrap(BlogPage) },
    ],
  },
  {
    path: '/login',
    element: wrap(LoginPage),
  },
  {
    path: '/register',
    element: wrap(RegisterPage),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: wrap(DashboardPage) },
      { path: 'products', element: wrap(ProductsPage) },
      { path: 'orders', element: wrap(OrdersPage) },
      { path: 'users', element: wrap(UsersPage) },
      { path: 'posts', element: wrap(PostsPage) },
      { path: 'roles', element: wrap(RolesPage) },
      { path: 'permissions', element: wrap(PermissionsPage) },
    ],
  },
])
