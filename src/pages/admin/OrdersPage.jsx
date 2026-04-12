import { useState, useEffect, Fragment } from 'react';
import { ChevronDown, ChevronRight } from '../../components/common/Icons';
import { formatPrice, formatDate } from '../../utils/helpers';
import { api } from '../../services/api';

const STATUSES = ['Tất cả', 'Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

const STATUS_STYLE = {
  'Chờ xác nhận': 'bg-yellow-100 text-yellow-700',
  'Đang giao': 'bg-blue-100 text-blue-700',
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Đã hủy': 'bg-red-100 text-red-700',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('Tất cả');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/orders').then(setOrders);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      setOrders((prev) => prev.map((o) => ((o._id || o.id) === id ? { ...o, status } : o)));
    } catch (err) {
      console.error('Không thể cập nhật trạng thái đơn:', err);
    }
  };

  const filtered = filter === 'Tất cả' ? orders : orders.filter((o) => o.status === filter);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'Tất cả' ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Quản lý Đơn hàng</h3>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${filter === s ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${filter === s ? 'bg-white/20 text-white' : 'bg-white text-gray-500'}`}
              >
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 w-8"></th>
            <th className="p-4 text-left font-semibold text-gray-600">Mã đơn</th>
            <th className="p-4 text-left font-semibold text-gray-600">Khách hàng</th>
            <th className="p-4 text-left font-semibold text-gray-600">Tổng tiền</th>
            <th className="p-4 text-left font-semibold text-gray-600">Ngày</th>
            <th className="p-4 text-left font-semibold text-gray-600">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => {
            const id = o._id || o.id;
            const isExpanded = expandedId === id;
            return (
              <Fragment key={id}>
                <tr
                  key={id}
                  className="border-t border-gray-50 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : id)}
                >
                  <td className="p-4 text-gray-400">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </td>
                  <td className="p-4 font-bold text-orange-600">#{o.orderId || id}</td>
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.customerPhone}</p>
                  </td>
                  <td className="p-4 font-bold text-gray-800">{formatPrice(o.total)}</td>
                  <td className="p-4 text-gray-500 text-xs">{formatDate(o.date)}</td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white cursor-pointer"
                    >
                      {['Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* Expanded: order items */}
                {isExpanded && (
                  <tr key={`${id}-detail`} className="bg-orange-50/30 border-t border-orange-100">
                    <td colSpan="6" className="px-8 py-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Chi tiết đơn — {o.items?.length || 0} sản phẩm • Địa chỉ: {o.address}
                      </p>
                      <div className="flex flex-col gap-2">
                        {(o.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100"
                          >
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-10 rounded object-cover border border-gray-100 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                SL: {item.quantity}
                              </p>
                            </div>
                            <p className="text-xs font-black text-orange-600 flex-shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                      {o.note && (
                        <p className="text-xs text-gray-500 mt-3 italic">Ghi chú: {o.note}</p>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-gray-400 text-sm">Không có đơn hàng nào</div>
      )}
    </div>
  );
};

export default OrdersPage;
