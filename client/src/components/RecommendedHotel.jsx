import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../conext/AppContext'

const RecommendedHotel = () => {

  const {rooms,searchedCities} = useAppContext();
  const [recommended , setRecommended] = useState([]);

const filterHotels = () =>{
    const filteredHotels = recommended.slice().filter(room => searchedCities.includes(room.hotel.city))
    setRecommended(filteredHotels)
}

useEffect(()=>{
    filterHotels();
},[rooms ,searchedCities])

  return recommended.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
        <Title title='Recommended Hotel' subtitle='Discover our handdpicked selection of expectional properties around the worl offering unparalled luxury and unforgettbale experievce' ></Title>

      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {recommended.slice(0,3).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

        
    </div>
  )
}

export default RecommendedHotel
