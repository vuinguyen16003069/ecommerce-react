// ─── MOCK DATA ──────────────────────────────────────────────────────────────
export const DEFAULT_DB = {
  products: [
    { id: 1, name: 'Áo Thun Basic Cotton 100%', price: 150000, category: 'Thời trang nam', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=500'], rating: 4.5, sold: 120, stock: 10, desc: 'Chất liệu thoáng mát, thấm hút mồ hôi. Phù hợp mặc hàng ngày.', reviews: [], createdAt: '2023-01-01' },
    { id: 2, name: 'Giày Sneaker Sport Pro', price: 850000, category: 'Giày dép', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500'], rating: 5, sold: 54, stock: 5, desc: 'Đế êm, chuyên dụng chạy bộ. Thiết kế khí động học.', reviews: [], createdAt: '2023-02-01' },
    { id: 3, name: 'Đồng Hồ Classic Leather', price: 1200000, category: 'Phụ kiện', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500'], rating: 4, sold: 32, stock: 0, desc: 'Dây da thật, chống nước 3ATM. Kính sapphire chống trầy.', reviews: [], createdAt: '2023-03-01' },
    { id: 4, name: 'Ba Lô Laptop Chống Nước', price: 450000, category: 'Phụ kiện', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500'], rating: 4.8, sold: 89, stock: 100, desc: 'Đựng vừa laptop 15.6 inch. Có ngăn chống sốc.', reviews: [], createdAt: '2023-04-01' },
    { id: 5, name: 'Váy Hoa Nhí Vintage', price: 350000, category: 'Thời trang nữ', image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=500'], rating: 4.3, sold: 210, stock: 45, desc: 'Phong cách nhẹ nhàng, vải voan lụa cao cấp.', reviews: [], createdAt: '2023-05-01' },
    { id: 6, name: 'Tai Nghe Bluetooth Bass', price: 590000, category: 'Công nghệ', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500'], rating: 4.9, sold: 300, stock: 60, desc: 'Pin 20h, chống ồn chủ động. Âm bass mạnh mẽ.', reviews: [], createdAt: '2023-06-01' },
    { id: 7, name: 'Áo Khoác Bomber J', price: 650000, category: 'Thời trang nam', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500'], rating: 4.7, sold: 45, stock: 20, desc: 'Phong cách đường phố, giữ ấm tốt.', reviews: [], createdAt: '2023-07-01' },
    { id: 8, name: 'Túi Xách Da Công Sở', price: 950000, category: 'Phụ kiện', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500', images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500'], rating: 4.6, sold: 28, stock: 15, desc: 'Da tổng hợp cao cấp, sang trọng.', reviews: [], createdAt: '2023-08-01' },
  ],
  permissions: [
    { slug: 'product.add', name: 'Thêm sản phẩm' },
    { slug: 'product.edit', name: 'Chỉnh sửa sản phẩm' },
    { slug: 'product.delete', name: 'Xóa sản phẩm' },
    { slug: 'order.manage', name: 'Quản lý đơn hàng' },
    { slug: 'user.manage', name: 'Quản lý người dùng' },
    { slug: 'role.manage', name: 'Quản lý vai trò' },
    { slug: 'permission.manage', name: 'Quản lý quyền' },
    { slug: 'post.manage', name: 'Quản lý bài viết' },
  ],
  roles: [
    { name: 'admin', permissions: ['product.add','product.edit','product.delete','order.manage','user.manage','role.manage','permission.manage','post.manage'] },
    { name: 'manager', permissions: ['product.add','product.edit','order.manage','post.manage'] },
    { name: 'staff', permissions: ['order.manage'] },
    { name: 'user', permissions: [] },
  ],
  users: [
    { id: 1, name: 'Admin User', email: 'admin@jshop.com', password: '123', role: 'admin', status: 'active', phone: '0901234567', wishlist: [] },
    { id: 2, name: 'Khách Hàng Mẫu', email: 'khach@jshop.com', password: '123', role: 'user', status: 'active', phone: '0912345678', wishlist: [1, 2] },
    { id: 3, name: 'Khách Hàng Bị Khóa', email: 'locked@jshop.com', password: '123', role: 'user', status: 'locked', phone: '0988888888', wishlist: [] },
  ],
  orders: [
    { id: 'DH902184', userId: 2, customerName: 'Nguyễn Văn A', customerPhone: '0912345678', address: '123 Hà Nội', date: '2023-12-01T09:00:00.000Z', total: 1000000, status: 'Hoàn thành', items: [{ id: 1, name: 'Áo Thun Basic', quantity: 2, price: 150000 }, { id: 2, name: 'Giày Sneaker', quantity: 1, price: 700000 }] },
  ],
  posts: [
    { id: 1, title: 'Xu hướng thời trang Hè 2024', author: 'Admin User', date: '2024-05-01', content: 'Năm nay, các gam màu pastel nhẹ nhàng sẽ lên ngôi. Chất liệu linen thoáng mát là lựa chọn hàng đầu cho những ngày nắng nóng...', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=500' },
    { id: 2, title: 'Cách bảo quản giày Sneaker bền đẹp', author: 'Admin User', date: '2024-06-15', content: 'Để giày luôn như mới, bạn nên vệ sinh định kỳ 2 tuần/lần. Tránh phơi trực tiếp dưới ánh nắng mặt trời...', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=500' },
  ],
  coupons: [
    { code: 'JSHOP10', discount: 0.1, desc: 'Giảm 10% cho mọi đơn hàng' },
    { code: 'WELCOME', discount: 0.15, desc: 'Giảm 15% cho thành viên mới' },
  ],
}
