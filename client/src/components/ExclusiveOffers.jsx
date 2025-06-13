import React from 'react';
import Title from './Title';
import { motion } from 'framer-motion';
import { assets, exclusiveOffers } from '../assets/assets';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const ExclusiveOffers = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
      className="relative isolate bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#0d0d26] text-white py-20 px-6 md:px-16 lg:px-24 xl:px-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Title
            align="left"
            title="Exclusive Offers"
            subtitle="Discover our handpicked selection of exceptional properties around the world offering unparalleled luxury and unforgettable experiences"
          />
          <button className="group flex items-center gap-2 font-medium cursor-pointer text-blue-400 hover:text-blue-300 transition-colors">
            View All Offers
            <img
              src={assets.arrowIcon}
              alt="arrow-icon"
              className="group-hover:translate-x-1 transition-transform invert"
            />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {exclusiveOffers.map((item) => (
            <motion.div
              key={item._id}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-center bg-cover shadow-lg transition-all duration-300"
              style={{ backgroundImage: `url(${item.image})`, minHeight: '350px' }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-0" />

              {/* Offer Badge */}
              <p className="absolute top-4 left-4 z-10 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-800">
                {item.priceOff}% OFF
              </p>

              {/* Content */}
              <div className="relative z-10 p-6 mt-auto">
                <p className="text-xl font-playfair font-semibold">{item.title}</p>
                <p className="text-sm text-white/90">{item.description}</p>
                <p className="mt-3 text-xs text-white/60">{item.expiryDate}</p>

                <button className="mt-4 flex items-center gap-2 font-medium text-sm text-blue-300 hover:text-blue-200 transition-colors">
                  View Offers
                  <img
                    className="invert group-hover:translate-x-1 transition-transform"
                    src={assets.arrowIcon}
                    alt="arrow-icon"
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ExclusiveOffers;
