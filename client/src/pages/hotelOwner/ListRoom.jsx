import React, { useEffect } from 'react'
import { useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../conext/AppContext'
import toast from 'react-hot-toast'

const ListRoom = () => {
    const [rooms,setRooms] = useState([])
    const {axios, getToken , user ,currency} = useAppContext();

    //Fetch Rooms of the Hotel Onwer
    const fetchRooms = async () => {
        try {
            const {data} = await axios.get('/api/rooms/owner', {
                headers :{Authorization : `Bearer ${await getToken()}`}
            });

            if(data.success){
                setRooms(data.rooms);
            } else {
                toast(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Toggel Availability of Room 
    const toggleRoomAvailability = async(roomId) =>{
        const {data} = await axios.post('/api/rooms/toggle-availability', {roomId} ,{headers :{Authorization : `Bearer ${await getToken()}`}})
        if(data.success){
            toast.success(data.message);
            fetchRooms();
        } else {
            toast.error(data.message);
        }
    }

    useEffect(() => {
        if(user){
            fetchRooms();
        }
    },[user])

  return (
    <div>
        <Title align='left' font='outfit' title='Room Listings' subtitle='qwertyuiopasdfghjklzxcvbnmlkjhgfdsqwertyuiop'></Title>
        <p className='text-gray-500 mt-8'>All Rooms</p>
        <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
        <table className='w-full'>
            <thead className='bg-gray-50'>
                <tr>
                    <th>Name</th>
                    <th>Facilities</th>
                    <th>Price/night</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    rooms.map((item,index)=>(
                        <tr key={item._id}>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                {currency} {item.roomType}
                            </td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                {item.amenities.join(', ')}
                            </td>  
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                {item.pricePerNight}
                            </td> 
                            <td className='py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center'>
                                <label> 
                                <input onChange={()=>toggleRoomAvailability(item._id)} type='checkbox' checked={item.isAvailable}></input>
                                <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200'></div>
                                <span className='dot absolute left-1 top-1 w-5 h-5 bg:white rounded-full transition-transforms duration-200 ease-in-out peer-checked:translate-x-5'></span>
                                </label>
                            </td>                                        
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </div>
    </div>
  )
}

export default ListRoom
