import React from 'react';
import { assets } from '../assets/assets';

const Rating = ({ rating = 4 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array(5).fill('').map((_, index) => (
        <img
          key={index}
          src={rating > index ? assets.starIconFilled : assets.starIconOutlined}
          alt={rating > index ? 'filled star' : 'empty star'}
          className="w-[18px] h-[18px]"
        />
      ))}
    </div>
  );
};

export default Rating;
