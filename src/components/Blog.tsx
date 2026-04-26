import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { loadBlogPosts, seedPosts  } from '../state/blog';
import type {BlogPost} from '../state/blog';

const categoryColors: Record<string, string> = {
  'Income Tax': 'bg-blue-100 text-blue-700',
  'GST': 'bg-green-100 text-green-700',
  'Tax Filing': 'bg-purple-100 text-purple-700',
  'Business Advisory': 'bg-orange-100 text-orange-700',
  'Business Planning': 'bg-red-100 text-red-700',
  'Wealth Planning': 'bg-teal-100 text-teal-700',
};

const Blog = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const load = () => setUserPosts(loadBlogPosts());
    load();
    window.addEventListener('jaiman:blog-updated', load);
    return () => window.removeEventListener('jaiman:blog-updated', load);
  }, []);

  const combinedPosts = useMemo(() => {
    return [...userPosts, ...seedPosts];
  }, [userPosts]);

  return (
    <section id="blog" ref={ref} className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-accent-500" />
            <h2 className="text-4xl font-bold text-primary-500 font-heading">Blog & Insights</h2>
          </div>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            Welcome to the Jaiman & Company blog — your go-to resource for expert insights on taxation,
            accounting, personal finance, and business advisory. Stay informed, stay compliant, and make
            confident financial choices.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combinedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Card top accent */}
              <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />

              <div className="p-6">
                {/* Category & Read time */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-neutral-500">{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-neutral-900 mb-3 font-heading leading-snug group-hover:text-primary-500 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs">
                    <Calendar size={14} />
                    <span>{post.dateLabel}</span>
                  </div>
                  <a
                    href={`/?post=${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary-500 hover:text-accent-500 text-sm font-medium transition-colors"
                  >
                    Read More <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
