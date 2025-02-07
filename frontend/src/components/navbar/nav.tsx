import { FC, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { RiRocketLine } from "react-icons/ri";
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";

const Nav: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { username } = useUser();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/feature", label: "Features" },
    { path: "/work", label: "Work" },
    { path: "/contact", label: "Contact" },
    { path: "/help", label: "Help" },
  ];


  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-950/95 backdrop-blur-lg border-b border-gray-800/50' : ''
      }`}
    >
      <div className="max-w-[1536px] mx-auto">
        <nav className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300" />
              <div className="relative p-2">
                <RiRocketLine className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              BOND
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Nav Links */}
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-2 py-1 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path 
                      ? 'text-blue-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Button */}
            <div className="pl-6 border-l border-gray-800">
              {username ? (
                <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{username}</span>
                </div>
              ) : (
                <Link
                  to="/signup"
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 
                           rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <HiOutlineX className="h-6 w-6" />
            ) : (
              <HiOutlineMenuAlt4 className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden px-4 pb-4"
            >
              <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-800/50 overflow-hidden">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-blue-400 bg-gray-800/50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!username && (
                  <div className="p-4 border-t border-gray-800/50">
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-2.5 text-center text-sm font-medium text-white 
                               bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg
                               hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Nav;