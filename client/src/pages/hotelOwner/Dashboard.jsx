import React, { useState, useEffect } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../conext/AppContext';

const Dashboard = () => {
  const { currency, user, getToken, toast, axios } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/bookings/hotel', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div>
      <Title align='left' font='outfit' title='Dashboard' subtitle='' />

      <div className='flex gap-4 my-8'>
        {/* Total Bookings */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8 items-center gap-4'>
          <img src={assets.totalBookingIcon} alt='Bookings Icon' />
          <div>
            <p>Total Bookings</p>
            <p>{dashboardData.totalBookings}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8 items-center gap-4'>
          <img src={assets.totalRevenueIcon} alt='Revenue Icon' />
          <div>
            <p>Total Revenue</p>
            <p>
              {currency} {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className='text-lg font-semibold mb-2'>Recent Bookings</h2>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='text-left px-4 py-2'>User Name</th>
              <th className='text-left px-4 py-2'>Room Name</th>
              <th className='text-left px-4 py-2'>Total Amount</th>
              <th className='text-left px-4 py-2'>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.bookings.map((item, index) => (
              <tr key={index} className='border-t'>
                <td className='px-4 py-2'>{item.user.username}</td>
                <td className='px-4 py-2'>{item.room.roomType}</td>
                <td className='px-4 py-2'>
                  {currency} {item.totalPrice}
                </td>
                <td className='px-4 py-2'>
                  <button
                    className={`py-1 px-3 text-xs rounded-full ${
                      item.isPaid
                        ? 'bg-green-200 text-green-600'
                        : 'bg-amber-200 text-yellow-600'
                    }`}
                  >
                    {item.isPaid ? 'Completed' : 'Pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
