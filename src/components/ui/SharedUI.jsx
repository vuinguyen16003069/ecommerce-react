import { memo, useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X, ChevronUp, Star } from '../Icons'

// ─── TOAST ──────────────────────────────────────────────────────────────────
export const Toast = memo(({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`pointer-events-auto min-w-[280px] max-w-sm p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-slide-in border backdrop-blur-md
          ${t.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' :
            t.type === 'error' ? 'bg-red-50/95 border-red-200 text-red-800' :
            'bg-blue-50/95 border-blue-200 text-blue-800'}`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {t.type === 'success' ? <CheckCircle size={18} /> : t.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
        </div>
        <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
        <button onClick={() => removeToast(t.id)} className="hover:opacity-60 flex-shrink-0 mt-0.5">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
))

// ─── MODAL ──────────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10 rounded-t-3xl sm:rounded-t-2xl">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── STAR RATING ────────────────────────────────────────────────────────────
export const StarRating = ({ rating, setRating, interactive = false, size = 16 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <div
        key={s}
        onClick={() => interactive && setRating(s)}
        className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
      >
        <Star size={size} fill={s <= rating ? '#FBBF24' : 'none'} stroke={s <= rating ? '#FBBF24' : '#D1D5DB'} />
      </div>
    ))}
  </div>
)

// ─── SCROLL TO TOP ──────────────────────────────────────────────────────────
export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-3 rounded-full shadow-xl hover:bg-orange-700 transition hover:-translate-y-1 active:translate-y-0"
    >
      <ChevronUp size={20} />
    </button>
  )
}

// ─── SKELETON CARD ──────────────────────────────────────────────────────────
export const SkeletonCard = () => (
  <div className="bg-white border rounded-xl overflow-hidden">
    <div className="pt-[100%] shimmer-bg"></div>
    <div className="p-4 space-y-2">
      <div className="h-3 shimmer-bg rounded w-1/3"></div>
      <div className="h-4 shimmer-bg rounded w-4/5"></div>
      <div className="h-4 shimmer-bg rounded w-2/3"></div>
      <div className="h-5 shimmer-bg rounded w-1/2 mt-3"></div>
    </div>
  </div>
)
