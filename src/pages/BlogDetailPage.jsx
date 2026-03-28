import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, Calendar, ArrowLeft } from '../components/common/Icons'
import { formatDate } from '../utils/helpers'
import { api } from '../services/api'

const BlogDetailPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.get(`/posts/${id}`)
        if (data) {
          setPost(data)
        } else {
          setError('Bài viết không tồn tại')
        }
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(err.message || 'Không thể tải bài viết')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-32 text-center animate-fade-in">
        <h2 className="text-4xl font-black text-gray-900 mb-4">Bài Viết Không Tồn Tại</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">{error || 'Có vẻ như bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.'}</p>
        <Link to="/blog" className="bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 transition-all hover:bg-orange-700 inline-flex items-center gap-2">
          <ArrowLeft size={16} />Quay lại blog
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition mb-8">
          <ArrowLeft size={14} /> Quay lại danh sách
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          {/* Image */}
          {post.image && (
            <div className="w-full h-96 bg-gray-100 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">{post.category}</span>
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <User size={14} /> {post.author || 'Admin'}
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={14} /> {formatDate(post.date)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">{post.title}</h1>

            {/* Description */}
            {post.excerpt && (
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">{post.excerpt}</p>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {post.content}
              </div>
            </div>

            {/* Back Button */}
            <div className="border-t border-gray-100 pt-8">
              <Link to="/blog" className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition shadow-lg hover:shadow-orange-500/30">
                <ArrowLeft size={16} /> Quay lại blog
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default BlogDetailPage
