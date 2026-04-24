import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { LogIn, LogOut, Menu, PenSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../state/auth';

const navItems = [
  { id: 'home', label: 'Home', to: 'home' },
  { id: 'about', label: 'About', to: 'about' },
  { id: 'services', label: 'Services', to: 'services' },
  { id: 'blog', label: 'Blog', to: 'blog' },
  { id: 'contact', label: 'Contact', to: 'contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { user, openSignIn, signOut, openAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Detect active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.to));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-primary-500/95 backdrop-blur-md shadow-md'
          : 'bg-primary-500/95 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="home"
              smooth={true}
              duration={500}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src="/jaimanco-logo.png"
                alt="Jaiman & Company, Chartered Accountants"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="sr-only">Jaiman & Company</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                smooth={true}
                duration={500}
                spy={true}
                offset={-80}
                className={`text-base font-medium cursor-pointer transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-accent-500'
                    : 'text-neutral-900/80 hover:text-accent-500'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth actions */}
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openAdmin}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-primary-600 hover:border-accent-400 hover:text-accent-600 transition-colors"
                >
                  <PenSquare size={16} />
                  Post blog
                </button>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openSignIn}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                <LogIn size={16} />
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-neutral-700 hover:text-accent-500 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-primary-700/98 border-t border-primary-500/60 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-80}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-md text-base font-medium cursor-pointer transition-colors ${
                    activeSection === item.id
                      ? 'bg-accent-500 text-white'
                      : 'text-white/80 hover:bg-primary-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-neutral-100" />
              {user ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      openAdmin();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base font-semibold text-primary-600 hover:border-accent-400 hover:text-accent-600 transition-colors"
                  >
                    <PenSquare size={18} />
                    Post blog
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      signOut();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-base font-semibold text-white hover:bg-primary-600 transition-colors"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    openSignIn();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-3 text-base font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  <LogIn size={18} />
                  Sign in
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
