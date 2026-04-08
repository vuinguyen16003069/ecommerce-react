import { memo } from 'react'
import { CheckCircle, AlertCircle, Info, X } from './Icons'

export const Toast = memo(({ toasts, removeToast }) => (
  <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
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
        <button onClick={() => removeToast(t.id)} className="hover:opacity-60 flex-shrink-0 mt-0.5 cursor-pointer">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
))
