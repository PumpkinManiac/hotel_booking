import React, { useMemo, useState } from 'react';
import { assets, facilityIcons} from '../assets/assets';
import Rating from '../components/Rating';
import { useAppContext } from '../conext/AppContext';
import { useSearchParams } from 'react-router-dom';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-indigo-600"
    />
    <span className="text-gray-700 select-none">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
      className="accent-indigo-600"
    />
    <span className="text-gray-700 select-none">{label}</span>
  </label>
);

const AllRooms = () => {

  const [openFilters, setOpenFilters] = useState(false);
  //const [searchParams,setSearchParams] = useState()
  const [searchParams] = useSearchParams();
  const {rooms,navigate,currency} = useAppContext();
  const [selectedFilters , setSelectedFilters] = useState({
    roomTypes: [],
    priceRange: '',
 });
  const [selectedSort , setSelectedSort] = useState('');

  const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];
  const priceRange = ['0 to 500', '500 to 1000', '1000 to 2000', '2000 to 3000'];
  const sortOptions = ['Price Low to High', 'Price High to Low', 'Newest First'];

// handle  changes for filter and sorting

 const handleFilterChange = (checked ,value, type) => {

  setSelectedFilters((prevFilter)=>{
    const updatedFilter = {...prevFilter};
    if (checked) {
      updatedFilter[type].push(value);
    } else {
      updatedFilter[type] = updatedFilter[type].filter((item) => item !== value);
    }
    return updatedFilter;
  })
 }

 const handleSortChange = (sortOption) => {
  setSelectedSort(sortOption);
 }
 //Function to check if a room matches the selected room types
 const matchesRoomType = (room)=>{
  return selectedFilters.roomTypes.length == 0 || selectedFilters.roomTypes.includes(room.roomType);
 }
 //Function to check if a room matches the selected price range
 const matchesPriceRange = (room) => {
  return selectedFilters.priceRange.length === 0 || selectedFilters.some(range =>{
    const [min , max] = range.split(' to ').map(Number);
    return room.pricePerNight >= min && room.pricePerNight <= max;
  })
 }

 //Function to sort rooms based on the selected sort option
 const sortRooms = (a,b) => {
  if (selectedSort === 'Price Low to High') {
    a.pricePerNight - b.pricePerNight;
  }
  if (selectedSort === 'Price High to Low') {
    b.pricePerNight - a.pricePerNight;
  }
  if(selectedSort === 'Newest First') {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }
  return 0; // Default case, no sorting
 }

 //Filter Destination
 const filterDestination = (room) => {
  const destination  = searchParams.get('destination');
  if (!destination) return true; // If no destination is set, show all rooms
  return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
 }

 //Filter and sort rooms based on the selected filters and sort options
 const filteredRooms = useMemo(() => {
  return rooms.filter(room => matchesRoomType(room) &&
    matchesPriceRange(room) && filterDestination(room))
    .sort(sortRooms);
 },[rooms ,selectedFilters, selectedSort, searchParams]);

 //Clear all filter 

 const clearFilters = () => {
  setSelectedFilters({
      roomTypes: [],
      priceRange: [],
  })
  setSelectedSort('')
  setSearchParams({});
 }

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between gap-10 pt-28 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Filter Sidebar */}
      <div className="bg-white w-full lg:w-80 border border-gray-200 rounded-lg p-4 max-lg:mb-10 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <button
            onClick={() => setOpenFilters(!openFilters)}
            className="text-sm text-indigo-600 lg:hidden"
          >
            {openFilters ? 'Hide' : 'Show'}
          </button>
          <button className="hidden lg:block text-sm text-red-500 hover:underline">Clear</button>
        </div>

        <div className={`${openFilters ? 'block' : 'hidden'} lg:block mt-4`}>
          {/* Room Types */}
          <div className="mb-6">
            <p className="font-medium text-gray-700 mb-2">Popular Filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox key={index} label={room} selected={selectedFilters.roomTypes.includes(room)} onChange={checked => handleFilterChange(checked,room,'roomType') } />
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <p className="font-medium text-gray-700 mb-2">Price Range</p>
            {priceRange.map((range, index) => (
              <CheckBox key={index} label={`$${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)} onChange={checked => handleFilterChange(checked,range,'priceRange') }/>
            ))}
          </div>

          {/* Sort Options */}
          <div>
            <p className="font-medium text-gray-700 mb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton key={index} label={option} selected = {selectedSort == option} onChange={() => handleSortChange(option)} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col">
        <header className="mb-10">
          <h1 className="font-playfair text-4xl md:text-[40px] text-gray-800">
            Hotel Rooms
          </h1>
          <p className="mt-2 text-gray-500 text-sm md:text-base max-w-2xl">
            Take advantage of our limited offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </header>

        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start gap-6 py-8 border-b border-gray-200 last:border-0"
          >
            <img
              src={room.images[0]}
              alt="hotel"
              title="View room details"
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              className="w-full md:w-1/2 h-60 object-cover rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.01]"
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-sm text-gray-500">{room.hotel.city}</p>
              <h2
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-2xl font-playfair font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {room.hotel.name}
              </h2>
              <div className="flex items-center text-sm text-gray-600">
                <Rating />
                <span className="ml-2">200+ reviews</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
                <span>{room.hotel.address}</span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-3 mt-4 mb-6">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-50"
                  >
                    <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                    <p className="text-xs text-gray-700 capitalize">{item}</p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <p className="text-lg font-semibold text-indigo-700">
                ${room.pricePerNight} <span className="text-sm text-gray-500">/ night</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRooms;
