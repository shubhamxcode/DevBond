import { FC } from "react";
import { GiBodySwapping } from "react-icons/gi";
import { Link } from "react-router-dom";


const Nav: FC = () => {
  return (
    <div className="text-white">
      <nav className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-600 shadow-md">
        <div className="text-5xl text-white bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition-colors">
          <GiBodySwapping />
        </div>
        <ul className="flex gap-8 text-2xl font-medium">
          <Link to="/" className="hover:text-blue-500 transition-colors cursor-pointer">Home</Link>
          <Link to='' className="hover:text-blue-500 transition-colors cursor-pointer">Feature</Link>
          <li className="hover:text-blue-500 transition-colors cursor-pointer">Work</li>
          <li className="hover:text-blue-500 transition-colors cursor-pointer">Contact</li>
          <li className="hover:text-blue-500 transition-colors cursor-pointer">Help</li>
        </ul>

        {/* Adjust Link to point to the correct Signin component */}
        <Link to='/signup' className="text-2xl px-6 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors font-semibold">
          Login
        </Link>
      </nav>
    </div>
  );
};

export default Nav;
