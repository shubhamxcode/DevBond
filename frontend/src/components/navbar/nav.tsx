import { FC, useState } from "react";
import { GiBodySwapping } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const Nav: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { username } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="text-white">
      <nav className="flex justify-between items-center p-4 bg-gradient-to-b from-black via-gray-900 to-black border-gray-700 shadow-lg">
        {/* Logo */}
        <Link
          to="/"
          className="text-5xl text-white bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-full hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-110"
        >
          <GiBodySwapping />
        </Link>

        {/* Mobile Menu Button - Only for small screens */}
        <button
          onClick={toggleMenu}
          className="text-2xl text-white focus:outline-none md:hidden"
        >
          ☰
        </button>

        {/* Navigation Links - Visible on md screens and larger */}
        <ul className="hidden md:flex gap-8 text-2xl font-medium">
          <Link
            to="/"
            className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/feature"
            className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
          >
            Feature
          </Link>
          <Link
            to="/work"
            className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
          >
            Work
          </Link>
          <Link
            to="/contact"
            className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
          >
            Contact
          </Link>
          <Link
            to="/help"
            className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
          >
            Help
          </Link>
        </ul>

        {/* Conditional Rendering for Login or Username */}
        <div className="hidden md:block text-2xl px-6 py-2 rounded-full">
          {username ? (
            <span className="text-white">{username}</span>
          ) : (
            <Link
              to="/signup"
              className="text-2xl px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold transform hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu - Visible only on small screens */}
        {isMenuOpen && (
          <ul className="md:hidden flex flex-col absolute top-16 right-4 bg-gray-900 p-4 rounded-lg shadow-lg gap-4 text-2xl font-medium">
            <Link
              to="/"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
            >
              Home
            </Link>
            <Link
              to="/feature"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
            >
              Feature
            </Link>
            <Link
              to="/work"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
            >
              Work
            </Link>
            <Link
              to="/contact"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
            >
              Contact
            </Link>
            <Link
              to="/help"
              className="hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 cursor-pointer"
            >
              Help
            </Link>
            <li>
              {username ? (
                <span className="text-white">{username}</span>
              ) : (
                <Link
                  to="/signup"
                  className="text-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold transform hover:scale-105"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Nav;