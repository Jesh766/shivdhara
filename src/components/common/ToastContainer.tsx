import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, Info, AlertCircle, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      id="toast-container"
      className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto rounded-xl p-4 shadow-xl border backdrop-blur-md flex items-start gap-3 transition-all ${
              toast.type === 'gold'
                ? 'bg-[#101827]/95 border-[#C8A45D]/40 text-[#F7F3EA]'
                : toast.type === 'success'
                ? 'bg-[#101827]/95 border-emerald-500/40 text-[#F7F3EA]'
                : toast.type === 'error'
                ? 'bg-[#101827]/95 border-rose-500/40 text-[#F7F3EA]'
                : 'bg-[#101827]/95 border-[#3D6B82]/40 text-[#F7F3EA]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'gold' && <Sparkles className="w-5 h-5 text-[#C8A45D]" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#528AA5]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-wide text-[#F7F3EA] leading-snug">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-[#D9D2C3] mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#D9D2C3]/60 hover:text-[#F7F3EA] p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
