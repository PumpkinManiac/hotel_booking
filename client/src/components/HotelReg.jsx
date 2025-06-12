import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { cities } from '../assets/assets'
import { useAppContext } from '../conext/AppContext'
import toast from 'react-hot-toast'

const HotelReg = () => {

  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post(`/api/hotels`, { name, contact, city, address }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowHotelReg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className='flex bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden'
      >
        <img
          src={assets.regImage}
          className='w-1/2 object-cover hidden md:block'
          alt='Register Hotel'
        />
        <div className='relative flex flex-col gap-4 w-full md:w-1/2 p-8 md:p-10'>
          <img
            src={assets.closeIcon}
            alt='close'
            className='absolute top-4 right-4 h-5 w-5 cursor-pointer hover:scale-110 transition-transform'
            onClick={() => setShowHotelReg(false)}
          />
          <p className='text-2xl font-bold text-center text-gray-800 mt-4'>
            Register Your Hotel
          </p>

          <div className='w-full'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-600 mb-1'>
              Hotel Name
            </label>
            <input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              required
              placeholder='Enter hotel name'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            />
          </div>

          <div className='w-full'>
            <label htmlFor='contact' className='block text-sm font-medium text-gray-600 mb-1'>
              Phone Number
            </label>
            <input
              id='contact'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type='text'
              placeholder='Enter phone number'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            />
          </div>

          <div className='w-full'>
            <label htmlFor='address' className='block text-sm font-medium text-gray-600 mb-1'>
              Address
            </label>
            <input
              id='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type='text'
              placeholder='Enter address'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            />
          </div>

          <div className='w-full'>
            <label htmlFor='city' className='block text-sm font-medium text-gray-600 mb-1'>
              City
            </label>
            <select
              id='city'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            >
              <option value=''>Select a City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button type='submit'
            className='mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm tracking-wide'>
            Register Hotel
          </button>
        </div>
      </form>
    </div>
  )
}

export default HotelReg
