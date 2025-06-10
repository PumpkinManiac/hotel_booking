import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets' 
import { exclusiveOffers } from '../assets/assets'

const ExclusiveOffers = () => {
  return (
    <div className='flex flex-col items-centre px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex flex-col md:flex-row items-center justify-between w-full'>
        <Title align='left' title='Exclusive Offers' subtitle='Discover our handpicked selection of exceptional properties around the world offering unparalleled luxury and unforgettable experiences'>
        </Title>
        <button className='group flex items-center gap-2 font-medium cursor-pointer max-md:mt-12'>
            View All Offers
            <img src={assets.arrowIcon} alt='arrow-icon' className='group-hover:translate-x-1 transition-all'></img>
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
        {exclusiveOffers.map((item) => (
            <div key = {item._id} className='group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-x1 text-white bg-no-repeat bg-cover bg-center' style={{backgroundImage: `url(${item.image})`}}>
                <p className='px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full'>{item.priceOff} % OFF</p>
                <div>
                  <p className='text-2x1 font-medium font-playfair'>{item.title}</p> 
                    <p>{item.description}</p> 
                    <p className='text-xs text-white/70 mt-3'>{item.expiryDate}</p>
                </div>
                <button className='flex items-centre gap-2 font-medium coursor-pointer mt-4 mb-5'> 
                View Offers
                <img classNames='invert group-hover:translate-x-1 transition-all' src={assets.arrowIcon} alt='arrow-icon'></img>
                </button>
            </div>
        ))}
      </div>
    </div>
  )
}

export default ExclusiveOffers
