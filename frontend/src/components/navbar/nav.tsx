import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { RiRocketLine } from "react-icons/ri";
import { FaHome, FaStar, FaBriefcase, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FiMenu, FiX } from "react-icons/fi";

// Compact Dock for smaller screens
const Dock: FC<{ children: React.ReactNode; compact?: boolean }> = ({ children, compact = false }) => {
  return (
    <motion.div
      className={`flex items-center ${compact ? 'gap-1 px-2 py-1 min-h-[40px]' : 'gap-1 px-6 py-4 min-h-[60px]'} 
                  bg-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-full`}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 1000, damping: 15, duration: 0.05 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Responsive Dock Icon
const DockIcon: FC<{ 
  children: React.ReactNode; 
  className?: string; 
  tooltip?: string;
  to: string;
  compact?: boolean;
}> = ({ children, className = "", tooltip, to, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="relative">
      <Link to={to}>
        <motion.div
          className={`${compact ? 'p-1.5' : 'p-3'} rounded-full cursor-pointer transition-all duration-75 ${className}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{
            scale: compact ? 1.2 : 1.5,
            y: compact ? -4 : -12,
            transition: { type: "spring", stiffness: 1200, damping: 10, duration: 0.03 }
          }}
          whileTap={{
            scale: 0.85,
            transition: { type: "spring", stiffness: 1200, damping: 10, duration: 0.03 }
          }}
        >
          <div className={`${compact ? 'text-sm' : 'text-lg'}`}>
            {children}
          </div>
        </motion.div>
      </Link>
      {/* Tooltip - only on desktop */}
      <AnimatePresence>
        {isHovered && tooltip && !compact && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
                     bg-gray-800/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 
                     rounded-lg whitespace-nowrap z-10 border border-gray-700/50"
          >
            {tooltip}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800/90 rotate-45 border-l border-t border-gray-700/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Nav: FC = () => {
  const username = useSelector((state: any) => state.userProfile.username);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome />, color: "text-blue-400", tooltip: "Home" },
    { path: "/feature", label: "Features", icon: <FaStar />, color: "text-purple-400", tooltip: "Features" },
    { path: "/work", label: "Work", icon: <FaBriefcase />, color: "text-green-400", tooltip: "Work" },
    { path: "/contact", label: "Contact", icon: <FaEnvelope />, color: "text-pink-400", tooltip: "Contact" },
    { path: "/help", label: "Help", icon: <FaQuestionCircle />, color: "text-yellow-400", tooltip: "Help" },
  ];

  return (
    <header className="fixed w-full top-0 z-50">
      <div className="w-full">
        <div className="max-w-[1536px] mx-auto">
          <nav className="flex items-center justify-between h-12 sm:h-14 lg:h-20 px-2 sm:px-4">
            {/* Logo - Smaller on mobile */}
            <Link to="/">
              <motion.div
                className="flex items-center gap-1 sm:gap-2 lg:gap-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 sm:-inset-1 lg:-inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300" />
                  <div className="relative p-0.5 sm:p-1 lg:p-2">
                    <RiRocketLine className="h-4 w-4 sm:h-5 sm:w-5 lg:h-8 lg:w-8 text-blue-500" />
                  </div>
                </div>
                <span className="text-sm sm:text-base lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  BOND
                </span>
              </motion.div>
            </Link>

            {/* Hamburger for mobile */}
            <button
              className="xl:hidden p-1 sm:p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
            >
              {mobileOpen ? 
                <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : 
                <FiMenu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              }
            </button>

            {/* Desktop Navigation - Compact Layout */}
            <div className="hidden xl:flex items-center gap-3">
              {/* Compact Navigation Dock */}
              <Dock compact={false}>
                {navItems.map((item) => (
                  <DockIcon
                    key={item.path}
                    className={`${location.pathname === item.path ? "ring-2 ring-blue-400/80 bg-blue-400/20" : ""} ${item.color}`}
                    tooltip={item.tooltip}
                    to={item.path}
                  >
                    {item.icon}
                  </DockIcon>
                ))}
              </Dock>
              
              {/* Auth Section - More compact */}
              <div className="pl-3 border-l border-gray-800">
                {username ? (
                  <Link to="/profile">
                    <motion.div
                      className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full cursor-pointer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {username[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-300 max-w-[80px] truncate">
                        {username}
                      </span>
                    </motion.div>
                  </Link>
                ) : (
                  <Link to="/login">
                    <motion.button
                      className="px-4 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 
                               rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign In
                    </motion.button>
                  </Link>
                )}
              </div>
            </div>

            {/* Tablet Navigation - Ultra compact dock */}
            <div className="hidden lg:flex xl:hidden items-center gap-2">
              <Dock compact={true}>
                {navItems.slice(0, 4).map((item) => (
                  <DockIcon
                    key={item.path}
                    className={`${location.pathname === item.path ? "ring-1 ring-blue-400/80 bg-blue-400/20" : ""} ${item.color}`}
                    to={item.path}
                    compact={true}
                  >
                    {item.icon}
                  </DockIcon>
                ))}
              </Dock>
              
              {username ? (
                <Link to="/profile">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {username[0].toUpperCase()}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-6" onClick={e => e.stopPropagation()}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 text-base font-semibold ${location.pathname === item.path ? "text-blue-400" : "text-white"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="w-32 border-t border-gray-700 my-2"></div>
              {username ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-3 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="bg-white/20 rounded-full px-2 py-1 text-white font-bold">{username[0].toUpperCase()}</span>
                  {username}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Nav;