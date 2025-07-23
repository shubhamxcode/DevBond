import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import FollowButton from "../../components/Follow/follow";
import { logoutUser, setConnections } from "../../components/Slices/userslice";
import { Particles } from "../../components/magicui/particles";

interface User {
  username: string;
  selectedField: string;
  _id?: string;
}

interface Connection {
  userId?: string;
  _id?: string;
  username: string;
  selectedField: string;
}

function UserProf() {
  const [fieldData, setFieldData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userBios, setUserBios] = useState<{ [userId: string]: string }>({});

  const selectedField = useSelector(
    (state: RootState) => state.userProfile.selectedField
  );
  const accessToken = useSelector(
    (state: RootState) => state.userProfile.accessToken
  );
  const username = useSelector(
    (state: RootState) => state.userProfile.username
  );
  const followedUsers = useSelector(
    (state: RootState) => state.userProfile.followedUsers
  );
  const resumeBio = useSelector((state: RootState) => state.userProfile.resumeInfo?.bio);
  console.log(`shera:`, resumeBio);


  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const apiUrl = import.meta.env.DEV
  ? 'http://localhost:4001'
  : import.meta.env.VITE_RENDER_URL_;


  const toggleMenu = () => setIsOpen(!isOpen);

  // Authentication check effect
  useEffect(() => {
    // Log auth state to help with debugging
    console.log("Auth state on page load:", {
      isLoggedIn: !!accessToken,
      username,
      selectedField
    });

    // If not authenticated, redirect to login
    if (!accessToken) {
      console.warn("No access token found - redirecting to login");
      navigate('/login');
    }
  }, [accessToken, username, selectedField, navigate]);

  // Check if user has completed setup
  useEffect(() => {
    const checkUserSetup = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get(`${apiUrl}/api/users/check-setup`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        const { hasResume, hasSelectedField, isSetupComplete } = response.data.data;

        if (!isSetupComplete) {
          // User hasn't completed setup, redirect to appropriate page
          if (!hasResume) {
            navigate('/Resumeparsing');
          } else if (!hasSelectedField) {
            navigate('/field');
          }
        }
        // If setup is complete, stay on profile page
      } catch (error) {
        console.error('Error checking user setup:', error);
        // Continue with profile if check fails
      }
    };

    checkUserSetup();
  }, [accessToken, navigate, apiUrl]);

  // Fetch user's actual connections/followers
  useEffect(() => {
    const fetchConnections = async () => {
      if (accessToken) {
        try {
          console.log("Fetching user's connections...");
          const response = await axios.get(`${apiUrl}/api/users/connections`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (response.data && response.data.data) {
            // Set all connections from backend
            const connectionsData = response.data.data.map((connection: Connection) => ({
              userId: connection.userId || connection._id,
              username: connection.username,
              selectedField: connection.selectedField
            }));
            dispatch(setConnections(connectionsData));
          }
        } catch (error) {
          console.error("Error fetching connections:", error);
          // Don't set error state here as connections might not be available yet
        }
      }
    };

    fetchConnections();
  }, [accessToken, dispatch]);

  useEffect(() => {
    const fetchFieldData = async () => {
      if (selectedField && accessToken) {
        try {
          console.log("Fetching developers with field:", selectedField);
          console.log("Using access token:", accessToken);

          const response = await axios.get(
            `${apiUrl}/api/users/users-by-field?selectedField=${selectedField}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          console.log("Raw API response:", response);

          // Handle the API response properly
          // Our improved backend returns data in { data: [...], message: "..." } format
          if (response.data && response.data.data) {
            // If the response follows the ApiResponse format
            setFieldData(response.data.data);

            // Note: We don't dispatch followUser here since these are just suggestions, not actual connections
            // The followUser action should only be dispatched when someone actually accepts a follow request
          } else if (Array.isArray(response.data)) {
            // For backward compatibility, if the response is directly an array
            setFieldData(response.data);

            // Note: We don't dispatch followUser here since these are just suggestions, not actual connections
          } else {
            console.error("Unexpected API response format:", response.data);
            setFieldData([]);
            setError("Invalid data format received from server");
          }

        } catch (error) {
          console.error("Error fetching field data:", error);
          setError("Failed to fetch developer suggestions.");
        }
      }
    };
    fetchFieldData();
  }, [selectedField, accessToken, dispatch]);

  // Fetch bios for each user in fieldData
  useEffect(() => {
    const fetchBios = async () => {
      if (!accessToken) return;
      const apiUrl = import.meta.env.DEV ? "http://localhost:4001" : import.meta.env.VITE_RENDER_URL_;
      const bios: { [userId: string]: string } = {};
      await Promise.all(
        fieldData.map(async (user) => {
          try {
            const response = await axios.get(`${apiUrl}/api/users/resume/${user._id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
              withCredentials: true,
            });
            bios[user._id!] = response.data.data?.bio || "No bio available.";
          } catch {
            bios[user._id!] = "No bio available.";
          }
        })
      );
      setUserBios(bios);
    };
    if (fieldData.length > 0) {
      fetchBios();
    }
  }, [fieldData, accessToken]);

  const handleSignOut = () => setShowSignOutConfirm(true);

  const confirmSignOut = async () => {
    try {
      // Clear the user data from Redux store
      dispatch(logoutUser());

      // Also try to logout from the backend
      await axios.post('/api/users/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).catch(error => {
        // Even if backend logout fails, we still want to logout locally
        console.warn("Backend logout failed:", error);
      });

      setShowSignOutConfirm(false);
      setIsOpen(false);

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Helper function to get field color
  const getFieldColor = (field: string) => {
    const colors = {
      'frontend': 'from-blue-500 to-cyan-500',
      'backend': 'from-green-500 to-emerald-500',
      'full stack': 'from-purple-500 to-pink-500',
      'mobile': 'from-orange-500 to-red-500',
      'devops': 'from-indigo-500 to-blue-500',
      'data science': 'from-teal-500 to-green-500',
      'ai/ml': 'from-violet-500 to-purple-500',
      'ui/ux': 'from-pink-500 to-rose-500',
      'cloud': 'from-sky-500 to-blue-500',
      'security': 'from-red-500 to-orange-500',
      'blockchain': 'from-yellow-500 to-yellow-700',
      'default': 'from-gray-500 to-gray-600'
    };
    return colors[field.toLowerCase() as keyof typeof colors] || colors.default;
  };

  return (
    <section className="min-h-screen bg-black/80 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Remove BackgroundBeamsWithCollision, keep only Particles */}
        <Particles
          quantity={1000}
          className="absolute inset-0 w-full h-full"
          color="#a5b4fc"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">

        {/* Profile Dropdown - Fixed Position */}
        <div className="relative z-20">
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
            <div className="absolute top-16 right-4 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl py-2 w-64 z-30 border border-gray-700 overflow-hidden transition-all duration-300 animate-fadeIn">
              <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-white text-lg font-medium">
                      {username || "User"}
                    </p>
                    <p className="text-gray-400 text-sm">Developer</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex justify-between items-center mb-2">
                  <Link
                    to="/connection"
                    className="text-gray-300 text-sm font-medium hover:text-indigo-400 transition-colors"
                  >
                    Connections
                  </Link>
                  <span className="bg-indigo-600/30 text-indigo-400 text-xs font-medium px-2 py-1 rounded-full">
                    {followedUsers.length}
                  </span>
                </div>
                {/* Show follower names if there are any */}
                {followedUsers.length > 0 && (
                  <div className="mb-3 px-2">
                    <div className="max-h-20 overflow-y-auto">
                      {followedUsers.slice(0, 3).map((user, index) => (
                        <div key={user.userId || index} className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="text-gray-400 text-xs truncate">
                            {user.username || 'Unknown User'}
                          </span>
                        </div>
                      ))}
                      {followedUsers.length > 3 && (
                        <div className="text-gray-500 text-xs mt-1">
                          +{followedUsers.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <Link to="/field-edit" className="text-gray-300 text-sm font-medium">Field</Link>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600/30 text-purple-400 text-xs font-medium px-2 py-1 rounded-full">
                      {selectedField || "Not set"}
                    </span>
                    
                  </div>
                </div>

                <div className="flex justify-between">
                  <Link to="/resume-edit" className="text-white ">Edit Your information</Link>
                  <span className="text-blue-500 text-2xl">
                  <FaUserEdit />
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-1 pt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Modal */}
        {showSignOutConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-2xl border border-gray-700 animate-scaleIn">
              <h3 className="text-xl font-semibold text-white mb-4">Sign Out</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to sign out of your account?
              </p>
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

        {/* Content Container */}
        <div className="flex-1 flex flex-col">
          {/* Header Section - Fixed positioning */}
          <div className="text-center py-20 px-4">
            <div className="relative">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-5xl md:text-6xl font-bold">
                  Developer Suggestions
                </h1>
                
              </div>
              <h2 className="text-white text-3xl md:text-4xl font-light mb-2">
                For You
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-8"></div>
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 backdrop-blur-sm">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Enhanced Developer Cards */}
          <div className="flex-1 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
              {fieldData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {fieldData.map((user, index) => (
                    <div
                      key={user._id}
                      className="group relative"
                      style={{
                        animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      {/* Main card */}
                      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">

                        {/* Top decoration */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl"></div>

                        {/* Profile section */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getFieldColor(user.selectedField)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <div>
                              <h3 className="text-white text-lg font-semibold truncate max-w-[120px]">
                                {user.username}
                              </h3>
                              <p className="text-gray-400 text-sm">Developer</p>
                              <p className="text-gray-400 text-xs mt-2 italic border-l-4 border-blue-500 pl-3 bg-gray-900/40 rounded-md">
                                {userBios[user._id!] ? userBios[user._id!] : "No bio available."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Field badge */}
                        <div className="flex justify-between">
                          <div className="mb-4">
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getFieldColor(user.selectedField)} shadow-lg`}>
                              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                              {user.selectedField.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                            </div>
                          </div>

                          <div className="">
                            <Link to={`/userinfo/${user._id}`} className=" underline text-blue-700">Userinfo</Link>
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="mt-6">
                          <FollowButton
                            UserIdtoFollow={user._id!}
                            username={user.username}
                            selectedField={user.selectedField}
                          />
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !error && (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-700/50">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-lg text-center mb-2">
                    No suggestions available at the moment
                  </p>
                  <p className="text-gray-500 text-center">
                    Check back later for new developer connections!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}

export default UserProf;