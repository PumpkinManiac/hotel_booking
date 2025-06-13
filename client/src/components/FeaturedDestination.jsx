import React from 'react';
import HotelCard from './HotelCard';
import Title from './Title';
import { useAppContext } from '../conext/AppContext';

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();

  if (rooms.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16 px-4 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <Title
          title="Featured Destinations"
          subtitle="Discover our handpicked selection of exceptional properties around the world offering unparalleled luxury and unforgettable experiences"
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.slice(0, 3).map((room) => (
            <HotelCard key={room._id} room={room} />
          ))}
        </div>

        <button
          onClick={() => {
            navigate('/rooms');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-12 inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
        >
          View All Destinations
        </button>
      </div>
    </section>
  );
};

export default FeaturedDestination;
