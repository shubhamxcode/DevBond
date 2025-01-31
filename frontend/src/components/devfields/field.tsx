import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
function Field() {
  const [selectedField, setSelectedField] = useState("");

  const handleFieldSelect = async (field: string) => {
    setSelectedField(field);
    const userId = "";
    try {
      await axios.post("/api/users/update-field", {
        userId,
        selectedField: field,
      });
      console.log("Field updated successfully");
    } catch (error) {
      console.error("Error updating field:", error);
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
          onClick={() => handleFieldSelect("Frontend")}
          className="transition-all duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105 border-2 border-transparent rounded-xl text-4xl font-semibold text-white text-center p-14 hover:cursor-pointer hover:border-green-400 shadow-md"
        >
          <h1>Frontend</h1>
        </Link>
        <Link
          to="/profile"
          onClick={() => handleFieldSelect("Backend")}
          className="transition-all duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105 border-2 border-transparent rounded-xl text-4xl font-semibold text-white text-center p-14 hover:cursor-pointer hover:border-green-400 shadow-md"
        >
          <h1>Backend</h1>
        </Link>
        <Link
          to="/profile"
          onClick={() => handleFieldSelect("Fullstack")}
          className="transition-all duration-300 ease-in-out transform hover:bg-green-600 hover:scale-105 border-2 border-transparent rounded-xl text-4xl font-semibold text-white text-center p-14 hover:cursor-pointer hover:border-green-400 shadow-md"
        >
          <h1>Fullstack</h1>
        </Link>
      </div>
      {selectedField && (
        <p className="text-2xl text-white">You selected: {selectedField}</p>
      )}
    </div>
  );
}

export default Field;
