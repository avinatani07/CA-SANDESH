import { Link } from 'react-scroll';
import { Linkedin, Instagram, Globe, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-700 text-white py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Firm Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-2 font-heading">Jaiman & Company</h3>
            <p className="text-accent-400 font-medium mb-4">Chartered Accountants</p>
            <p className="text-primary-100 mb-4 leading-relaxed text-sm">
              A trusted financial advisory firm committed to simplifying taxation, accounting, and
              business finance for individuals, startups, and businesses across India.
            </p>
            <p className="text-primary-200 text-sm mb-1">Founded by <span className="font-semibold text-white">CA Sandesh Jaiman</span></p>
            <div className="flex items-center gap-2 text-primary-200 text-sm mb-1">
              <Mail size={14} />
              <a href="mailto:info@jaimanco.com" className="hover:text-accent-400 transition-colors">info@jaimanco.com</a>
            </div>
            <div className="flex items-center gap-2 text-primary-200 text-sm">
              <Globe size={14} />
              <a href="https://www.jaimanco.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-400 transition-colors">www.jaimanco.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: 'home' },
                { label: 'About Us', to: 'about' },
                { label: 'Services', to: 'services' },
                { label: 'Blog', to: 'blog' },
                { label: 'Contact', to: 'contact' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    smooth={true}
                    duration={800}
                    offset={-80}
                    className="text-primary-100 hover:text-accent-400 transition-colors cursor-pointer text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Our Services</h3>
            <ul className="space-y-2 text-sm text-primary-100">
              <li>Income Tax & GST Compliance</li>
              <li>Accounting & Auditing</li>
              <li>Business Growth Advisory</li>
              <li>Virtual CFO Services</li>
              <li>Investment & Wealth Planning</li>
              <li>Corporate & Legal Services</li>
            </ul>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="pt-8 border-t border-primary-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-200 text-sm text-center md:text-left">
            &copy; {currentYear} Jaiman & Company, Chartered Accountants. All rights reserved.
          </p>
          <div className="flex gap-3">
            <a href="https://www.linkedin.com/company/jaimanco" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-primary-600 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors"
              aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://www.instagram.com/jaimanco" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-primary-600 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://www.jaimanco.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-primary-600 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Website">
              <Globe size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
