import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon, title, description, index }: ServiceCardProps) => {
  // Dynamically get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <IconComponent className="w-12 h-12 text-primary-500 mb-4" />
      <h3 className="text-xl font-semibold text-neutral-900 mb-3 font-heading">
        {title}
      </h3>
      <p className="text-neutral-700 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default ServiceCard;
