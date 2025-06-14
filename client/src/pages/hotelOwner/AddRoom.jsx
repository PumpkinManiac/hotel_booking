import React, { useState } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../conext/AppContext';
import toast from 'react-hot-toast';

const AddRoom = () => {

  const { axios, getToken } = useAppContext();

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: 0,
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Mountain View': false,
      'Pool Access': false,
    },
  });

  const [loading, setLoading] = useState(false);

  const onsubmitHandler = async (e) => {
    e.preventDefault();

    // Check if all inputs and images are filled
    if (
      !inputs.roomType ||
      !inputs.pricePerNight ||
      !inputs.amenities ||
      !Object.values(images).some(image => image)
    ) {
      toast.error('Please fill all the fields and upload all 4 images');
      return;
    }
    //If all the data is available
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('roomType', inputs.roomType);
      formData.append('pricePerNight', inputs.pricePerNight);
      //Converting Amenities to Array & keeping only enabled Amenities
      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );
      formData.append('amenities', JSON.stringify(amenities));

      // Add images
      Object.keys(images).forEach((key) => {
        (images[key]) && formData.append('images', images[key]);
      });
      //API call
      const { data } = await axios.post('/api/rooms', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: '',
          pricePerNight: 0,
          amenities: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Mountain View': false,
            'Pool Access': false,
          },
        });
        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-12 px-4 md:px-16 lg:px-24 xl:px-32">
      <form
        onSubmit={onsubmitHandler}
        className="backdrop-blur-md bg-white/70 shadow-xl border border-gray-200 rounded-3xl px-6 py-10 max-w-4xl mx-auto w-full"
      >
        {/* Title */}
        <Title
          align="left"
          font="outfit"
          title="Add a new Room"
          subtitle="Fill out the details below"
        />

        {/* Image Upload */}
        <p className="mb-2 mt-6 text-sm font-semibold text-gray-700">Room Images</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-6">
          {Object.keys(images).map((key) => (
            <label htmlFor={`roomImage${key}`} key={key} 
             className="cursor-pointer relative group">
              <img
                src={
                  images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea
                }
                alt={`Room preview ${key}`}
                className="w-full h-32 object-cover border-2 border-gray-200 rounded-xl shadow-sm group-hover:brightness-95 transition duration-300"
              />
              <input
                type="file"
                accept="image/*" //accept iamge of any type {png,jpg,jpeg}
                id={`roomImage${key}`}
                hidden
                onChange={(e) =>
                  setImages({ ...images, [key]: e.target.files[0] })
                }
              />
            </label>
          ))}
        </div>               

        {/* Room Type */}
        <div className="mt-6">
          <label className="block mb-1 font-medium text-sm text-gray-700">Room Type
          </label>
          <select
            value={inputs.roomType}
            onChange={(e) =>
              setInputs({ ...inputs, roomType: e.target.value })
            }
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition"
          >
            <option value="">Select room type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        {/* Price */}
        <div className="w-full mb-5">
          <label className="block mb-1 font-medium text-sm text-gray-700">
            Price /night
          </label>
          <input
            type="number"
            placeholder="0"
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
          />
        </div>

        {/* Amenities */}
        <p className="mb-2 font-medium text-sm text-gray-700">Amenities</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-800 mb-8">
          {Object.keys(inputs.amenities).map((amenity, index) => (
            <label key={index} 
            className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-white transition">
              <input
                type="checkbox"
                checked={inputs.amenities[amenity]}
                onChange={() =>
                  setInputs({
                    ...inputs,
                    amenities: {
                      ...inputs.amenities,
                      [amenity]: !inputs.amenities[amenity],
                    },
                  })
                }
              />
              {amenity}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-black text-white text-sm px-8 py-3 rounded-full transition hover:opacity-90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Room'}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
