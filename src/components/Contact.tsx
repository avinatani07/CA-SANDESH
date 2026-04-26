import { Mail, Globe, MapPin, Clock, Linkedin, Instagram } from 'lucide-react';
import ContactForm from './ContactForm';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-500 mb-4 font-heading">Get in Touch</h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Have questions or need expert financial guidance? Reach out to Jaiman & Company — we're
            here to simplify finance, tax, and compliance for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-2 font-heading">
                Jaiman & Company
              </h3>
              <p className="text-accent-500 font-medium mb-6">Chartered Accountants</p>
              <p className="text-neutral-700 leading-relaxed">
                Founded by CA Sandesh Jaiman, we provide comprehensive financial advisory services
                to individuals, startups, and businesses across India. Let's make finance easy for you.
              </p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Email</h4>
                  <a href="mailto:jaimanandco@gmail.com" className="text-neutral-700 hover:text-primary-500 transition-colors">
                    jaimanandco@gmail.com
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Website</h4>
                  <a href="https://www.jaimanco.in" target="_blank" rel="noopener noreferrer"
                    className="text-neutral-700 hover:text-primary-500 transition-colors">
                    www.jaimanco.in
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Location</h4>
                  <p className="text-neutral-700">India</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Business Hours</h4>
                  <div className="text-neutral-700 space-y-1 text-sm">
                    <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                    <p>Saturday: 10:00 AM – 2:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/company/jaimanco" target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 bg-primary-500 hover:bg-accent-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="https://www.instagram.com/jaimanco" target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 bg-primary-500 hover:bg-accent-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200">
            <h3 className="text-2xl font-semibold text-neutral-900 mb-6 font-heading">
              Send us a Message
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
