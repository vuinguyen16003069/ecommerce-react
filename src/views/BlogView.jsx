import { User, Calendar, FileText } from '../components/Icons'
import { formatDate } from '../utils/helpers'

const BlogView = ({ posts }) => (
  <div className="container mx-auto px-4 py-16 animate-fade-in">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-900">Tin Tức & Xu Hướng</h2>
      <p className="text-gray-500 mt-2">Cập nhật những xu hướng thời trang mới nhất</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <article key={post.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row group cursor-pointer">
          <div className="sm:w-2/5 bg-gray-100 overflow-hidden min-h-[200px] flex-shrink-0">
            {post.image
              ? <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 min-h-[200px]" />
              : <div className="w-full h-full flex items-center justify-center"><FileText size={40} className="text-gray-300" /></div>}
          </div>
          <div className="p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Xu hướng</span>
              <h3 className="font-bold text-gray-900 mt-1.5 mb-2.5 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">{post.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.content}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
              <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(post.date)}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
)

export default BlogView
