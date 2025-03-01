// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { RootState } from "../../Redux/store";
// import { User } from "../../types"; // Import the User interface

// const Suggestions = () => {
//     const selectedField = useSelector((state: RootState) => state.userProfile.selectedField);
//     const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
//     const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]); // Specify the type
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchSuggestedUsers = async () => {
//             if (selectedField && accessToken) {
//                 try {
//                     const response = await axios.get<User[]>(`/api/users/users-by-field?selectedField=${selectedField}`, {
//                         headers: { Authorization: `Bearer ${accessToken}` }
//                     });
//                     setSuggestedUsers(response.data);
//                     setError(null);
//                 } catch (error) {
//                     console.error("Error fetching suggested users:", error);
//                     setError("Failed to fetch suggested users.");
//                 }
//             }
//         };

//         fetchSuggestedUsers();
//     }, [selectedField, accessToken]);

//     return (
//         <div className="suggestions-container">
//             <h2 className="text-2xl font-bold text-white">Suggested Users for {selectedField}</h2>
//             {error && <p className="text-red-500">{error}</p>}
//             <div className="user-list">
//                 {suggestedUsers.length > 0 ? (
//                     suggestedUsers.map((user: User) => (
//                         <div key={user.userId} className="user-card">
//                             <h3 className="text-lg font-semibold">{user.username}</h3>
//                             <p className="text-gray-400">{user.selectedField}</p>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-gray-300">No suggestions available at the moment.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Suggestions;