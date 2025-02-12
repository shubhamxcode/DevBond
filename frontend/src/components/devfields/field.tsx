import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { setUser, setSuggestions } from '../Slices/userslice';

function Field() {
  const [error, setError] = useState("");
  const userId = useSelector((state: RootState) => state.userProfile.userId);
  const dispatch = useDispatch();

  const handleFieldClick = async (selectedField: string) => {
    try {
      await axios.post("/api/users/update-field", { userId, selectedField });
      dispatch(setUser({ selectedField }));

      const response = await axios.get(`/api/users/users-by-field?selectedField=${selectedField}`);
      dispatch(setSuggestions(response.data));
    } catch (err) {
      setError("Error saving field selection");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 bg-gradient-to-r from-gray-900 via-black to-gray-900 min-h-screen py-10 px-4">
      <h1 className="text-6xl font-extrabold text-white text-center">
        Select Your Field to Meet Your Developer
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        <Link
          to="/profile"
          onClick={() => handleFieldClick("Frontend")}
          className="transition-all duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105 border-2 border-transparent rounded-xl text-4xl font-semibold text-white text-center p-14 hover:cursor-pointer hover:border-green-400 shadow-md"
        >
          <h1>Frontend</h1>
        </Link>
        <Link
          to="/profile"
          onClick={() => handleFieldClick("Backend")}
          className="transition-all duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105 border-2 border-transparent rounded-xl text-4xl font-semibold text-white text-center p-14 hover:cursor-pointer hover:border-green-400 shadow-md"
        >
          <h1>Backend</h1>
        </Link>
        <Link
          to="/profile"
          onClick={() => handleFieldClick("Fullstack")}
          className="transition-all duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105 border-2 border-transparent rounded-xl text-4xl font-semibold text-white text-center p-14 hover:cursor-pointer hover:border-green-400 shadow-md"
        >
          <h1>Fullstack</h1>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Field;