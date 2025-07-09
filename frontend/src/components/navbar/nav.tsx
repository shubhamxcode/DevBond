import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { RiRocketLine } from "react-icons/ri";
import { FaUserCircle, FaHome, FaStar, FaBriefcase, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import { BsGridFill } from "react-icons/bs";
import { MdOutlinePersonAdd } from "react-icons/md";
import { useSelector } from "react-redux";

// Enhanced Dock Component with ultra-fast zoom on hover
const Dock: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      className="flex items-end gap-1 px-6 py-4 bg-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-full min-h-[60px]"
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 1000, damping: 15, duration: 0.05 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Dock Icon Component with ultra-fast zoom in/out
const DockIcon: FC<{ 
  children: React.ReactNode; 
  className?: string; 
  tooltip?: string;
  to: string;
}> = ({ children, className = "", tooltip, to }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="relative">
      <Link to={to}>
        <motion.div
          className={`p-3 rounded-full cursor-pointer transition-all duration-75 ${className}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{
            scale: 1.5,
            y: -12,
            transition: { type: "spring", stiffness: 1200, damping: 10, duration: 0.03 }
          }}
          whileTap={{
            scale: 0.85,
            transition: { type: "spring", stiffness: 1200, damping: 10, duration: 0.03 }
          }}
        >
          {children}
        </motion.div>
      </Link>
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && tooltip && (
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
  const accessToken = useSelector((state: any) => state.userProfile.accessToken);
  const location = useLocation();

  // Navigation items with dock integration
  const navItems = [
    { path: "/", label: "Home", icon: <FaHome />, color: "text-blue-400", tooltip: "Home" },
    { path: "/feature", label: "Features", icon: <FaStar />, color: "text-purple-400", tooltip: "Features" },
    { path: "/work", label: "Work", icon: <FaBriefcase />, color: "text-green-400", tooltip: "Work" },
    { path: "/contact", label: "Contact", icon: <FaEnvelope />, color: "text-pink-400", tooltip: "Contact" },
    { path: "/help", label: "Help", icon: <FaQuestionCircle />, color: "text-yellow-400", tooltip: "Help" },
  ];

  // User-specific navigation items
  const userNavItems = accessToken ? [
    { path: "/profile", label: "Profile", icon: <FaUserCircle />, color: "text-orange-400", tooltip: "Profile" },
    { path: "/field", label: "Fields", icon: <BsGridFill />, color: "text-cyan-400", tooltip: "Fields" },
    { path: "/follow-requests", label: "Follow Requests", icon: <MdOutlinePersonAdd />, color: "text-indigo-400", tooltip: "Follow Requests" },
  ] : [];

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      <div className="w-full">
        <div className="max-w-[1536px] mx-auto">
          <nav className="flex items-center justify-between h-20 px-4">
            {/* Logo */}
            <Link to="/">
              <motion.div
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300" />
                  <div className="relative p-2">
                    <RiRocketLine className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  BOND
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation - Row Layout */}
            <div className="flex items-center gap-8">
              {/* Main Navigation Dock */}
              <Dock>
                {navItems.map((item) => (
                  <DockIcon
                    key={item.path}
                    className={`${location.pathname === item.path ? "ring-2 ring-blue-400/80 bg-blue-400/20" : ""}`}
                    tooltip={item.tooltip}
                    to={item.path}
                  >
                    <div className={`${item.color} text-lg`}>
                      {item.icon}
                    </div>
                  </DockIcon>
                ))}
              </Dock>

              {/* User Navigation Dock (if logged in) */}
              {accessToken && userNavItems.length > 0 && (
                <Dock>
                  {userNavItems.map((item) => (
                    <DockIcon
                      key={item.path}
                      className={`${location.pathname === item.path ? "ring-2 ring-blue-400/80 bg-blue-400/20" : ""}`}
                      tooltip={item.tooltip}
                      to={item.path}
                    >
                      <div className={`${item.color} text-lg`}>
                        {item.icon}
                      </div>
                    </DockIcon>
                  ))}
                </Dock>
              )}

              {/* Auth Section */}
              <div className="pl-6 border-l border-gray-800">
                {username ? (
                  <Link to="/profile">
                    <motion.div
                      className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-full cursor-pointer"
                      whileHover={{ 
                        scale: 1.08, 
                        y: -4, 
                        boxShadow: "0 4px 24px 0 rgba(99,102,241,0.25)",
                        transition: { type: "spring", stiffness: 700, damping: 12 }
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <motion.div
                        className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                        whileHover={{
                          scale: 1.15,
                          boxShadow: "0 0 0 4px rgba(99,102,241,0.25), 0 4px 24px 0 rgba(99,102,241,0.25)",
                          background: "linear-gradient(90deg, #6366f1 0%, #a78bfa 100%)"
                        }}
                        transition={{ type: "spring", stiffness: 700, damping: 12 }}
                      >
                        <span className="text-sm font-medium text-white">
                          {username[0].toUpperCase()}
                        </span>
                      </motion.div>
                      <motion.span
                        className="text-sm text-gray-300"
                        whileHover={{ color: "#fff" }}
                        transition={{ duration: 0.08 }}
                      >
                        {username}
                      </motion.span>
                    </motion.div>
                  </Link>
                ) : (
                  <Link to="/login">
                    <motion.button
                      className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Nav;