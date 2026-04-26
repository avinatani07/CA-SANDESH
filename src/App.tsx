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
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      setPostId(searchParams.get('post'));
    };

    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
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
