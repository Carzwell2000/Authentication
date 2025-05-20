import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-blue-700 text-white">
      <nav className="flex justify-between px-8 py-3 text-lg">
        <Link to="/home" className="hover:underline">
          Home
        </Link>
        <Link to="/about" className="hover:underline">
          About Us
        </Link>
        <Link to="/services" className="hover:underline">
          Services
        </Link>
        <Link to="/contact" className="hover:underline">
          Contact Us
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;
