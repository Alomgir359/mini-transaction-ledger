import { useEffect, useState } from 'react'

/**
 * A slide-in, auto-dismissing toast used to confirm successful actions
 * (account created, entry posted) with a brand-styled checkmark badge.
 *
 * `toast` shape: { type: 'success' | 'error', title: string, message?: string }
 */
export default function Toast({ toast, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!toast) return
    // trigger enter animation on next tick
    const enter = setTimeout(() => setVisible(true), 10)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 250)
    }, 3200)
    return () => {
      clearTimeout(enter)
      clearTimeout(timer)
    }
  }, [toast, onClose])

  if (!toast) return null

  const isSuccess = toast.type !== 'error'

  return (
    <div className="fixed top-5 right-5 z-50 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-start gap-3 bg-white rounded-xl shadow-2xl border-l-4 ${
          isSuccess ? 'border-brand' : 'border-red-600'
        } px-4 py-3.5 min-w-[300px] max-w-sm transition-all duration-300 ease-out ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isSuccess ? 'bg-brand/10' : 'bg-red-100'
          }`}
        >
          {isSuccess ? (
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
          {toast.message && (
            <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(onClose, 200)
          }}
          className="text-slate-400 hover:text-slate-600 pt-0.5"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
