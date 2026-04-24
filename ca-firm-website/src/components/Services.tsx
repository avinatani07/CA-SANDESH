import ServiceCard from './ServiceCard';
import { services } from '../data/services';

const Services = () => {
  return (
    <section id="services" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-500 mb-4 font-heading">
            Our Services
          </h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            We provide comprehensive financial and advisory services tailored to meet your business needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
