import React from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import Rating from './Rating';
import { motion } from 'framer-motion';

const Testimonial = () => {
  const [tooltip, setTooltip] = React.useState({ visible: false, x: 0, y: 0, text: '' });
  const cardRefs = React.useRef([]);

  const handleMouseMove = (e, index) => {
    const bounds = cardRefs.current[index].getBoundingClientRect();
    setTooltip({
      visible: true,
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
      text: testimonials[index].name,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
      variants={containerVariants}
      className="bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#0d0d26] text-white px-6 md:px-16 lg:px-24 xl:px-32 py-20"
    >
      <Title
        title="What Our Guests Say"
        subtitle="Discover why discerning travelers consistently choose Quickstay for their exclusive and luxurious accommodations around the world"
        align="center"
      />

      <motion.div
        variants={containerVariants}
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            variants={cardVariants}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
            className="relative group bg-[#1e1e2f] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 overflow-hidden"
          >
            {/* Tooltip */}
            {tooltip.visible && tooltip.text === testimonial.name && (
              <span
                className="absolute z-50 px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded shadow-md pointer-events-none transition-opacity duration-200"
                style={{
                  top: tooltip.y + 12,
                  left: tooltip.x + 12,
                }}
              >
                {tooltip.text}
              </span>
            )}

            {/* Card Content */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Very easy to integrate</h3>
              <p className="text-sm text-white/70 mt-2 line-clamp-4">{testimonial.review}</p>
              <div className="flex justify-center mt-4">
                <Rating />
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center mt-6">
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                src={testimonial.image}
                alt={`${testimonial.name} profile`}
              />
              <div className="ml-4 text-left">
                <p className="text-base font-medium text-white">{testimonial.name}</p>
                <p className="text-sm text-white/50">{testimonial.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Testimonial;
