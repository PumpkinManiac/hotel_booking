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
//call the function whenever page get lodded
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-10 px-4 md:px-10 lg:px-16">
    <div className="max-w-7xl mx-auto">
      <Title align='left' font='outfit' title='Dashboard' subtitle="Overview of your bookings and earnings" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10">
        {/* Total Bookings */}
        <div className="flex items-center gap-4 p-6 bg-white/70 border border-gray-200 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
          <img src={assets.totalBookingIcon} alt='Bookings Icon' />
          <div>
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <p className="text-xl font-semibold text-gray-800">{dashboardData.totalBookings}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="flex items-center gap-4 p-6 bg-white/70 border border-gray-200 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
          <img src={assets.totalRevenueIcon} alt='Revenue Icon' className="w-12 h-12" />
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-xl font-semibold text-gray-800">
              {currency} {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h2>
      <div className="w-full max-h-[420px] overflow-auto border border-gray-200 rounded-2xl shadow-md bg-white/80 backdrop-blur-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="sticky top-0 bg-white/90 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className='text-left px-5 py-3'>User Name</th>
              <th className='text-left px-5 py-3'>Room Name</th>
              <th className='text-left px-5 py-3'>Total Amount</th>
              <th className='text-left px-5 py-3'>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.bookings.map((item, index) => (
              <tr key={index} className='border-t'>
                <td className='px-5 py-3'>{item.user.username}</td>
                <td className='px-5 py-3'>{item.room.roomType}</td>
                <td className='px-5 py-3'>
                  {currency} {item.totalPrice}
                </td>
                <td className='px-5 py-3'>
                      <span
                        className={`inline-block py-1 px-3 text-xs font-medium rounded-full ${
                          item.isPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.isPaid ? 'Completed' : 'Pending'}
                      </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </section>
  );
};

export default Dashboard;
