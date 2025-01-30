import { FC } from "react";
import { GiBodySwapping } from "react-icons/gi";
import { Link } from "react-router-dom";

const Nav: FC = () => {
  return (
    <div className="text-white">
      <nav className="flex justify-between items-center p-4 bg-gradient-to-b from-black via-gray-900 to-black  border-gray-700 shadow-lg">
        <Link to="/" className="text-5xl text-white bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-full hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-110">
          <GiBodySwapping />
        </Link>
        <ul className="flex gap-8 text-2xl font-medium">
          <Link to="/" className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer">
            Home
          </Link>
          <Link to="/feature" className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer">
            Feature
          </Link>
          <Link to="/work" className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer">
            Work
          </Link>
          <Link to="/contact" className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer">
            Contact
          </Link>
          <Link to="/help" className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer">
            Help
          </Link>
        </ul>

        {/* Adjust Link to point to the correct Signin component */}
        <Link to='/signup' className="text-2xl px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold transform hover:scale-105">
          Login
        </Link>
      </nav>
    </div>
  );
};

export default Nav;