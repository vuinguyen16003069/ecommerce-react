/**
 * AUTHORIZATION RULES - Quy tắc phân quyền hệ thống
 * 
 * Hệ thống phân quyền dựa trên Role:
 * - user (người dùng thường)
 * - admin (quản trị viên)
 * - manager (quản lý)
 * - staff (nhân viên)
 * - custom roles (vai trò tùy chỉnh khác)
 * 
 * Super Admin = Admin đầu tiên (theo createdAt)
 * ---------
 */

// ✅ PUBLIC Routes - Tất cả đều truy cập được
const publicRoutes = [
  'GET /api/products',
  'GET /api/products/:id',
  'GET /api/products/:id/reviews',
  'GET /api/posts',
  'GET /api/posts/:id',
  'GET /api/coupons',
  'POST /api/users/login',
  'POST /api/users/register',
  'POST /api/users/verify-register-otp',
  'POST /api/users/resend-register-otp',
  'POST /api/users/forgot-password',
  'POST /api/users/reset-password'
];

// 🔐 AUTHENTICATED Routes - Cần đăng nhập
const authenticatedRoutes = [
  'POST /api/products/:id/reviews',       // User thường: từ review sản phẩm
  'PUT /api/products/:id/reviews/:id',    // User: edit review của chính họ
  'DELETE /api/products/:id/reviews/:id', // User: xóa review của chính họ
  'POST /api/orders',                     // User: tạo đơn hàng
  'GET /api/orders/user/:userId',         // User: xem đơn hàng của chính họ
  'PUT /api/orders/:id/cancel',           // User: hủy đơn hàng của chính họ
  'GET /api/users/:id',                   // User: xem thông tin của chính họ
  'POST /api/users/:id/avatar',           // User: upload avatar
  'PUT /api/users/:id',                   // User: update thông tin của chính họ
  'POST /api/users/:userId/wishlist/:productId' // User: thêm/xóa wishlist
];

// 🛡️ ADMIN/MANAGER/STAFF Routes - role !== 'user'
const adminRoutes = [
  'GET /api/orders',                      // Admin view all orders
  'GET /api/products',                    // (already public, but admin view full data)
  'POST /api/products',                   // Create product
  'PUT /api/products/:id',                // Update product
  'DELETE /api/products/:id',             // Delete product
  'POST /api/posts',                      // Create post
  'PUT /api/posts/:id',                   // Update post
  'DELETE /api/posts/:id',                // Delete post
  'PUT /api/orders/:id',                  // Update order status
  'DELETE /api/orders/:id',               // Delete order
  'POST /api/coupons',                    // Create coupon
  'PUT /api/coupons/:id',                 // Update coupon
  'DELETE /api/coupons/:id',              // Delete coupon
  'GET /api/users',                       // List users
  'GET /api/roles',                       // View roles
  'DELETE /api/users/:id'                 // Delete user (check status)
];

// 👑 SUPER ADMIN ONLY Routes
const superAdminRoutes = [
  'POST /api/roles',                      // Create role
  'PUT /api/roles/:id',                   // Modify role
  'DELETE /api/roles/:id',                // Delete role
  'GET /api/permissions',                 // List permissions
  'POST /api/permissions',                // Create permission
  'DELETE /api/permissions/:id',          // Delete permission
  'PUT /api/users/:id' + ' (role/status)' // Change user role/status
];

/**
 * KEY SECURITY RULES:
 * 
 * 1. SUPER ADMIN Protection
 *    - First admin (oldest createdAt) = Super Admin (immutable)
 *    - No one can change super admin's role
 *    - Only super admin can change other roles
 * 
 * 2. USER-LEVEL Checks
 *    - Locked users cannot login or perform any action
 *    - Users can only update their own profile
 *    - Users can only cancel their own orders
 * 
 * 3. ADMIN-LEVEL Checks
 *    - Admin/Manager/Staff can CRUD products, posts, orders, coupons
 *    - Cannot change roles (except super admin)
 *    - Cannot create/delete permissions (super admin only)
 * 
 * 4. Backend Validation
 *    - Verify auth headers: x-user-id, x-user-role, x-user-status
 *    - Check user status is 'active'
 *    - Verify role authorization for protected routes
 *    - Prevent role modification by non-super admins
 * 
 * 5. Frontend Enforcement
 *    - Routes hidden based on role (AdminLayout checks role !== 'user')
 *    - UI controls disabled based on permissions
 *    - Form fields read-only when unauthorized
 */

module.exports = {
  publicRoutes,
  authenticatedRoutes,
  adminRoutes,
  superAdminRoutes
};
