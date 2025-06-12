import React from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import Rating from './Rating';

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

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-12">
      <Title
        title="What Our Guests Say"
        subtitle="Discover why discerning travelers consistently choose Quickstay for their exclusive and luxurious accommodations around the world"
      />

      <div className="flex flex-wrap justify-center gap-8 mt-16 w-full">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
            className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-xs sm:max-w-sm p-6"
          >
            {/* Tooltip */}
            {tooltip.visible && tooltip.text === testimonial.name && (
              <span
                className="absolute px-3 py-1 text-sm font-medium rounded bg-indigo-600 text-white pointer-events-none z-50"
                style={{
                  top: tooltip.y + 10,
                  left: tooltip.x + 10,
                }}
              >
                {tooltip.text}
              </span>
            )}

            {/* Card Content */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">Very easy to integrate</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-4">{testimonial.review}</p>

              <div className="flex justify-center mt-4">
                <Rating />
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center mt-6">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={testimonial.image}
                alt={`${testimonial.name} profile`}
              />
              <div className="ml-4 text-left">
                <p className="text-base font-medium text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
