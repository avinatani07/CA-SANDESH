import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchBlogPostById } from '../state/blog';
import type { BlogPost } from '../state/blog';

export default function BlogPostPage({ postId }: { postId: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchBlogPostById(postId).then((found) => {
      if (!isMounted) return;
      setPost(found);
      setIsLoading(false);
      window.scrollTo(0, 0);
    });

    return () => {
      isMounted = false;
    };
  }, [postId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-600">Loading…</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Post not found</h2>
        <a href="/" className="text-primary-500 hover:text-primary-600 flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-neutral-100 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </a>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-4xl">
        <div className="mb-10 text-center">
          <div className="inline-block text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
            {post.category}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 font-heading mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
            <span>{post.dateLabel}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-heading prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
