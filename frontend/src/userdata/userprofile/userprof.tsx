import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { TbBaselineDensityMedium } from "react-icons/tb";
import { useEffect, useState } from "react";
import axios from "axios";

// Define an interface for the user data
interface User {
  username: string;
  selectedField: string;
}

function UserProf() {
  const [fieldData, setFieldData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const selectedField = useSelector((state: RootState) => state.userProfile.selectedField);
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);

  console.log("Token",accessToken);
  console.log("selectedfield",selectedField);
  
     const apiUrl = import.meta.env.DEV
        ? "http://localhost:2000"  // Local backend for development
        : import.meta.env.VITE_RENDER_URL_;  // Render backend for production

  useEffect(() => {
    const fetchFieldData = async () => {
      if (selectedField && accessToken) {
        try {
          const response = await axios.get(`${apiUrl}/api/users/users-by-field?selectedField=${selectedField}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          console.log("Response received:", response);
          setFieldData(response.data);
          setError(null); // Clear any previous errors
        } catch (error) {
          console.error("Error fetching field data:", error);
          setError("Failed to fetch developer suggestions.");
        }
      }
    };

    fetchFieldData();
  }, [selectedField, accessToken]);

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-x-2">
          <TbBaselineDensityMedium className="text-white text-2xl" />
          <h1 className="text-white text-xl">All</h1>
        </div>
      </div>

      <div className="text-center mb-12 p-8 rounded-lg shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900">
        <h1 className="text-white text-5xl font-bold">Developer Suggestions</h1>
        <h2 className="text-white text-5xl font-semibold">For You</h2>

        {/* Display error message */}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        {/* Display fetched field data */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fieldData.length > 0 ? (
            fieldData.map((item, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-white text-lg font-semibold">{item.username}</h3>
                <p className="text-gray-300">{item.selectedField}</p>
              </div>
            ))
          ) : (
            !error && <p className="text-white">No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProf;
