import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';
import { Particles } from '../magicui/particles';
import { motion } from 'framer-motion';

const RegisterUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  // Add state for email and password errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  const usernameRegex = /^[A-Z][a-zA-Z0-9_]*$/;

  const apiUrl = import.meta.env.DEV
    ? "http://localhost:4001"
    : import.meta.env.VITE_RENDER_URL_;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/api/users/register`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response) {
        setMessage("🎉 Registered successfully! Redirecting to login...");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: any) {
      console.error("Registration error:", error.response || error);
      setMessage("❌ Registration failed. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (name === "username") {
      setUsernameError(usernameRegex.test(value) ? "" : "Username must start with an uppercase letter and contain only letters, numbers, or underscores.");
    }
    if (name === "email") {
      setEmailError(emailRegex.test(value) ? "" : "Email must be a valid professional address (e.g., you@example.com)");
    }
    if (name === "password") {
      setPasswordError(passwordRegex.test(value)
        ? ""
        : "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");
    }
  };

  return (
    <section className="min-h-screen flex items-center bg-black/80 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeamsWithCollision className="h-full w-full absolute inset-0 bg-black/60">
          <Particles quantity={160} className="absolute inset-0 w-full h-full" color="#a5b4fc" />
        </BackgroundBeamsWithCollision>
      </div>

      {/* Main Form */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="w-full max-w-md rounded-xl border border-gray-700/50 bg-black/50 backdrop-blur-xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Character or Logo (optional) */}
          {/* <img src="/signup-character.svg" className="w-28 mx-auto mb-4 animate-float" /> */}

          <motion.h2
            className="text-3xl font-extrabold text-center text-white mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Create an Account ✨
          </motion.h2>

          {message && (
            <motion.p
              className="text-center mb-4 text-sm font-medium text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={data.username}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your username"
                required
              />
              {usernameError && <p className="text-xs text-red-400 mt-1">{usernameError}</p>}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="you@example.com"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Email must be a valid professional address (e.g., you@example.com)</p>
              {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                required
              />
              {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-2 px-4 rounded-md hover:scale-[1.02] active:scale-[0.98] transition shadow-lg"
              >
                Sign Up
              </button>
            </motion.div>
          </form>

          <motion.p
            className="text-sm text-gray-400 text-center mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterUser;
