import React from 'react'
import Navbar from './components/Navbar'
import {Route, Routes, useLocation} from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelReg from './components/HotelReg'
import Layout from './pages/hotelOwner/layout'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './conext/AppContext'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner")
  const {showHotelReg} = useAppContext();
  
  return (
    <div>
      <Toaster></Toaster>
      {!isOwnerPath && <Navbar/>}
      {showHotelReg &&  <HotelReg /> } 

      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/rooms' element={<AllRooms/>}></Route>
          <Route path='/rooms/:id' element={<RoomDetails/>}></Route>
          <Route path='/my-bookings' element={<MyBookings></MyBookings>}></Route>

          <Route path='/owner' element={<Layout></Layout>}>
              <Route index element={<Dashboard></Dashboard>}></Route>
              <Route path='add-room' element={<AddRoom />}></Route>
              <Route path='list-room' element={<ListRoom />}></Route>
          </Route>
        </Routes>
      </div>
      {!isOwnerPath && <Footer/>}
    </div>
  )
}

export default App
