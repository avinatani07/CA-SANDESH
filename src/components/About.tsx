import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Target, Eye, Heart } from 'lucide-react';

const coreValues = [
  { title: 'Integrity', desc: 'Honesty, transparency, and ethical financial practices ensuring complete trust in our services.' },
  { title: 'Client-Centric', desc: 'Your success is our priority. Personalized solutions tailored to your unique financial needs.' },
  { title: 'Excellence & Accuracy', desc: 'Precise, reliable, and high-quality financial, tax, and business advisory services.' },
  { title: 'Innovation & Growth', desc: 'Modern financial strategies and technology to help businesses and individuals stay ahead.' },
  { title: 'Long-Term Partnerships', desc: 'We build lasting relationships, guiding clients through every stage of their financial journey.' },
];

const whyChoose = [
  'We Speak Your Language – No complicated jargon, just practical advice.',
  'Proactive & Future-Ready – We don\'t just file taxes; we help you plan smarter.',
  'Personalized Solutions – Every business and individual is unique, and so are our strategies.',
  '100% Compliance, 0% Stress – Let us handle the numbers while you focus on what you do best.',
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/jaimanco-logo.png"
              alt="Jaiman & Company, Chartered Accountants"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget).style.display = 'none';
              }}
            />
            <h2 className="text-4xl font-bold text-primary-500 font-heading">About Us</h2>
          </div>
          <p className="text-xl text-accent-500 font-medium mb-4">
            Simplifying Finance, Tax, and Compliance – So You Can Focus on Growth!
          </p>
          <p className="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
            At Jaiman & Company, Chartered Accountants, we believe managing finances should be simple,
            stress-free, and empowering. Whether you're an entrepreneur, a small business owner, or a
            growing enterprise, we're here to help you save taxes, manage accounts, and make smarter
            financial decisions.
          </p>
        </motion.div>

        {/* Who We Are + Core Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-primary-500 mb-4 font-heading">Who We Are</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Founded by <span className="font-semibold text-primary-600">CA Sandesh Jaiman</span>, a
              passionate Chartered Accountant and personal finance expert, Jaiman & Company is built on
              three core values:
            </p>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Trust', desc: 'Your finances are personal, and we handle them with care.' },
                { label: 'Transparency', desc: 'No hidden complexities, just honest and clear advice.' },
                { label: 'Technical Expertise', desc: 'Smart financial solutions tailored for individuals and businesses.' },
              ].map((v) => (
                <div key={v.label} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700"><span className="font-semibold">{v.label}</span> – {v.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-neutral-700 leading-relaxed">
              We're more than just accountants — we're your financial partners, helping you navigate
              the world of taxes, compliance, and wealth management with ease.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-primary-500 mb-4 font-heading">Why Choose Us?</h3>
            <div className="space-y-3 mb-8">
              {whyChoose.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <p className="text-neutral-700">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-primary-50 rounded-lg p-6 border-l-4 border-accent-500">
              <p className="text-primary-700 font-medium italic">
                "Managing finances, taxes, and business growth doesn't have to be overwhelming.
                With the right guidance, they can be powerful tools for success."
              </p>
              <p className="text-primary-500 font-semibold mt-2">— CA Sandesh Jaiman</p>
            </div>
          </motion.div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-primary-500 text-white rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-accent-400" />
              <h3 className="text-2xl font-bold font-heading">Our Vision</h3>
            </div>
            <p className="text-primary-100 leading-relaxed">
              We envision a world where finance feels simple, strategic, and stress-free. Our mission
              is to empower individuals, startups, and businesses with expert financial guidance that
              fuels growth, compliance, and long-term success. We don't just crunch numbers — we create
              roadmaps for wealth, stability, and financial confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-accent-500 text-white rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold font-heading">Our Mission</h3>
            </div>
            <p className="text-amber-50 leading-relaxed">
              Our mission is to make finance easy, efficient, and empowering for individuals, startups,
              and businesses. We go beyond tax filings and compliance — we help you save smarter, grow
              faster, and stay financially secure. With a client-first approach, innovative strategies,
              and ethical practices, we turn financial complexities into opportunities.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Heart className="w-7 h-7 text-accent-500" />
              <h3 className="text-2xl font-bold text-primary-500 font-heading">Our Core Values</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreValues.map((v, i) => (
              <div key={i} className="bg-neutral-50 rounded-lg p-5 text-center border border-neutral-200 hover:border-accent-400 hover:shadow-md transition-all">
                <CheckCircle className="w-8 h-8 text-accent-500 mx-auto mb-3" />
                <h4 className="font-semibold text-primary-600 mb-2">{v.title}</h4>
                <p className="text-sm text-neutral-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
