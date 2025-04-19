import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { followUser, unfollowUser } from "../../components/Slices/userslice"; // Import unfollowUser action
import { Link } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";

interface User {
  username: string;
  selectedField: string;
  _id?:any; // Ensure userId exists in API response
}

function UserProf() {
  const dispatch = useDispatch();
  const followedUsers = useSelector((state: RootState) => state.userProfile.followedUsers); // Get followed users
  const [fieldData, setFieldData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectedField = useSelector((state: RootState) => state.userProfile.selectedField);
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
  const username = useSelector((state: RootState) => state.userProfile.username);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [followLoading, setFollowLoading] = useState<string | null>(null);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [userToUnfollow, setUserToUnfollow] = useState<string | null>(null);

  // console.log("Token:", accessToken);
  // console.log("Selected Field:", selectedField);
  // console.log("Followed Users:", followedUsers);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  // const apiUrl = import.meta.env.DEV
  // ? "http://localhost:2000"  // Local backend for development
  // : import.meta.env.VITE_RENDER_URL_;  // Render backend for production

  useEffect(() => {
    const fetchFieldData = async () => {
      if (selectedField && accessToken) {
        try {
          // Add a console log to debug the request
          console.log("Fetching users with field:", selectedField);
          
          const response = await axios.get(`/api/users/users-by-field?selectedField=${selectedField}`, {
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

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    if (isFollowing){
      // Show confirmation dialog for unfollow
      setUserToUnfollow(userId);
      setShowUnfollowConfirm(true);
    } else {
      // Follow user immediately (no confirmation needed)
      await followUserAction(userId);
    }
  };

  const followUserAction = async (userId: string) => {
    setFollowLoading(userId);
    try {
      const response = await axios.post(`/api/users/userfollower`, {userId, username,selectedField});
      dispatch(followUser({userId:userId.toString(),username,selectedField}));
      console.log("Follow response:", response);
    } catch (error) {
      console.log(`Error following user:`, error);
      // Revert optimistic update on error
      dispatch(unfollowUser({userId:userId.toString(),username,selectedField}));
      setError("Failed to follow user. Please try again.");
    } finally {
      setFollowLoading(null);
    }
  };

  const unfollowUserAction = async (userId: string) => {
    setFollowLoading(userId);
    try {
     
      const response = await axios.post(`/api/users/userunfollow`, {  userId });
      dispatch(unfollowUser({userId:userId.toString()}));
      console.log("Unfollow response:", response);
    } catch (error) {
      console.log(`Error unfollowing user:`, error);
      dispatch(followUser({userId:userId.toString()}));
      setError("Failed to unfollow user. Please try again.");
    } finally {
      setFollowLoading(null);
      setShowUnfollowConfirm(false);
      setUserToUnfollow(null);
    }
  };

  const confirmUnfollow = () => {
    if (userToUnfollow) {
      unfollowUserAction(userToUnfollow);
    }
  };

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = async () => {
    try {
      setShowSignOutConfirm(false);
      setIsOpen(false);
      
      window.location.href = '/login';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Enhanced Profile Dropdown */}
      <div className="relative">
        <button 
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-white hover:text-indigo-400 transition-colors flex items-center gap-2 border border-gray-700 rounded-full p-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/20"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="font-medium pr-1 hidden sm:inline">
              {username || "Your Profile"}
            </span>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-16 right-4 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl py-2 w-64 z-10 border border-gray-700 overflow-hidden transition-all duration-300 animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-white text-lg font-medium">{username || "User"}</p>
                  <p className="text-gray-400 text-sm">Developer</p>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3">
              <div className="flex justify-between items-center mb-2">
                <Link to='/connection' className="text-gray-300 text-sm font-medium">Connections</Link>
                <span className="bg-indigo-600/30 text-indigo-400 text-xs font-medium px-2 py-1 rounded-full">
                  {followedUsers.length}
                </span>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-300 text-sm font-medium">Field</p>
                <span className="bg-purple-600/30 text-purple-400 text-xs font-medium px-2 py-1 rounded-full">
                  {selectedField || "Not set"}
                </span>
              </div>
              <div className="flex justify-between ">
                <p className="text-white">Notification</p>
                <span className="text-red-500 text-2xl"><IoIosNotifications/></span>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-1 pt-1">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-2xl border border-gray-700 animate-scaleIn">
            <h3 className="text-xl font-semibold text-white mb-4">Sign Out</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowSignOutConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unfollow Confirmation Modal */}
      {showUnfollowConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-2xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Unfollow User</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to unfollow this user?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowUnfollowConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmUnfollow}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Suggestions Section */}
      <div className="text-center mb-12 p-8 rounded-lg shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900">
        <h1 className="text-white text-5xl font-bold">Developer Suggestions</h1>
        <h2 className="text-white text-5xl font-semibold">For You</h2>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fieldData.length > 0 ? (
            fieldData.map((item, index) => {
              const userId = item._id; // Use userId or fallback to username
              console.log("hey shubham ur userid is delivered",userId)
              const isFollowing = followedUsers.some(user => user.userId === userId);
              
              
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
                      isFollowing
                        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                    } text-white py-2 px-4 rounded-lg transition-colors duration-300 font-medium flex items-center justify-center space-x-2`}
                    onClick={() => handleFollowToggle(userId, isFollowing)}
                  >
                    {followLoading === userId ? (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <span>{isFollowing ? "Unfollow" : "Follow"}</span>
                      </>
                    )}
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