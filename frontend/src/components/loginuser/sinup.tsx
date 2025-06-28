import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Set API URL dynamically: Use local URL if running locally, otherwise use Render URL
  const apiUrl = import.meta.env.DEV
    ? "http://localhost:4001"  // Local backend for development
    : import.meta.env.VITE_RENDER_URL_;  // Render backend for production

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/api/users/register`,  // Use dynamic API URL
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("here u got the register data:",response)

      if (response) {
        setMessage("You are registered successfully! Please log in.");
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2s
      }
    } catch (error: any) {
      console.error("Registration error:", error.response || error);
      setMessage("Oops! There was an error during registration.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="text-green-600 text-center text-xl">{message}</div>
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Register
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={data.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <div className="flex text-white text-xl gap-x-2 mt-4">
          <h1>Already have an account?</h1>
          <Link to='/login' className="hover:underline hover:text-green-600 cursor-pointer">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
