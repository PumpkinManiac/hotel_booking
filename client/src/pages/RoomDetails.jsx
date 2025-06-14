/* RoomDetails.jsx — theme‑preserving edition */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import Rating from "../components/Rating";
import { useAppContext } from "../conext/AppContext";
import toast from "react-hot-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  show: i => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const RoomDetails = () => {
  const { rooms, axios, getToken, navigate } = useAppContext();
  const { id } = useParams();

  const [room, setRoom]       = useState(null);
  const [mainImage, setMain]  = useState(null);
  const [checkIn, setIn]      = useState("");
  const [checkOut, setOut]    = useState("");
  const [guests, setGuests]   = useState(1);
  const [isAvail, setAvail]   = useState(false);

  useEffect(() => {
    const r = rooms.find(r => r._id === id);
    if (r) { setRoom(r); setMain(r.images[0]); }
  }, [rooms, id]);

  /* -------- availability & booking ------------- */
  const checkAvailability = async () => {
    if (!checkIn || !checkOut) return;
    if (checkIn >= checkOut) return toast.error("Check‑in must be before check‑out");

    try {
      const { data } = await axios.post("/api/bookings/check-availability",
        { room: id, checkInDate: checkIn, checkOutDate: checkOut });
      if (!data.success) return toast.error(data.message);

      setAvail(data.isAvailable);
      toast[data.isAvailable ? "success" : "error"](
        `Room is ${data.isAvailable ? "" : "not "}available`
      );
    } catch (e) { toast.error(e.message); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isAvail) return checkAvailability();

    try {
      const { data } = await axios.post("/api/bookings/book",
        { room: id, checkInDate: checkIn, checkOutDate: checkOut, guests,
          paymentMethod: "pay at hotel" },
        { headers: { Authorization: `Bearer ${await getToken()}` } });
      data.success
        ? (toast.success(data.message), navigate("/my-bookings"), scrollTo(0, 0))
        : toast.error(data.message);
    } catch (e) { toast.error(e.message); }
  };

  if (!room) return null;

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-28
                    bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* heading */}
      <motion.div variants={fadeIn} initial="hidden" animate="show"
        className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <h1 className="text-3xl sm:text-4xl font-playfair">
          {room.hotel.name}
          <span className="font-inter text-base text-gray-400">
            &nbsp;({room.roomType})
          </span>
        </h1>
        <span className="text-xs font-medium px-3 py-1.5 rounded bg-orange-500">20% Off</span>
      </motion.div>

      {/* rating & address */}
      <motion.div variants={fadeIn} custom={1} initial="hidden" animate="show"
        className="flex items-center gap-2 mt-2 text-gray-300">
        <Rating /><span className="text-sm">200+ reviews</span>
      </motion.div>
      <motion.div variants={fadeIn} custom={2} initial="hidden" animate="show"
        className="flex items-center gap-2 mt-2 text-gray-400">
        <img src={assets.locationIcon} alt="" className="w-4 h-4 invert" />
        <span>{room.hotel.address}</span>
      </motion.div>

      {/* gallery */}
      <motion.div variants={fadeIn} custom={3} initial="hidden" animate="show"
        className="flex flex-col lg:flex-row gap-6 mt-8">
        <motion.img key={mainImage} src={mainImage} alt="main"
          className="w-full lg:w-1/2 h-72 sm:h-96 object-cover rounded-xl shadow-lg"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }} />

        <div className="grid grid-cols-2 gap-4 w-full lg:w-1/2">
          {room.images.map((img, i) => (
            <motion.img key={i} src={img} alt=""
              whileHover={{ scale: 1.05 }}
              onClick={() => setMain(img)}
              className={`h-32 sm:h-40 w-full object-cover rounded-lg cursor-pointer
                          ${mainImage === img ? "outline-2 outline-blue-400" : ""}`} />
          ))}
        </div>
      </motion.div>

      {/* highlights & price */}
      <motion.div variants={fadeIn} custom={4} initial="hidden" animate="show"
        className="flex flex-col md:flex-row md:justify-between mt-10 gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Experience luxury like never before</h2>
          <div className="flex flex-wrap gap-3">
            {room.amenities.map((a, i) => (
              <div key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-lg
                           bg-gray-700/50 backdrop-blur-md shadow-sm">
                <img src={facilityIcons[a]} alt="" className="w-5 h-5 invert" />
                <span className="text-xs capitalize">{a}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-3xl font-playfair text-blue-400 mt-4 md:mt-0">
          ₹{room.pricePerNight}
          <span className="text-sm font-inter text-gray-400"> / night</span>
        </p>
      </motion.div>

      {/* booking form */}
      <motion.form variants={fadeIn} custom={5} initial="hidden" animate="show"
        onSubmit={handleSubmit}
        className="bg-gray-800/80 backdrop-blur-md mt-16 shadow-lg rounded-xl p-6
                   flex flex-col md:flex-row gap-6 md:gap-10 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row flex-wrap gap-6 text-sm text-gray-300">

          <div className="flex flex-col">
            <label htmlFor="in" className="font-medium">Check‑in</label>
            <input id="in" type="date" value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setIn(e.target.value)}
              className="mt-1.5 px-3 py-2 border border-gray-600 rounded
                         bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>

          <div className="flex flex-col">
            <label htmlFor="out" className="font-medium">Check‑out</label>
            <input id="out" type="date" value={checkOut} disabled={!checkIn}
              min={checkIn} onChange={e => setOut(e.target.value)}
              className="mt-1.5 px-3 py-2 border border-gray-600 rounded
                         bg-gray-900 text-gray-100 disabled:opacity-50
                         focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>

          <div className="flex flex-col">
            <label htmlFor="guests" className="font-medium">Guests</label>
            <input id="guests" type="number" min={1} max={6} value={guests}
              onChange={e => setGuests(e.target.value)}
              className="mt-1.5 w-24 px-3 py-2 border border-gray-600 rounded
                         bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>
        </div>

        <button type="submit"
          className="w-full md:w-auto px-8 py-3 rounded-md bg-blue-500 hover:bg-blue-600
                     active:scale-95 transition text-white font-medium">
          {isAvail ? "Book Now" : "Check Availability"}
        </button>
      </motion.form>

      {/* specifications */}
      <motion.div variants={fadeIn} custom={6} initial="hidden" animate="show"
        className="space-y-6 mt-24">
        {roomCommonData.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <img src={s.icon} alt="" className="w-7 h-7 invert" />
            <div>
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="text-gray-400">{s.description}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* description */}
      <motion.div variants={fadeIn} custom={7} initial="hidden" animate="show"
        className="max-w-3xl border-y border-gray-700 py-10 my-16 text-gray-400 leading-relaxed">
        <p>…long room description…</p>
      </motion.div>

      {/* host */}
      <motion.div variants={fadeIn} custom={8} initial="hidden" animate="show"
        className="flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <img src={room.hotel.owner.image} alt=""
            className="w-14 h-14 md:w-18 md:h-18 rounded-full object-cover"/>
          <div>
            <p className="text-lg md:text-xl font-medium">Hosted by {room.hotel.name}</p>
            <div className="flex items-center gap-1 text-gray-300 mt-1">
              <Rating /><span className="ml-2 text-sm">200+ reviews</span>
            </div>
          </div>
        </div>
        <button
          className="px-8 py-3 rounded-md bg-blue-500 hover:bg-blue-600
                     active:scale-95 transition text-white w-max">
          Contact Host
        </button>
      </motion.div>
    </div>
  );
};

export default RoomDetails;