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
  const username = useSelector((state: RootState) => state.userProfile.username);
  const userId = useSelector((state: RootState) => state.userProfile.userId);
  const selectedField = useSelector((state: RootState) => state.userProfile.selectedField);

  useEffect(() => {
    const fetchFieldData = async () => {
      console.log("Fetching data for selectedField:", selectedField);
      try {
        const response = await axios.get(`/api/users/users-by-field?selectedField=${selectedField}`);
        console.log("Response data:", response.data);
        setFieldData(response.data);
      } catch (error) {
        console.log("Error fetching field data:", error);
      }
    };

    if (selectedField) {
      fetchFieldData();
    }
  }, [selectedField]);

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
        <h2 className="text-5xl font-bold text-green-400">{username}</h2>
        <p className="text-white text-2xl mt-2">User ID: <span className="text-green-400 font-bold">{userId}</span></p>
        <p className="text-white text-2xl mt-2">Selected Field: <span className="text-green-400 font-bold">{selectedField}</span></p>
        
        {/* Display fetched field data */}
        <div className="mt-4">
          {fieldData.length > 0 ? (
            fieldData.map((item, index) => (
              <div key={index} className="text-white text-lg">{item.username} - {item.selectedField}</div>
            ))
          ) : (
            <p className="text-white">No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProf;
