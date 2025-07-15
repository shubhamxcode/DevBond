import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { setselectedfield } from "../Slices/userslice";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { Particles } from "../magicui/particles";
import { motion } from "framer-motion";

const apiUrl = import.meta.env.DEV
  ? "http://localhost:4001"
  : import.meta.env.VITE_RENDER_URL_;

const Field = () => {
  const [error, setError] = useState("");
  const userId = useSelector((state: RootState) => state.userProfile.userId);
  const techField = useSelector((state: RootState) => state.userProfile.Techfield);
  console.log(`there is a techfield yehhh:`,techField);
  
  const dispatch = useDispatch();

  // Helper to get description for each field
  const getFieldDescription = (field: string) => {
    switch (field.toLowerCase()) {
      case "frontend":
        return "Build beautiful, interactive UIs";
      case "backend":
        return "Power APIs and logic behind the scenes";
      case "fullstack":
        return "Master both client and server";
      default:
        return `Explore the world of ${field}`;
    }
  };

  // Helper to get gradient for each field
  const getFieldGradient = (field: string) => {
    switch (field.toLowerCase()) {
      case "frontend":
        return "from-pink-500 via-red-500 to-yellow-500";
      case "backend":
        return "from-purple-500 via-blue-500 to-indigo-500";
      case "fullstack":
        return "from-green-400 via-blue-500 to-purple-600";
      default:
        return "from-gray-400 via-gray-500 to-gray-600";
    }
  };

  // Normalize techField to an array
  const techFieldsArray = techField
    ? Array.isArray(techField)
      ? techField
      : [techField]
    : [];

  // Helper to display only the first two words of a field
  const getFirstTwoWords = (field: string) => {
    return field.split(' ').slice(0, 2).join(' ');
  };

  const handleFieldClick = async (selectedField: string) => {
    if (!userId) {
      setError("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/users/update-field`, {
        userId,
        selectedField,
      });
      console.log("Field update response:", response.data);
      dispatch(setselectedfield(selectedField));
    } catch (err) {
      console.error("Field selection error:", err);
      setError("Error saving field selection");
    }
  };

  return (
    <section className="min-h-screen flex items-center bg-black/80 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeamsWithCollision className="h-full w-full absolute inset-0 bg-black/60">
          <Particles
            quantity={120}
            className="absolute inset-0 w-full h-full"
            color="#a5b4fc"
          />
        </BackgroundBeamsWithCollision>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white text-center drop-shadow-lg mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Choose Your Tech Arena 🧠
        </motion.h1>

        <div className="flex flex-wrap justify-center gap-10">
          {techFieldsArray.map((field, idx) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2 + idx * 0.15,
                ease: "easeOut",
              }}
            >
              <Link
                to="/profile"
                onClick={() => handleFieldClick(field)}
                className={`group block w-60 md:w-72 px-6 py-10 text-center rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md transition-all hover:scale-105 hover:border-white/60 shadow-xl hover:shadow-${field.toLowerCase()}/30`}
              >
                <div
                  className={`bg-gradient-to-br ${getFieldGradient(field)} text-transparent bg-clip-text text-4xl font-extrabold mb-4 transition-all group-hover:scale-110`}
                >
                  {getFirstTwoWords(field)}
                </div>
                <p className="text-sm text-gray-400 font-light">
                  {getFieldDescription(field)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {error && (
          <motion.p
            className="text-red-500 mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Field;
