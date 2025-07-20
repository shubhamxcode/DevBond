import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { setselectedfield } from '../Slices/userslice';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Particles } from '../magicui/particles';
import { 
  Briefcase, 
  Save, 
  ArrowLeft,
  Loader2,
  CheckCircle
} from 'lucide-react';

const FieldEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
  const userId = useSelector((state: RootState) => state.userProfile.userId);
  const currentField = useSelector((state: RootState) => state.userProfile.selectedField);
  
  const [selectedField, setSelectedField] = useState(currentField || '');
  const [customField, setCustomField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fieldOptions = [
    'Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data Science', 'AI/ML', 'UI/UX', 'Cloud', 'Security', 'Other'
  ];

  const apiUrl = import.meta.env.DEV ? "http://localhost:4001" : import.meta.env.VITE_RENDER_URL_;

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
  }, [accessToken, navigate]);

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

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${apiUrl}/api/users/update-field`, {
        userId,
        selectedField: fieldToSet,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      console.log(response)
      dispatch(setselectedfield(fieldToSet));
      setSuccess("Field updated successfully!");
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error: any) {
      setError(error.response?.data?.message || "Error updating field");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-black/80 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          quantity={500}
          className="absolute inset-0 w-full h-full"
          color="#a5b4fc"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Field</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-6 mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400">{success}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="mx-6 mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 p-6">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Update Your Field</h2>
                <p className="text-gray-400 text-sm">
                  Choose the field that best represents your expertise
                </p>
              </div>

              <form onSubmit={handleFieldSubmit} className="space-y-6">
                {/* Current Field Display */}
                {currentField && (
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                    <p className="text-gray-300 text-sm mb-2">Current Field:</p>
                    <p className="text-white font-medium">{currentField}</p>
                  </div>
                )}

                {/* Field Selection */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Select Your Field
                  </label>
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">-- Choose a field --</option>
                    {fieldOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Field Input */}
                {selectedField === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      Specify Your Field
                    </label>
                    <input
                      type="text"
                      value={customField}
                      onChange={(e) => setCustomField(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g., Blockchain, Game Development, etc."
                      required={selectedField === 'Other'}
                    />
                  </motion.div>
                )}

                {/* Field Description */}
                {selectedField && selectedField !== 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
                  >
                    <h3 className="text-blue-400 font-medium mb-2">{selectedField} Developer</h3>
                    <p className="text-gray-300 text-sm">
                      {selectedField === 'Frontend' && 'Specializes in user interface development using HTML, CSS, JavaScript, and modern frameworks like React, Vue, or Angular.'}
                      {selectedField === 'Backend' && 'Focuses on server-side development, APIs, databases, and business logic using languages like Python, Java, Node.js, or PHP.'}
                      {selectedField === 'Full Stack' && 'Handles both frontend and backend development, capable of building complete web applications from database to user interface.'}
                      {selectedField === 'Mobile' && 'Develops applications for iOS and Android platforms using native languages or cross-platform frameworks like React Native or Flutter.'}
                      {selectedField === 'DevOps' && 'Manages infrastructure, deployment, and automation using tools like Docker, Kubernetes, AWS, and CI/CD pipelines.'}
                      {selectedField === 'Data Science' && 'Analyzes and interprets complex data sets using statistical methods, machine learning, and data visualization tools.'}
                      {selectedField === 'AI/ML' && 'Develops artificial intelligence and machine learning models using Python, TensorFlow, PyTorch, and other AI frameworks.'}
                      {selectedField === 'UI/UX' && 'Designs user interfaces and experiences, focusing on usability, accessibility, and user-centered design principles.'}
                      {selectedField === 'Cloud' && 'Specializes in cloud computing platforms like AWS, Azure, or Google Cloud, managing scalable infrastructure and services.'}
                      {selectedField === 'Security' && 'Focuses on cybersecurity, implementing secure coding practices, vulnerability assessment, and threat prevention.'}
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !selectedField || (selectedField === 'Other' && !customField)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Field
                    </>
                  )}
                </button>
              </form>

              {/* Cancel Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/profile')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FieldEdit; 