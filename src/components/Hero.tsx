import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-primary-500 via-primary-500 to-primary-600"
    >
      {/* Subtle star-like overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.25)_0,transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.15)_0,transparent_45%),radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.12)_0,transparent_40%)] opacity-70"
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center text-white"
        >
          {/* Firm Name */}
          <motion.h1
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading"
          >
            Jaiman & Company
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl mb-4 text-primary-50 max-w-3xl mx-auto"
          >
            Chartered Accountants
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl mb-12 text-primary-100 max-w-2xl mx-auto"
          >
            Simplifying Finance, Tax, and Compliance – So You Can Focus on Growth
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="contact"
              smooth={true}
              duration={800}
              offset={-80}
              className="inline-block"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg transition-colors duration-300"
              >
                Get in Touch
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <Link
          to="about"
          smooth={true}
          duration={800}
          offset={-80}
          className="cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-white opacity-75 hover:opacity-100 transition-opacity"
          >
            <ChevronDown size={32} />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
