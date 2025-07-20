import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { setselectedfield } from "../Slices/userslice";
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { Particles } from "../magicui/particles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.DEV
  ? "http://localhost:4001"
  : import.meta.env.VITE_RENDER_URL_;

const Field = () => {
  const [error, setError] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [customField, setCustomField] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const userId = useSelector((state: RootState) => state.userProfile.userId);
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fieldOptions = [
    'Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data Science', 'AI/ML', 'UI/UX', 'Cloud', 'Security', 'Other'
  ];

  // Check if user has already completed setup
  useEffect(() => {
    const checkUserSetup = async () => {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/users/check-setup`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        const { hasResume, isSetupComplete } = response.data.data;

        if (isSetupComplete) {
          // User has both resume and field selected, redirect to profile
          navigate('/profile');
        } else if (!hasResume) {
          // User has no resume, redirect to resume parsing
          navigate('/Resumeparsing');
        }
        // If user has resume but no field, stay on this page
      } catch (error) {
        console.error('Error checking user setup:', error);
        // Continue with field selection if check fails
      }
    };

    checkUserSetup();
  }, [accessToken, navigate, apiUrl]);

  const handleFieldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID is missing. Please log in again.");
      return;
    }
    let fieldToSet = selectedField === 'Other' ? customField : selectedField;
    if (!fieldToSet) {
      setError("Please select or enter a field.");
      return;
    }
    setIsUpdating(true);
    try {
      const response = await axios.post(`${apiUrl}/api/users/update-field`, {
        userId,
        selectedField: fieldToSet,
      });
      dispatch(setselectedfield(fieldToSet));
      setError("");
      console.log(response);
      
      window.location.href = "/profile";
    } catch (err) {
      setError("Error saving field selection");
    } finally {
      setIsUpdating(false);
    }
  };
  
  
  return (
    <section className="min-h-screen flex items-center bg-black/80 relative overflow-hidden px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
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
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen px-2 sm:px-4">
        <motion.h1
          className="text-2xl sm:text-5xl md:text-6xl font-extrabold text-white text-center drop-shadow-lg mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Choose Your Tech Arena 🧠
        </motion.h1>
        {/* New Field Selection UI */}
        <form onSubmit={handleFieldSubmit} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-8 w-full max-w-md border border-white/20 shadow-xl flex flex-col gap-4 items-center">
          <label className="text-white text-base sm:text-lg font-medium mb-2">Select your field:</label>
          <select
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2"
            value={selectedField}
            onChange={e => setSelectedField(e.target.value)}
            required
          >
            <option value="">-- Choose --</option>
            {fieldOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {selectedField === 'Other' && (
            <input
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2"
              type="text"
              placeholder="Enter your field"
              value={customField}
              onChange={e => setCustomField(e.target.value)}
              required
            />
          )}
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full"
            disabled={isUpdating || (!selectedField || (selectedField === 'Other' && !customField))}
          >
            {isUpdating ? 'Saving...' : 'Save Field'}
          </button>
        </form>
        {error && (
          <motion.p
            className="text-red-500 mt-6 sm:mt-10 text-center"
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
