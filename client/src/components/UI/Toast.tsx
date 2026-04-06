import { AnimatePresence, motion } from 'framer-motion';
import type { ToastItem } from '@/hooks/useToast';

const STYLES: Record<ToastItem['type'], string> = {
  success: 'bg-emerald-500 text-white',
  error:   'bg-rose-500   text-white',
  info:    'bg-indigo-500 text-white',
};

const ICONS: Record<ToastItem['type'], string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function Toast({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0,  scale: 1    }}
            exit={{    opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              pointer-events-auto
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl
              text-sm font-medium min-w-60 max-w-sm
              ${STYLES[t.type]}
            `}
          >
            <span className="font-bold text-base shrink-0">{ICONS[t.type]}</span>
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity text-lg leading-none"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
