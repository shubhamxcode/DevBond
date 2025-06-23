import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Link } from "react-router-dom";

function Connection() {
  const followerData = useSelector(
    (state: RootState) => state.userProfile.followedUsers
  );
  console.log(`Folllower data is here shubhamji`,followerData);
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Connections</h2>

      {followerData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followerData.map((data, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300"
            >
              <div className="bg-gray-900 p-4 flex items-center gap-4 rounded-lg shadow-md">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white font-bold text-lg rounded-full">
                  {data.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-white text-lg font-semibold">
                  {data.username}

                  
                </h3>
              </div>

              <div className="p-4 pt-2">
                <Link 
                  to={`/developer/${data.userId}`}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 block text-center"
                >
                  Chat with {data.username}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-white mb-2">
            No connections yet
          </h3>
          <p className="text-gray-400 mb-6">
            You haven't followed any users yet.
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200">
            Find People to Follow
          </button>
        </div>
      )}
    </div>
  );
}

export default Connection;
