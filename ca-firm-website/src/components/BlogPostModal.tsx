import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { BlogPost } from '../state/blog';

export default function BlogPostModal({
  post,
  onClose,
}: {
  post: BlogPost | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[105] bg-black/50 px-4 py-6 overflow-y-auto"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto w-full max-w-3xl rounded-2xl bg-white shadow-xl overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-4">
              <div>
                <div className="text-xs font-semibold text-neutral-500">
                  {post.category} · {post.dateLabel} · {post.readTime}
                </div>
                <h3 className="mt-1 text-xl font-bold text-neutral-900 font-heading">{post.title}</h3>
                <p className="mt-2 text-sm text-neutral-700">{post.excerpt}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6">
              <article className="prose prose-neutral max-w-none prose-headings:font-heading prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
                {post.content
                  .split('\n')
                  .map((line, idx) => (line.trim() === '' ? <br key={idx} /> : <p key={idx}>{line}</p>))}
              </article>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

