import React from 'react'
import { assets } from '../../../assets/assets'
import { cities } from '../assets/assets'

const HotelReg = () => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
      <form className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
        <img src={assets.regImage} className='w-1/2 rounded-xl hidden md:bock'></img>
        <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
            <img src={assets.closeIcon} className='absolute top-4 right-4 h-4 w-4 cursor-pointer'></img>
            <p className='text-2xl font-semibold mt-6'>Register your hotels</p>
            {/* Hotel Name */}
            <div className='w-full mt-4'>
                <label htmlFor='name'>Hotel Name</label>
                <input id='name' type='text' placeholder='Type here'></input>
            </div>
            <div className='w-full mt-4'>
                <label htmlFor='contact'>Phone</label>
                <input id='contact' type='text' placeholder='Type here'></input>
            </div>    
            <div className='w-full mt-4'>
                <label htmlFor='address'>Address</label>
                <input id='address' type='text' placeholder='Type here'></input>
            </div>   
            {/* Select city Dropdown */}
            <div>
                <label htmlFor='city'>City</label>
                <select id='city' required>
                    <option value=''>Select City</option>
                    {cities.map((city)=>(
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <button>Register</button>
        </div>
            
      </form>
    </div>
  )
}

export default HotelReg
