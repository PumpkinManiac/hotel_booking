import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HotelCard from './HotelCard';
import Title from './Title';
import { useAppContext } from '../conext/AppContext';

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();
  if (!rooms || rooms.length === 0) return null;

  /* ────────────────────────── ANIMATION VARIANTS ────────────────────────── */
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#0d0d26] text-white py-20 px-4 sm:px-8 lg:px-16">
      {/* ────────────────────────── HEADER ────────────────────────── */}
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* LEFT BLOCK */}
          <div className="max-w-2xl">
            <Title
              title="Featured Destinations"
              subtitle="Curated stays picked for comfort, luxury, and convenience. Discover our editors’ favourite homes away from home across India."
            />

            {/* Month chip */}
            <span className="mt-4 inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-300 backdrop-blur-sm">
              Top Picks · {new Date().toLocaleString('default', { month: 'long' })}
            </span>

            {/* Divider */}
            <hr className="my-4 h-0.5 w-24 rounded-full bg-gradient-to-r from-blue-400 to-teal-400" />
          </div>

          {/* CTA BUTTON */}
          <button
            onClick={() => {
              navigate('/rooms');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start md:self-auto flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold shadow-lg ring-1 ring-inset ring-blue-500/30 transition hover:-translate-y-[2px] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Explore All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* ────────────────────────── CARD GRID / SCROLLER ────────────────────────── */}
      <motion.div
        className="
          mt-14
          flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4
          sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:pb-0
          lg:grid-cols-3
        "
      >
        {rooms.slice(0, 6).map((room) => (
          <motion.div
            key={room._id}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -6, rotateX: 4, rotateY: -1 }}
            className="
              flex-shrink-0 w-64 xs:w-72 sm:w-auto
              snap-start
              transform-gpu transition duration-300 ease-out
            "
          >
            <HotelCard room={room} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedDestination;
