import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import AdminBlogPanel from './components/AdminBlogPanel';

function App() {
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
