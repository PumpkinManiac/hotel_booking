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
      Object.values(images).some((img) => img === null)
    ) {
      toast.error('Please fill all the fields and upload all 4 images');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('roomType', inputs.roomType);
      formData.append('pricePerNight', inputs.pricePerNight);

      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );
      formData.append('amenities', JSON.stringify(amenities));

      // Add images
      Object.keys(images).forEach((key) => {
        if (images[key]) formData.append('images', images[key]);
      });

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
    <div>
      <form
        onSubmit={onsubmitHandler}
        className="flex flex-col items-center justify-center max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md"
      >
        {/* Title */}
        <Title
          align="left"
          font="outfit"
          title="Add Room"
          subtitle="Fill out the details below"
        />

        {/* Image Upload */}
        <p className="mb-2 mt-4 font-medium text-gray-700">Images</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-4">
          {Object.keys(images).map((key) => (
            <label htmlFor={`roomImage${key}`} key={key} className="cursor-pointer">
              <img
                src={
                  images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea
                }
                alt={`Room preview ${key}`}
                className="w-full h-32 object-cover border rounded"
              />
              <input
                type="file"
                accept="image/*"
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
        <div className="w-full mb-4">
          <p className="mb-1">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) =>
              setInputs({ ...inputs, roomType: e.target.value })
            }
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="">Select room type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        {/* Price */}
        <div className="w-full mb-4">
          <p className="mb-1">
            Price <span className="text-sm text-gray-500">/ night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 rounded p-2 w-full"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
          />
        </div>

        {/* Amenities */}
        <p className="text-gray-800 mt-4">Amenities</p>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-700 mb-6">
          {Object.keys(inputs.amenities).map((amenity, index) => (
            <label key={index} className="flex items-center gap-2 text-sm">
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
          className="bg-primary text-white px-8 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Room'}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
