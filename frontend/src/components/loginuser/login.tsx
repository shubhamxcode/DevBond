import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserId, setusername, setaccessToken } from '../Slices/userslice';
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';
import { Particles } from '../magicui/particles';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrl = import.meta.env.DEV
    ? 'http://localhost:4001'
    : import.meta.env.VITE_RENDER_URL_;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, { email, password });

      if (response.data?.data?.user) {
        const { userId, user } = response.data.data;
        dispatch(setUserId(userId));
        dispatch(setusername(user.username));
        dispatch(setaccessToken(response.data.data.accessToken));
        navigate('/Resumeparsing');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="min-h-screen flex items-center bg-black/80 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeamsWithCollision className="h-full w-full absolute inset-0 bg-black/60">
          <Particles quantity={160} className="absolute inset-0 w-full h-full" color="#a5b4fc" />
        </BackgroundBeamsWithCollision>
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="w-full max-w-md rounded-xl border border-gray-700/50 bg-black/50 backdrop-blur-xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h2
            className="text-3xl font-extrabold text-center text-white mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back 👋
          </motion.h2>

          {error && (
            <motion.p
              className="text-red-500 text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-2 px-4 rounded-md shadow hover:shadow-lg transition duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </button>
            </motion.div>
          </form>

          <motion.p
            className="text-sm text-gray-400 text-center mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginPage;
