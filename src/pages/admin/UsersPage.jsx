import { useState, useEffect, useMemo } from 'react';
import { Lock, Unlock, Search, ShieldAlert } from '../../components/common/Icons';
import { formatDate } from '../../utils/helpers';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

const UsersPage = () => {
  const addToast = useToastStore((state) => state.addToast);
  const { currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users').then(setUsers);
    api.get('/roles').then(setRoles);
  }, []);

  const displayed = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (id, currentStatus) => {
    // Không thể khóa super admin
    const targetUser = users.find((u) => (u._id || u.id) === id);
    if (
      targetUser &&
      firstAdmin &&
      (targetUser._id === firstAdmin._id || targetUser.id === firstAdmin._id)
    ) {
      addToast('Không thể chỉnh sửa Super Admin', 'error');
      return;
    }

    const newStatus = currentStatus === 'active' ? 'locked' : 'active';
    try {
      await api.put(`/users/${id}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === id ? { ...u, status: newStatus } : u))
      );
      addToast(newStatus === 'locked' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản', 'info');
    } catch (err) {
      addToast(err.message || 'Không thể cập nhật trạng thái', 'error');
    }
  };

  const changeRole = async (id, newRole) => {
    // Admin có thể thay đổi role bất kỳ ai ngoài super admin
    const targetUser = users.find((u) => (u._id || u.id) === id);
    if (
      targetUser &&
      firstAdmin &&
      (targetUser._id === firstAdmin._id || targetUser.id === firstAdmin._id)
    ) {
      addToast('Không thể chỉnh sửa Super Admin', 'error');
      return;
    }

    try {
      await api.put(`/users/${id}`, { role: newRole });
      setUsers((prev) => prev.map((u) => ((u._id || u.id) === id ? { ...u, role: newRole } : u)));
      addToast('Đã cập nhật vai trò', 'success');
    } catch (err) {
      addToast(err.message || 'Không thể cập nhật vai trò', 'error');
    }
  };

  const availableRoles = [
    'user',
    'admin',
    ...roles.map((r) => r.name).filter((n) => n !== 'user' && n !== 'admin'),
  ];

  // Super Admin = admin được tạo sớm nhất, không ai được thay đổi quyền của họ
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const firstAdmin = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin');
    return admins.length === 0
      ? null
      : admins.reduce((oldest, u) =>
          new Date(u.createdAt) < new Date(oldest.createdAt) ? u : oldest
        );
  }, [users]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-bold text-gray-900">
            Quản lý người dùng ({displayed.length}/{users.length})
          </h3>
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
            />
          </div>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">Người dùng</th>
            <th className="p-4 text-left font-semibold text-gray-600">Email</th>
            <th className="p-4 text-left font-semibold text-gray-600">Vai trò</th>
            <th className="p-4 text-left font-semibold text-gray-600">Trạng thái</th>
            <th className="p-4 text-left font-semibold text-gray-600">Ngày tạo</th>
            <th className="p-4 text-left font-semibold text-gray-600">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {displayed.map((u) => {
            const id = u._id || u.id;
            // Đây có phải Super Admin (admin đầu tiên) không?
            const isFirstAdminUser = firstAdmin != null && u._id === firstAdmin._id;
            return (
              <tr key={id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{u.name}</p>
                      {u.isEmailVerified && (
                        <span className="text-[10px] text-green-600 font-semibold">
                          ✓ Đã xác thực
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-500 text-sm">{u.email}</td>
                <td className="p-4">
                  {isFirstAdminUser ? (
                    // Super Admin: badge bất khả xâm phạm
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-50 text-red-700 rounded-lg font-semibold">
                      <ShieldAlert size={11} /> super admin
                    </span>
                  ) : currentUser?.role === 'admin' ? (
                    // Admin (bao gồm super admin) có thể thay đổi role của bất kỳ ai ngoài super admin
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white cursor-pointer font-semibold"
                    >
                      {availableRoles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  ) : (
                    // User thường: chỉ xem, không thay đổi
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                      {u.role}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-lg font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-xs">
                  {u.createdAt ? formatDate(u.createdAt) : '—'}
                </td>
                <td className="p-4">
                  {currentUser?.role === 'admin' && !isFirstAdminUser && (
                    <button
                      onClick={() => toggleStatus(id, u.status)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${u.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                    >
                      {u.status === 'active' ? (
                        <>
                          <Lock size={13} /> Khóa
                        </>
                      ) : (
                        <>
                          <Unlock size={13} /> Mở khóa
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {displayed.length === 0 && (
        <div className="p-12 text-center text-gray-400 text-sm">Không tìm thấy người dùng</div>
      )}
    </div>
  );
};

export default UsersPage;
