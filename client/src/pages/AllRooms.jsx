import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets, facilityIcons } from "../assets/assets";
import Rating from "../components/Rating";
import { useAppContext } from "../conext/AppContext";
import { useSearchParams } from "react-router-dom";

/** ---------------------------------------------
 *  Small UI Helpers
 *  -------------------------------------------*/
const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm select-none">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-blue-600 h-4 w-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    />
    <span>{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm select-none">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
      className="accent-blue-600 h-4 w-4 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    />
    <span>{label}</span>
  </label>
);

/** ---------------------------------------------
 *  Main Component
 *  -------------------------------------------*/
const AllRooms = () => {
  const [openFilters, setOpenFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, navigate } = useAppContext();

  const [selectedFilters, setSelectedFilters] = useState({
    roomTypes: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => {
      const update = { ...prev };
      if (checked) update[type] = [...update[type], value];
      else update[type] = update[type].filter((v) => v !== value);
      return update;
    });
  };

  const handleSortChange = (sortOption) => setSelectedSort(sortOption);

  const matchesRoomType = (room) =>
    selectedFilters.roomTypes.length === 0 || selectedFilters.roomTypes.includes(room.roomType);

  const matchesPriceRange = (room) => {
    if (selectedFilters.priceRange.length === 0) return true;
    return selectedFilters.priceRange.some((range) => {
      const [min, max] = range.split(" to ").map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    });
  };

  const sortRooms = (a, b) => {
    switch (selectedSort) {
      case "Price Low to High":
        return a.pricePerNight - b.pricePerNight;
      case "Price High to Low":
        return b.pricePerNight - a.pricePerNight;
      case "Newest First":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  };

  const filterDestination = (room) => {
    const destination = searchParams.get("destination");
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  };

  const filteredRooms = useMemo(() => {
    return (
      rooms
        ?.filter((room) => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room))
        .sort(sortRooms) || []
    );
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  const clearFilters = () => {
    setSelectedFilters({ roomTypes: [], priceRange: [] });
    setSelectedSort("");
    setSearchParams({});
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 32 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" },
    }),
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col-reverse lg:flex-row gap-12 px-4 sm:px-6 lg:px-8 py-24">
      {/* FILTER SIDEBAR */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-slate-800/70 backdrop-blur-xl w-full lg:w-72 rounded-3xl border border-slate-700 p-6 shadow-2xl lg:sticky top-24 z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 hover:scrollbar-thumb-slate-600"
      >
        <header className="flex items-center justify-between pb-3 border-b border-slate-700">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpenFilters(!openFilters)}
              className="text-sm font-medium text-blue-400 transition hover:text-blue-300 lg:hidden"
            >
              {openFilters ? "Hide" : "Show"}
            </button>
            <button
              onClick={clearFilters}
              className="hidden lg:inline-block text-sm font-medium text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>
        </header>

        <AnimatePresence initial={false}>
          {(openFilters || window.innerWidth >= 1024) && (
            <motion.div
              key="filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:block mt-4 pr-1"
            >
              <div className="mb-6">
                <p className="font-medium mb-2">Room Types</p>
                {roomTypes.map((room, index) => (
                  <CheckBox
                    key={index}
                    label={room}
                    selected={selectedFilters.roomTypes.includes(room)}
                    onChange={(checked) => handleFilterChange(checked, room, "roomTypes")}
                  />
                ))}
              </div>

              <div className="mb-6">
                <p className="font-medium mb-2">Price Range</p>
                {priceRanges.map((range, index) => (
                  <CheckBox
                    key={index}
                    label={`₹${range}`}
                    selected={selectedFilters.priceRange.includes(range)}
                    onChange={(checked) => handleFilterChange(checked, range, "priceRange")}
                  />
                ))}
              </div>

              <div>
                <p className="font-medium mb-2">Sort By</p>
                {sortOptions.map((option, index) => (
                  <RadioButton
                    key={index}
                    label={option}
                    selected={selectedSort === option}
                    onChange={() => handleSortChange(option)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* MAIN CONTENT */}
      <section className="w-full flex flex-col scroll-mt-28">
        <header className="mb-10">
          <h1 className="font-playfair text-4xl md:text-5xl leading-tight">Hotel Rooms</h1>
          <p className="mt-2 text-slate-300 max-w-2xl">
            Take advantage of our limited offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </header>

        {filteredRooms.length === 0 && (
          <p className="text-center text-slate-400">No rooms match your current filters.</p>
        )}

        {filteredRooms.map((room, index) => (
          <motion.div
            custom={index}
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            key={room._id}
            className="group flex flex-col md:flex-row items-start gap-6 py-10 border-b border-slate-700 last:border-0 transition-all duration-300 ease-in-out hover:bg-slate-800/40 rounded-2xl px-4"
          >
            <motion.img
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
              src={room.images[0]}
              alt="hotel"
              title="View room details"
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              className="w-full md:w-[48%] h-56 sm:h-64 object-cover rounded-2xl shadow-lg cursor-pointer"
            />

            <div className="md:w-1/2 flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">{room.hotel.city}</p>
              <h2
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-2xl font-playfair font-semibold cursor-pointer group-hover:text-blue-400 transition-colors"
              >
                {room.hotel.name}
              </h2>

              <div className="flex items-center text-sm text-slate-300 mt-1">
                <Rating />
                <span className="ml-2 text-xs sm:text-sm text-slate-400">200+ reviews</span>
              </div>

              <div className="flex items-center gap-1 mt-2 text-sm text-slate-400">
                <img
                  src={assets.locationIcon}
                  alt="location-icon"
                  className="w-4 h-4 invert"
                />
                <span>{room.hotel.address}</span>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 mb-6 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/60 hover:scrollbar-thumb-slate-600">
                {room.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700/60 backdrop-blur-md shadow-sm hover:scale-105 transition-transform duration-200"
                  >
                    <img src={facilityIcons[item]} alt={item} className="w-5 h-5 invert" />
                    <p className="text-xs capitalize text-slate-300 whitespace-nowrap">{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-lg font-semibold text-blue-400">
                ₹{room.pricePerNight}
                <span className="text-sm text-slate-400"> / night</span>
              </p>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default AllRooms;
