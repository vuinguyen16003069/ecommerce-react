import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Heart,
  CheckCircle,
  ChevronUp,
  Edit,
  Trash2,
  AlertCircle,
} from "../components/common/Icons";
import { Modal } from "../components/common/Modal";
import { StarRating } from "../components/common/StarRating";
import ProductCard from "../components/product/ProductCard";
import { formatPrice, formatDate } from "../utils/helpers";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { api } from "../services/api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const addToCart = useCartStore((state) => state.addToCart);
  const { currentUser, toggleWishlist } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("desc");
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingForm, setEditingForm] = useState({ rating: 5, text: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const getReviewId = (review, fallback = "") =>
    String(review?.id || review?._id || fallback);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api.get(`/products/${id}`).then((data) => {
      setProduct(data);
      setLoading(false);
      // Fetch related
      if (data?.category) {
        api.get("/products").then((all) => {
          setRelated(
            all
              .filter(
                (p) =>
                  p.category === data.category &&
                  (p._id || p.id) !== (data._id || data.id),
              )
              .slice(0, 4),
          );
        });
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center animate-fade-in">
        <h2 className="text-4xl font-black text-gray-900 mb-4">
          Sản Phẩm Không Tồn Tại
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Có vẻ như sản phẩm bạn tìm kiếm đang gặp lỗi hoặc đã bị gỡ khỏi hệ
          thống.
        </p>
        <Link
          to="/shop"
          className="bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 transition-all hover:bg-orange-700"
        >
          Trở lại Cửa hàng
        </Link>
      </div>
    );
  }

  const isWished = currentUser?.wishlist?.includes(product._id || product.id);
  const reviewCount = product.reviews?.length || 0;
  const computedAverage = reviewCount
    ? product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
    : 5;
  const averageRating = Number(
    ((product.rating ?? computedAverage) || 5).toFixed(1),
  );
  const roundedStars = Math.min(5, Math.max(0, Math.round(averageRating)));

  const handleAddCart = () => {
    if (!currentUser) {
      addToast("Vui lòng đăng nhập để mua sản phẩm", "error");
      navigate("/login");
      return;
    }
    if (product.stock >= qty) {
      addToCart(product, qty);
      addToast(`Đã thêm ${qty} ${product.name} vào giỏ`, "success");
    }
  };

  const handleWish = () => {
    if (currentUser) {
      toggleWishlist(product._id || product.id);
      addToast(
        isWished ? "Đã gỡ khỏi yêu thích" : "Đã thêm vào yêu thích",
        "info",
      );
    } else {
      addToast("Vui lòng đăng nhập để dùng tính năng này", "error");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!currentUser)
      return addToast("Vui lòng đăng nhập để đánh giá!", "error");
    if (reviewForm.text.trim()) {
      const updatedProduct = await api.post(
        `/products/${product._id || product.id}/reviews`,
        {
          user: currentUser.name,
          rating: reviewForm.rating,
          text: reviewForm.text,
        },
      );
      addToast("Cảm ơn đóng góp của bạn!", "success");
      setReviewForm({ rating: 5, text: "" });
      setProduct(updatedProduct);
    }
  };

  const startEditingReview = (review, fallbackId) => {
    const idValue = getReviewId(review, fallbackId);
    setEditingReviewId(idValue);
    setEditingForm({ rating: review.rating, text: review.text });
  };

  const cancelEditingReview = () => {
    setEditingReviewId(null);
    setEditingForm({ rating: 5, text: "" });
  };

  const submitEditingReview = async (e) => {
    e.preventDefault();
    if (!currentUser || !editingReviewId) return;
    const ownedReview = (product.reviews || []).find(
      (r, idx) => getReviewId(r, idx) === editingReviewId,
    );
    if (!ownedReview || ownedReview.user !== currentUser.name) {
      addToast("Bạn chỉ có thể chỉnh sửa đánh giá của chính mình", "error");
      return;
    }
    if (!editingForm.text.trim()) {
      addToast("Nội dung đánh giá không được để trống", "error");
      return;
    }
    const updatedProduct = await api.put(
      `/products/${product._id || product.id}/reviews/${editingReviewId}`,
      {
        rating: editingForm.rating,
        text: editingForm.text,
      },
    );
    addToast("Đã cập nhật đánh giá", "success");
    setProduct(updatedProduct);
    cancelEditingReview();
  };

  const deleteReview = async (reviewId) => {
    if (!currentUser) return;
    const ownedReview = (product.reviews || []).find(
      (r, idx) => getReviewId(r, idx) === reviewId,
    );
    if (!ownedReview || ownedReview.user !== currentUser.name) {
      addToast("Bạn chỉ có thể xóa đánh giá của chính mình", "error");
      return;
    }
    const updatedProduct = await api.delete(
      `/products/${product._id || product.id}/reviews/${reviewId}`,
    );
    addToast("Đã xoá đánh giá", "info");
    setProduct(updatedProduct);
    if (editingReviewId === reviewId) {
      cancelEditingReview();
    }
    setDeleteTarget(null);
  };

  const openDeleteModal = (review, fallbackId) => {
    if (!currentUser) {
      addToast("Vui lòng đăng nhập để thao tác", "error");
      return;
    }
    if (review.user !== currentUser.name) {
      addToast("Bạn chỉ có thể xóa đánh giá của chính mình", "error");
      return;
    }
    setDeleteTarget({
      id: getReviewId(review, fallbackId),
      user: review.user,
      rating: review.rating,
      text: review.text,
      date: review.date,
    });
  };

  const confirmDeleteReview = () => {
    if (deleteTarget) {
      deleteReview(deleteTarget.id);
    }
  };

  const images = [product.image, ...Array(3).fill(product.image)];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 whitespace-nowrap overflow-x-auto pb-2">
        <Link
          to="/"
          className="hover:text-orange-600 border border-gray-100 rounded-lg px-3 py-1 bg-gray-50 hover:bg-orange-50 transition"
        >
          Trang chủ
        </Link>{" "}
        <ChevronUp size={14} className="rotate-90 flex-shrink-0" />
        <Link
          to={`/shop?category=${product.category}`}
          className="hover:text-orange-600 border border-gray-100 rounded-lg px-3 py-1 bg-gray-50 hover:bg-orange-50 transition"
        >
          {product.category}
        </Link>{" "}
        <ChevronUp size={14} className="rotate-90 flex-shrink-0" />
        <span className="font-semibold text-gray-800 bg-white border border-gray-100 rounded-lg px-3 py-1 shadow-sm truncate max-w-[200px] md:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Product Content grid */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-10 mb-16 shadow-2xl flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="aspect-square bg-gray-50 rounded-[1.5rem] border border-gray-100 overflow-hidden flex items-center justify-center relative group">
            <span className="absolute top-4 left-4 bg-orange-600 text-white font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-md z-10">
              {product.category}
            </span>
            <img
              src={images[activeImg]}
              alt={product.name}
              className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`aspect-square bg-white rounded-xl border flex justify-center items-center overflow-hidden transition-all duration-300 cursor-pointer ${activeImg === idx ? "ring-2 ring-orange-500 border-transparent bg-orange-50/50 shadow-md" : "hover:border-orange-300 hover:shadow-sm"}`}
              >
                <img src={img} alt="" className="w-4/5 h-4/5 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Area */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <span className="font-bold text-yellow-700 text-sm">
                {averageRating}{" "}
                <span className="text-yellow-600/60 font-medium">
                  ({reviewCount})
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
              <CheckCircle size={14} className="text-green-600" />
              <span className="font-bold text-green-700 text-sm">
                Đã bán {product.sold}
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.15] tracking-tight">
            {product.name}
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-xl">
            {product.desc ||
              "Thiết kế hiện đại, chất liệu cao cấp mang lại vẻ đẹp thanh lịch và cảm giác thoải mái."}
          </p>

          <div className="flex flex-wrap items-end gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 w-full max-w-lg">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Giá sản phẩm
              </p>
              {product.isFlashSale ? (
                <div className="flex items-center gap-3 items-end">
                  <div className="text-4xl font-black text-orange-600 tracking-tight">
                    {formatPrice(
                      product.price *
                        (1 - (product.flashSaleDiscount || 50) / 100),
                    )}
                  </div>
                  <div className="text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </div>
                  <div className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-black">
                    -{product.flashSaleDiscount || 50}%
                  </div>
                </div>
              ) : (
                <div className="text-4xl font-black text-orange-600 tracking-tight">
                  {formatPrice(product.price)}
                </div>
              )}
            </div>
            <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
              >
                Trạng thái
              </p>
              <div
                className={`text-lg font-bold flex items-center gap-2 ${product.stock > 0 ? "text-gray-900" : "text-red-500"}`}
              >
                {product.stock > 0 ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>{" "}
                    Còn {product.stock} sản phẩm
                  </>
                ) : (
                  "Hết hàng"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-10 max-w-lg">
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden h-14 shadow-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={product.stock === 0}
                className="w-14 font-black text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-white transition text-lg cursor-pointer"
              >
                -
              </button>
              <div className="w-14 items-center justify-center flex font-bold text-lg text-gray-900 border-x border-gray-100">
                {qty}
              </div>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={product.stock === 0}
                className="w-14 font-black text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-white transition text-lg cursor-pointer"
              >
                +
              </button>
            </div>
            <button
              onClick={handleWish}
              className={`flex-shrink-0 h-14 w-14 rounded-xl flex items-center justify-center border-2 transition cursor-pointer ${isWished ? "bg-red-50 border-red-200 text-red-500" : "border-gray-100 text-gray-400 hover:border-gray-300 hover:text-red-500 hover:bg-gray-50"}`}
            >
              <Heart
                size={24}
                fill={isWished ? "currentColor" : "none"}
                className="transition-transform active:scale-75"
              />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={handleAddCart}
              disabled={product.stock === 0}
              className="flex-1 bg-gray-900 hover:bg-black text-white px-8 py-4.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group shadow-lg hover:shadow-xl"
            >
              <ShoppingCart
                size={20}
                className="group-hover:scale-110 transition-transform"
              />{" "}
              THÊM VÀO GIỎ
            </button>
            <button
              disabled={product.stock === 0}
              onClick={() => {
                handleAddCart();
                navigate("/checkout");
              }}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 shadow-lg shadow-orange-500/30 hover:shadow-xl disabled:cursor-not-allowed cursor-pointer text-lg tracking-wide uppercase"
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16 bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 overflow-x-auto">
          {["desc", "reviews"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-4 px-8 text-center font-bold text-sm tracking-wide rounded-2xl transition capitalize whitespace-nowrap cursor-pointer ${activeTab === t ? "bg-white text-orange-600 shadow-sm border border-gray-100/50" : "text-gray-500 hover:text-gray-800"}`}
            >
              {t === "desc"
                ? "Thông tin chi tiết"
                : `Đánh giá (${product.reviews?.length || 0})`}
            </button>
          ))}
        </div>
        <div className="p-8 md:p-12">
          {activeTab === "desc" ? (
            <div className="prose max-w-none text-gray-600 leading-loose">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded"></div> Đặc điểm
                nổi bật
              </h3>
              <p className="mb-6">
                {product.desc ||
                  "Thiết kế sang trọng, gia công tỉ mỉ. Chất liệu thân thiện mang lại trải nghiệm tối ưu cho người mặc. Phù hợp mọi hoàn cảnh sử dụng."}
              </p>
              <ul className="space-y-4 font-medium grid sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-8 list-none">
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-orange-500" /> Chất
                  liệu tiêu chuẩn 100%
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-orange-500" /> Được sản
                  xuất và kiểm nghiệm khắt khe
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-orange-500" /> Form
                  dáng hiện đại, ôm sát
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-orange-500" /> Bảo hành
                  chính hãng trọn đời
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-orange-500" /> Cam kết
                  đổi trả trong vòng 30 ngày
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
                <div className="md:w-1/3 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
                  <h3 className="font-bold text-gray-900 mb-6 tracking-wide uppercase text-sm">
                    Điểm đánh giá trung bình
                  </h3>
                  <div className="text-7xl font-black text-orange-600 mb-4">
                    {averageRating}
                  </div>
                  <div className="flex text-yellow-400 mb-4 scale-125">
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <Star
                          key={idx}
                          size={20}
                          fill={idx < roundedStars ? "currentColor" : "none"}
                          className={idx < roundedStars ? "" : "text-gray-300"}
                        />
                      ))}
                  </div>
                  <p className="text-gray-500 font-medium">
                    Dựa trên {reviewCount} lượt đánh giá
                  </p>
                </div>

                <div className="md:w-2/3">
                  <form
                    onSubmit={submitReview}
                    className="mb-10 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm focus-within:ring-4 focus-within:ring-orange-50 transition-all"
                  >
                    <h4 className="font-bold text-gray-900 mb-5">
                      Viết đánh giá của bạn
                    </h4>
                    <div className="mb-4">
                      <StarRating
                        rating={reviewForm.rating}
                        setRating={(r) =>
                          setReviewForm((f) => ({ ...f, rating: r }))
                        }
                        interactive
                      />
                    </div>
                    <textarea
                      rows="3"
                      required
                      value={reviewForm.text}
                      onChange={(e) =>
                        setReviewForm((f) => ({ ...f, text: e.target.value }))
                      }
                      className="w-full bg-gray-50 border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-200 focus:bg-white resize-none transition-all placeholder:text-gray-400 font-medium"
                      placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                    ></textarea>
                    <button
                      type="submit"
                      className="mt-4 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition tracking-wide text-sm ms-auto border-0"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                  <div className="space-y-6">
                    {(product.reviews || []).length > 0 ? (
                      product.reviews.map((r, i) => {
                        const reviewId = getReviewId(r, i);
                        const isOwner = currentUser?.name === r.user;
                        const isEditing = editingReviewId === reviewId;
                        return (
                          <div
                            key={reviewId}
                            className="pb-6 border-b border-gray-100 last:border-0 group hover:bg-gray-50 p-4 -mx-4 rounded-xl transition"
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                                {r.user[0]}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">
                                  {r.user}
                                </div>
                                <div className="flex text-yellow-400 mt-0.5">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, idx) => (
                                      <Star
                                        key={idx}
                                        size={10}
                                        fill={
                                          idx < r.rating
                                            ? "currentColor"
                                            : "none"
                                        }
                                        className={
                                          idx >= r.rating ? "text-gray-300" : ""
                                        }
                                      />
                                    ))}
                                </div>
                              </div>
                              <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <span>{formatDate(r.date)}</span>
                                {isOwner && (
                                  <>
                                    <button
                                      type="button"
                                      title="Chỉnh sửa đánh giá"
                                      onClick={() =>
                                        startEditingReview(r, reviewId)
                                      }
                                      className="p-1 text-gray-400 hover:text-orange-600 rounded-md hover:bg-orange-50 transition cursor-pointer"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      title="Xóa đánh giá"
                                      onClick={() =>
                                        openDeleteModal(r, reviewId)
                                      }
                                      className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition cursor-pointer"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            {isEditing ? (
                              <form
                                onSubmit={submitEditingReview}
                                className="space-y-3 mt-2 bg-white border border-orange-100 rounded-2xl p-4"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-semibold text-gray-500 uppercase">
                                    Cập nhật đánh giá
                                  </span>
                                  <StarRating
                                    rating={editingForm.rating}
                                    setRating={(val) =>
                                      setEditingForm((f) => ({
                                        ...f,
                                        rating: val,
                                      }))
                                    }
                                    interactive
                                  />
                                </div>
                                <textarea
                                  rows="3"
                                  value={editingForm.text}
                                  onChange={(e) =>
                                    setEditingForm((f) => ({
                                      ...f,
                                      text: e.target.value,
                                    }))
                                  }
                                  className="w-full bg-gray-50 border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:bg-white resize-none transition"
                                  placeholder="Chỉnh sửa cảm nhận của bạn..."
                                ></textarea>
                                <div className="flex gap-3 justify-end text-sm font-bold">
                                  <button
                                    type="button"
                                    onClick={cancelEditingReview}
                                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition cursor-pointer"
                                  >
                                    Lưu
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {r.text}
                              </p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 italic p-4 bg-gray-50 rounded-xl text-center">
                        Chưa có đánh giá nào. Hãy là người đầu tiên!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-16">
        <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
          Gợi ý dành cho bạn
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {related.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Xóa đánh giá"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
            <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm font-bold text-red-600">
                Bạn có chắc chắn muốn xoá đánh giá này?
              </p>
              <p className="text-xs text-red-500 mt-1">
                Thao tác này không thể hoàn tác và đánh giá sẽ bị xoá vĩnh viễn.
              </p>
            </div>
          </div>
          {deleteTarget && (
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="font-bold text-gray-900 text-sm">
                  {deleteTarget.user}
                </div>
                <div className="flex text-yellow-400 text-xs">
                  {Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        fill={
                          idx < deleteTarget.rating ? "currentColor" : "none"
                        }
                        className={
                          idx < deleteTarget.rating ? "" : "text-gray-300"
                        }
                      />
                    ))}
                </div>
                <span className="ml-auto text-[11px] uppercase tracking-wide text-gray-400">
                  {formatDate(deleteTarget.date)}
                </span>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {deleteTarget.text}
              </p>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm cursor-pointer"
            >
              Giữ lại
            </button>
            <button
              type="button"
              onClick={confirmDeleteReview}
              disabled={!deleteTarget}
              className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-sm shadow-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              Xóa ngay
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
