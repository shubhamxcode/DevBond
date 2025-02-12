import { useEffect, useState } from "react";
import { TbBaselineDensityMedium } from "react-icons/tb";
import axios from "axios";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

interface UserData {
  username: string;
  email: string;
}

function UserProf() {
  const username = useSelector(
    (state: RootState) => state.userProfile.username
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiUrl = import.meta.env.DEV
          ? "http://localhost:5173"
          : import.meta.env.VITE_RENDER_URL_;

        const response = await axios.get(`${apiUrl}/api/users/${username}`);
        setUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

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
          {userData && (
            <div className="text-white">
              <p>Email: {userData.email}</p>
              {/* Add other user data fields here */}
            </div>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Render user-related cards or suggestions here */}
      </div>
    </div>
  );
}

export default UserProf;
