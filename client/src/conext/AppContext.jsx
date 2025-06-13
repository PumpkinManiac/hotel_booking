import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

//axios package for API call
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
console.log("Axios baseURL:", axios.defaults.baseURL);
const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY || 'USD';
  const navigate = useNavigate();
  const { user } = useUser(); //extract the user from Clerk's useUser hook
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms'); 
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user', {
        headers: {
          
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setIsOwner(data.role === 'hotelOwner');
        setSearchedCities(data.recentSearchedCities);
      } else {
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //whenever the user changes , excute this function
  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
//whatever we provide in the value object we can access in any component using useAppContext

export const useAppContext = () => useContext(AppContext);
