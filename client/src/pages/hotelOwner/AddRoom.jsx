import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../conext/AppContext'
import toast from 'react-hot-toast'

const AddRoom = () => {

    const {axios ,getToken} = useAppContext();

    const [images ,setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
    })

    const [inputs , setInputs] = useState({
        roomType :'',
        pricePerNight: 0,
        amenities : {
            'Free Wifi' : false ,
            'Free Brakfast' : false,
            'Mountain View' : false,
            'Pool Access' : false,

        }
    })

    const [loading , setLoading] = useState(false);

    const onsubmitHandler = async (e) => {
        e.preventDefault();
        //Check if all inputs are filled 
        if(!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image=> !image)){
            toast.error("Please fill all the fields and upload images");
            return
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('roomType', inputs.roomType);
            formData.append('pricePerNight', inputs.pricePerNight);
            //converting amenities sto array & keeping only enable amentities
            const amenities = Object.key(inputs.amenities).filter(key => inputs.amenities[key]);
            formData.append('amenities', JSON.stringify(amenities));

            //Adding images to formData

            Object.keys(images).forEach((key) => {
                
                {images[key] && formData.append(`images`, images[key]);}
            })

            const {data} = await axios.post('/api/rooms', formData,{headers :{Authorization : `Bearer ${await getToken()}`} })

            if(data.success){
                toast.success(data.message);
                setInputs({
                    roomType: '',
                    pricePerNight: 0,
                    amenities: {
                        'Free Wifi': false,
                        'Free Breakfast': false,
                        'Mountain View': false,
                        'Pool Access': false,
                    }
                });
                setImages({
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                });
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }
  return (
    <div>
      <form onSubmit={onsubmitHandler} className='flex flex-col items-center justify-center max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md'>
        {/* Title */}
        <Title align='left' font ='outfit' title='Add Room' subtitle='sezxdrcftvgybhnujkmqwertyuiopasdfghjklzxcvbnm'></Title>
        {/* Upload Area for iamges */}
        <p>Images</p>
        <div>
            {Object.keys(images).map((key)=>(
                <label htmlFor={`roomImage${key}`} key={key}>
                <img src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt=""></img>
                <input type='file' accept='image/*' id={`roomImage${key}`} hidden onChange={e=> setImages({...images,[key]: e.target.files[0]})}></input>
                </label>    
            ))}
        </div>
        <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
            <p> Room Type</p>
            <select value={inputs.roomType} onChange={e=> setInputs({...inputs , roomType: e.target.value})} className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'>
                <option value=''>Select room type</option>
                <option value='Single Bed'>Single Bed</option>
                <option value='Double Bed'>Double Bed</option>
                <option value='Luxury Room'>Luxury Room</option>
                <option value='Family Suite'>Family Suite</option>

            </select>
        </div>
        <div>
            <p> Price <span>/night</span></p>
            <input type='number' placeholder='0' value={inputs.pricePerNight} onChange={e=>setInputs({...inputs,pricePerNight: e.target.value})}></input>
        </div>
        <p className='text-gray-800 mt-4'>Amenities</p>
        <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
            {Object.keys(inputs.amenities).map((amenity, index) => (
                <div key={index}>
                    <inputs type='checkbox' id={`amenities${index+1}`} checked = {inputs.amenities[amenity]} onChange={()=>setInputs({...inputs,amenities: {...inputs.amenities,[amenity] : !inputs.amenities[amenity]}})}></inputs>
                    <label htmlFor={`amenities${index+1}`}>{amenity}</label>

                </div>
            ))}
        </div>
        <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer' disabled={loading}>{loading ? "Adding" : "Add Room"}</button>
      </form>
    </div>
  )
}

export default AddRoom
