import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-[#0f0f1f] text-gray-400 pt-12 px-6 md:px-12 lg:px-20 xl:px-32">
      {/* Grid Layout */}
      <div className="max-w-screen-xl mx-auto grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Logo & Description */}
        <div>
          <img
            src={assets.logo}
            alt="QuickStay Logo"
            className="mb-4 h-9 invert opacity-80"
          />
          <p className="text-sm leading-relaxed">
            Discover a new way to travel. Find your ideal stay with comfort, convenience, and inspiration wherever you go.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            {[assets.instagramIcon, assets.facebookIcon, assets.twitterIcon, assets.linkendinIcon].map((icon, idx) => (
              <img
                key={idx}
                src={icon}
                alt={`social-icon-${idx}`}
                className="w-5 opacity-70 hover:opacity-100 hover:scale-110 transition-transform duration-200"
              />
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div>
          <p className="font-semibold text-white text-lg mb-4">Company</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Press</a></li>
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
            <li><a href="#" className="hover:text-white transition">Partners</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <p className="font-semibold text-white text-lg mb-4">Support</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition">Safety Info</a></li>
            <li><a href="#" className="hover:text-white transition">Cancellation</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition">Accessibility</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="font-semibold text-white text-lg mb-4">Stay Updated</p>
          <p className="text-sm mb-3">
            Subscribe to our newsletter for travel ideas and special offers.
          </p>
          <form className="flex items-center mt-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-l bg-white/10 border border-white/20 text-sm px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 p-2 rounded-r"
            >
              <img src={assets.arrowIcon} alt="arrow-icon" className="w-4 invert" />
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-10 border-white/10" />

      {/* Footer Bottom */}
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4 pb-8">
        <p>© {new Date().getFullYear()} QuickStay. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li><a href="#" className="hover:text-white transition">Privacy</a></li>
          <li><a href="#" className="hover:text-white transition">Terms</a></li>
          <li><a href="#" className="hover:text-white transition">Sitemap</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
