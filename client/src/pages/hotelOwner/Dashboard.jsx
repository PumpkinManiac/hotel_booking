import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'
import { useAppContext } from '../../conext/AppContext'

const Dashboard = () => {

    const {currency , user ,getToken , toast , axios} = useAppContext();

    const [dashboardData , setDashboardData] = useState({
        bookings : [],
        totalBookings: 0,
        totalRevenue: 0,
    })

    const fetchDashboardData = async ()=>{
        try {
            const {data} = await axios.get('/api/bookings/hotel' , {headers: {Authorization: `Bearer ${await getToken()}`}})
            if(data.success){
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect (()=>{
        if(user){
            fetchDashboardData();
        }
    },[user])

  return (
    <div>
      <Title align='left' font='outfit' title= 'Dashboard' subtitle=''></Title>
      <div className='flex gap-4 my-8'>
        {/* Total Bookings */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
            <img src={assets.totalBookingIcon}></img>
            <div>
                <p>Total Bookings</p>
                <p>{dashboardData.totalBookings}</p>
            </div>
        </div>
        {/* total revenue */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
            <img src={assets.totalRevenueIcon}></img>
            <div>
                <p>Total Revenue</p>
                <p>{currency} {dashboardData.totalRevenue}</p>
            </div>
        </div>
      </div>

      {/* Recent Booking */}
      <h2>Recent Bookings</h2>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
        <table className='w-full'>
            <thead className='bg-gray-50'>
                <tr>
                    <th>User Name</th>
                    <th>Room Name</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                </tr>
            </thead>

            <tbody>
                {dashboardData.bookings.map((item,index)=>(
                    <tr key ={index}>
                        <td>{item.user.username}</td>
                        <td>{item.room.roomType}</td>
                        <td>{currency} {item.totalPrice}</td>
                        <td><button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-grenn-200 text-green-600' : 'bg-amber-200 text-yellow-600'}`}>
                            {item.isPaid ? 'Completed' :  "Pending"}
                        </button></td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
