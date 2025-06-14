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
            //API call
            const {data} = await axios.get('/api/rooms/owner', {
                headers :{Authorization : `Bearer ${await getToken()}`}
            });

            if(data.success){
                setRooms(data.rooms);
            } else {
                toast.error(data.message);
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
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-12 px-4 md:px-16 lg:px-24 xl:px-32">
    <div className="max-w-6xl mx-auto backdrop-blur-md bg-white/70 border border-gray-200 shadow-xl rounded-3xl p-6 md:p-10">
        <Title align='left' font='outfit' title='Room Listings' subtitle='All the rooms you’ve listed and their current availability'></Title>
        <p className='text-gray-500 mt-8'>All Rooms</p>
        <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>

        {/* Table */}
        <table className="mt-8 max-h-[420px] overflow-x-auto overflow-y-auto rounded-xl">
            <thead className="uppercase text-[11px] tracking-wide text-gray-600 bg-white/80 border-b border-gray-200 sticky top-0 backdrop-blur-md">
                <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4 max-sm:hidden">Facilities</th>
                    <th className="py-3 px-4">Price/night</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    rooms.map((item,index)=>(
                        <tr key={item._id}>
                            <td className="py-4 px-4 font-medium">
                                {currency} {item.roomType}
                            </td>
                            <td className="py-4 px-4 max-sm:hidden">
                                {item.amenities.join(', ')}
                            </td>  
                            <td className="py-4 px-4">
                                {item.pricePerNight}
                            </td> 
                            <td className="py-4 px-4">
                                <label className="relative inline-flex items-center cursor-pointer select-none"> 
                                <input onChange={()=>toggleRoomAvailability(item._id)} type='checkbox' checked={item.isAvailable}
                                className="sr-only peer"
                                ></input>
                                {/* Track */}
                                <div className="w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-black transition-colors peer-focus:ring-2 peer-focus:ring-black/20" ></div>
                                <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" ></span>
                                </label>
                            </td>                                        
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </div>
    </div>
    </section>
  )
}

export default ListRoom
