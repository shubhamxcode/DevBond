import { useEffect, useState } from "react";
import { TbBaselineDensityMedium } from "react-icons/tb";
import axios from "axios";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

function UserProf() {
  const username = useSelector(
    (state: RootState) => state.userProfile.username
  );

  interface User {
    username: string;
    _id: string;
    image?: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-x-2">
          <TbBaselineDensityMedium className="text-white text-2xl" />
          <h1 className="text-white text-xl">All</h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="text-center mb-12 p-8 rounded-lg shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="space-y-4">
          <h1 className="text-white text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Developer Suggestions
          </h1>
          <h2 className="text-white text-5xl font-semibold">For You</h2>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {username}
          </h2>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl 
                     shadow-lg hover:shadow-2xl transition-all duration-300 
                     hover:transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Decorative background element */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                          group-hover:opacity-100 opacity-0 transition-opacity duration-300"
            />

            {/* Profile image container */}
            <div className="relative">
              <div
                className="w-24 h-24 mx-auto rounded-full overflow-hidden 
                            border-4 border-blue-500/50 group-hover:border-blue-400 
                            transition-all duration-300 shadow-lg"
              >
                <img
                  src={user.image || "default-image-path.jpg"}
                  alt={`${user.username} avatar`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* User info */}
            <div className="mt-6 text-center relative z-10">
              <h2
                className="text-white text-xl font-semibold mb-4 
                           group-hover:text-blue-400 transition-colors duration-300"
              >
                {user.username}
              </h2>

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
                               text-white px-6 py-2.5 rounded-lg font-medium
                               hover:from-blue-500 hover:to-blue-600
                               transform transition-all duration-300
                               shadow-md hover:shadow-xl
                               focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                               focus:outline-none"
              >
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
