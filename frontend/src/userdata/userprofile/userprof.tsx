import { useEffect, useState } from "react";
import { TbBaselineDensityMedium } from "react-icons/tb";
import axios from "axios";

function UserProf() {
  interface User{
    username:string,
    _id:string,
    image?:string
  }
  const [users, setUsers] = useState<User[]>([]); // State to hold the users
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(""); // State to manage error messages

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users"); // Fetch all users
        setUsers(response.data); // Set the users in state
      } catch (err) {
        setError("Failed to fetch users"); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error message

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-x-2">
          <TbBaselineDensityMedium className="text-white text-2xl" />
          <h1 className="text-white text-xl">All Users</h1>
        </div>
        <div className="flex items-center gap-x-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white">👤</span>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="text-center mb-12">
        <h1 className="text-white text-5xl font-semibold">Developer Suggestions</h1>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id} // Use user ID as the key
            className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={user.image || "default-image-path.jpg"} // Use a default image if none is provided
              alt={`${user.username} avatar`}
              className="w-20 h-20 rounded-full mx-auto border-2 border-blue-500"
            />
            <div className="mt-4 text-center">
              <h2 className="text-white text-xl font-semibold">{user.username}</h2> {/* Display username */}
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProf;