import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, FileText, Search } from '../components/common/Icons';
import { formatDate } from '../utils/helpers';
import { api } from '../services/api';

const CATEGORIES = ['Tất cả', 'Tin tức', 'Xu hướng', 'Khuyến mãi'];

const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col sm:flex-row animate-pulse">
    <div className="sm:w-2/5 bg-gray-200 min-h-[200px] flex-shrink-0" />
    <div className="p-5 flex flex-col gap-3 flex-1">
      <div className="h-3 bg-gray-200 rounded w-16" />
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="mt-auto flex gap-4">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await api.get('/posts');
        setPosts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const displayed = posts
    .filter((p) => category === 'Tất cả' || p.category === category)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Tin Tức & Xu Hướng</h2>
        <p className="text-gray-500 mt-2">Cập nhật những xu hướng thời trang mới nhất</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-between items-start sm:items-center">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer ${
                category === cat
                  ? 'bg-orange-600 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Tìm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : displayed.length === 0 ? (
          <div className="col-span-2 text-center py-20 text-gray-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">Không tìm thấy bài viết nào.</p>
          </div>
        ) : (
          displayed.map((post) => (
            <Link
              key={post._id || post.id}
              to={`/blog/${post._id || post.id}`}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row group cursor-pointer"
            >
              <div className="sm:w-2/5 bg-gray-100 overflow-hidden min-h-[200px] flex-shrink-0">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 min-h-[200px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={40} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col justify-between">
                <div>
                  {post.category && (
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                      {post.category}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 mt-1.5 mb-2.5 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt || post.content}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <User size={11} /> {post.author || 'Admin'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(post.date)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogPage;
