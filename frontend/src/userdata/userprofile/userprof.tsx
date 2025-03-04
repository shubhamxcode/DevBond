import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { followUser } from "../../components/Slices/userslice"; // Import followUser action

interface User {
  username: string;
  selectedField: string;
  _id?: string; // Ensure userId exists in API response
}

function UserProf() {
  const dispatch = useDispatch();
  const followedUsers = useSelector((state: RootState) => state.userProfile.followedUsers); // Get followed users
  const [fieldData, setFieldData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedField = useSelector((state: RootState) => state.userProfile.selectedField);
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
 

  // console.log("Token:", accessToken);
  // console.log("Selected Field:", selectedField);
  // console.log("Followed Users:", followedUsers);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const apiUrl = import.meta.env.DEV
  ? "http://localhost:2000"  // Local backend for development
  : import.meta.env.VITE_RENDER_URL_;  // Render backend for production

  useEffect(() => {
    const fetchFieldData = async () => {
      if (selectedField && accessToken) {
        try {
          // Add a console log to debug the request
          console.log("Fetching users with field:", selectedField);
          
          const response = await axios.get(`${apiUrl}/api/users/users-by-field?selectedField=${selectedField}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          
          console.log("Response received:", response.data);
          setFieldData(response.data);
          setError(null);
        } catch (error) {
          console.error("Error fetching field data:", error);
          setError("Failed to fetch developer suggestions.");
        }
      } else {
        console.log("Missing selectedField or accessToken:", { selectedField, accessToken });
      }
    };
  
    fetchFieldData();
  }, [selectedField, accessToken]);
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Profile Dropdown */}
      <div className="relative">
        <button 
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-white hover:text-indigo-400 transition-colors flex items-center gap-2 border rounded-3xl p-4 bg-gradient-to-r from-blue-500 to-purple-500"
        >
          Your profile
          <span className="border-2 w-[50%] rounded-full p-4"></span>
        </button>

        {isOpen && (
          <div className="absolute top-12 right-4 bg-gray-800 rounded-md shadow-lg py-2 w-48 z-10">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-white text-sm font-medium">Menu</p>
              <p className="text-gray-300 text-sm">Connections: {followedUsers.length}</p> {/* Show count */}
            </div>

            <div className="border-t border-gray-700 mt-1 pt-1">
              <a href="#" className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700">Sign out</a>
            </div>
          </div>
        )}
      </div>

      {/* Developer Suggestions Section */}
      <div className="text-center mb-12 p-8 rounded-lg shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900">
        <h1 className="text-white text-5xl font-bold">Developer Suggestions</h1>
        <h2 className="text-white text-5xl font-semibold">For You</h2>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fieldData.length > 0 ? (
            fieldData.map((item, index) => {
              const userId = item._id || item.username; // Use userId or fallback to username
              console.log("there is an id",userId);
              
              return (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-start"
                >
                  <div className="flex items-center space-x-3 mb-3 w-full">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-white text-lg font-semibold truncate">{item.username}</h3>
                  </div>
                  <div className="bg-gray-700/50 px-3 py-1 rounded-md mb-4">
                    <p className="text-gray-300 text-sm">{item.selectedField}</p>
                  </div>
                  <button 
                    className={`mt-auto w-full ${
                      followedUsers.includes(userId)
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                    } text-white py-2 px-4 rounded-lg transition-colors duration-300 font-medium flex items-center justify-center space-x-2`}
                    onClick={async() => {
                      if (!followedUsers.includes(userId)) {
                        try {
                          const response=await axios.post('api/users/userfollower',{followerId:userId})
                          console.log(response)
                          dispatch(followUser(userId)); // Dispatch action to follow
                        } catch (error) {
                          console.log("there is an error while following user",error)
                        }
                      }
                    }}
                    disabled={followedUsers.includes(userId)} // Disable button if already followed
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                      <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    <span>{followedUsers.includes(userId) ? "Following" : "Follow"}</span>
                  </button>
                </div>
              );
            })
          ) : (
            !error && (
              <div className="col-span-full flex justify-center items-center p-8 bg-gray-800/50 rounded-lg">
                <p className="text-gray-300 text-center">No suggestions available at the moment. Check back later!</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProf;
