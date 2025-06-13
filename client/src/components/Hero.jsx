import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../conext/AppContext';

const Hero = () => {
  const [destination, setDestination] = useState('');
  const { navigate, getToken, axios, setSearchedCities } = useAppContext();

  const onSearch = async (e) => {
    e.preventDefault();
    navigate(`/rooms?destination=${destination.trim()}`);

    await axios.post(
      '/api/user/store-recent-search',
      { recentSearchedCity: destination },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );

    setSearchedCities((prev) => {
      const updated = [...new Set([destination, ...prev])].slice(0, 3);
      return updated;
    });
  };

  return (
    <section
      className='relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-center bg-cover bg-no-repeat px-4 sm:px-6 lg:px-8 bg-[url("/src/assets/heroImage.png")] '
    >
      {/* Dark overlay */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-black/50 backdrop-brightness-75 backdrop-blur-sm"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-screen-xl flex-col gap-10 md:flex-row md:items-start">
        {/* Copy */}
        <div className="flex-1 text-white space-y-5 mt-20 md:mt-6 ml-12">
          <span className="inline-block rounded-full bg-sky-500/70 px-4 py-1 text-xs font-semibold tracking-wide sm:text-sm">
            The Ultimate Hotel Experience
          </span>

          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Discover Your Perfect Gateway Destination
          </h1>

          <p className="max-w-md text-sm leading-relaxed sm:text-base md:max-w-lg">
            Explore our curated stays in popular cities, hand-picked for luxury, comfort, and affordability.
            Unlock exclusive offers and unforgettable memories, one booking at a time.
          </p>
          <button className="rounded-full border border-white/80 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">
              Browse Destinations
            </button>
        </div>
        
        {/* Search form */}
        <form
          onSubmit={onSearch}
          className="flex w-full flex-col gap-4 rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-sm md:w-[420px] mb-5 md:mb-0">
          {/* Destination */}
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            <span className="flex items-center gap-2">
              <img src={assets.locationIcon} alt="" className="h-4 w-4" />
              Destination
            </span>
            <input
              type="text"
              id="destinationInput"
              list="destinations"
              placeholder="Where to?"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
            <datalist id="destinations">
              {cities.map((city, idx) => (
                <option key={idx} value={city} />
              ))}
            </datalist>
          </label>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <img src={assets.calenderIcon} alt="" className="h-4 w-4" />
                Check‑in
              </span>
              <input
                type="date"
                id="checkIn"
                className="rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-gray-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <img src={assets.calenderIcon} alt="" className="h-4 w-4" />
                Check‑out
              </span>
              <input
                type="date"
                id="checkOut"
                className="rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-gray-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </label>
          </div>

          {/* Guests */}
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            <span>Guests</span>
            <input
              type="number"
              id="guests"
              min={1}
              max={4}
              placeholder="0"
              className="w-20 rounded-md border border-gray-300 bg-white/80 px-3 py-2 text-gray-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </label>

          {/* CTA */}
          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-sky-600 py-3 font-semibold tracking-wide text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            <img src={assets.searchIcon} alt="" className="h-6 w-6" />
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
