import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Link } from "react-router-dom";

function Connection() {
  const followerData = useSelector(
    (state: RootState) => state.userProfile.followedUsers
  );
  
  console.log(`Folllower data is here shubhamji`, followerData);

  // Helper function to get field color
  const getFieldColor = (field: string) => {
    const colors = {
      'Frontend': 'from-blue-500 to-cyan-500',
      'Backend': 'from-green-500 to-emerald-500',
      'Full Stack': 'from-purple-500 to-pink-500',
      'Mobile': 'from-orange-500 to-red-500',
      'DevOps': 'from-indigo-500 to-blue-500',
      'Data Science': 'from-teal-500 to-green-500',
      'AI/ML': 'from-violet-500 to-purple-500',
      'UI/UX': 'from-pink-500 to-rose-500',
      'Cloud': 'from-sky-500 to-blue-500',
      'Security': 'from-red-500 to-orange-500',
      'default': 'from-gray-500 to-gray-600'
    };
    return colors[field as keyof typeof colors] || colors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.2)_50%,transparent_75%,transparent_100%)]"></div>
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 pt-8">
          <div className="relative">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-4xl md:text-5xl font-bold mb-4">
              Your Connections
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Build meaningful relationships with fellow developers
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Connection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Connections</p>
                <p className="text-white text-2xl font-bold">{followerData.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.916-.75M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.916-.75M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
        
        </div>

        {/* Connections Grid */}
        {followerData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {followerData.map((data, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Animated border glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 overflow-hidden">
                  
                  {/* Top decoration */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                  
                  {/* Profile Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getFieldColor(data.selectedField)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                          {data.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-semibold truncate">
                          {data.username}
                        </h3>
                        <p className="text-gray-400 text-sm">Developer</p>
                      </div>
                    </div>
                    
                    {/* Field Badge */}
                    {data.selectedField && (
                      <div className="mb-4">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getFieldColor(data.selectedField)} shadow-lg`}>
                          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                          {data.selectedField}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="px-6 pb-6 space-y-3">
                    <Link
                      to={`/developer/${data.userId}`}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 block text-center transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat with {data.username}
                      </div>
                    </Link>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl backdrop-blur-sm border border-gray-700/50 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No connections yet
            </h3>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Start building your professional network by connecting with fellow developers who share your interests and expertise.
            </p>
            <Link
              to="/userprof"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-8 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find People to Follow
              </div>
            </Link>
          </div>
        )}
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
      `}</style>
    </div>
  );
}

export default Connection;