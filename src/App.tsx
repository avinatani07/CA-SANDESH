import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import AdminBlogPanel from './components/AdminBlogPanel';
import BlogPostPage from './components/BlogPostPage';

function App() {
  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {
    const scrollToHash = () => {
      const targetId = window.location.hash.replace('#', '').trim();
      if (!targetId) return;
      let attempts = 0;
      const tryScroll = () => {
        attempts += 1;
        const el = document.getElementById(targetId);
        if (!el) {
          if (attempts < 20) window.setTimeout(tryScroll, 50);
          return;
        }
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, left: 0, behavior: 'auto' });
      };
      window.setTimeout(tryScroll, 50);
    };

    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const nextPostId = searchParams.get('post');
      setPostId(nextPostId);
      if (!nextPostId) window.setTimeout(scrollToHash, 0);
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  if (postId) {
    return <BlogPostPage postId={postId} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Blog />
      <Contact />
      <Footer />
      <SignInModal />
      <AdminBlogPanel />
    </div>
  );
}

export default App;
