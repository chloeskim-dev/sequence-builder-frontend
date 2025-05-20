import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
    <span className="font-bold">Sequence Builder Pro</span>
    <div className="space-x-4">
      <Link to="/dashboard" className="hover:underline">
        Dashboard
      </Link>
      <Link to="/settings" className="hover:underline">
        Settings
      </Link>
      <Link to="/logout" className="hover:underline">
        Logout
      </Link>
    </div>
  </nav>
);

export default Navbar;
