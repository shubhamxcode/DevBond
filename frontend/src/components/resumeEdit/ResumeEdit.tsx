import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/store';
import { setResumeInfo } from '../Slices/userslice';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Particles } from '../magicui/particles';
import { 
  User, 
  FileText, 
  Code, 
  Globe, 
  Save, 
  ArrowLeft,
  Loader2,
  
} from 'lucide-react';

const ResumeEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
  const resumeInfo = useSelector((state: RootState) => state.userProfile.resumeInfo);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [resumeData, setResumeData] = useState({
    bio: '',
    projectLinks: [] as string[],
    extractedInfo: {
      personalInfo: {} as any,
      summary: '',
      skills: { technical: [] as string[], soft: [] as string[], languages: [] as string[] },
      experience: [] as any[],
      education: [] as any[],
      certifications: [] as any[],
      projects: [] as any[]
    }
  });

  const apiUrl = import.meta.env.DEV ? "http://localhost:4001" : import.meta.env.VITE_RENDER_URL_;

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    if (resumeInfo) {
      setResumeData({
        bio: resumeInfo.bio || '',
        projectLinks: resumeInfo.projectLinks || [],
        extractedInfo: resumeInfo.extractedInfo || {
          personalInfo: {},
          summary: '',
          skills: { technical: [], soft: [], languages: [] },
          experience: [],
          education: [],
          certifications: [],
          projects: []
        }
      });
    }
  }, [accessToken, navigate, resumeInfo]);

  const handleSave = async () => {
    if (!accessToken) {
      setError('Please login to save changes');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${apiUrl}/api/users/save-resume`, {
        parsedData: {
          fileName: resumeInfo?.fileName || 'resume.pdf',
          fileSize: resumeInfo?.fileSize || 0,
          pageCount: resumeInfo?.pageCount || 1,
          fullText: resumeInfo?.fullText || '',
          extractedInfo: resumeData.extractedInfo,
          metadata: resumeInfo?.metadata || {}
        },
        bio: resumeData.bio,
        projectLinks: resumeData.projectLinks
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      dispatch(setResumeInfo(response.data.data));
      setSuccess('Resume updated successfully!');
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update resume');
    } finally {
      setIsLoading(false);
    }
  };

  if (!resumeInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No resume information available.</p>
          <button 
            onClick={() => navigate('/Resumeparsing')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black/80 relative overflow-hidden px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          quantity={500}
          className="absolute inset-0 w-full h-full"
          color="#a5b4fc"
        />
      </div>
      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col px-2 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 gap-2 sm:gap-0">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Edit Resume</h1>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
        {/* Success/Error Messages */}
        {success && (
          <div className="mx-2 sm:mx-6 mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-400">{success}</p>
          </div>
        )}
        {error && (
          <div className="mx-2 sm:mx-6 mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {/* Form Content */}
        <div className="flex-1 p-2 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto space-y-8">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Bio
              </h2>
              <textarea
                value={resumeData.bio}
                onChange={(e) => setResumeData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            </motion.div>
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={resumeData.extractedInfo.personalInfo.name || ''}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      extractedInfo: {
                        ...prev.extractedInfo,
                        personalInfo: {
                          ...prev.extractedInfo.personalInfo,
                          name: e.target.value
                        }
                      }
                    }))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={resumeData.extractedInfo.personalInfo.email || ''}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      extractedInfo: {
                        ...prev.extractedInfo,
                        personalInfo: {
                          ...prev.extractedInfo.personalInfo,
                          email: e.target.value
                        }
                      }
                    }))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={resumeData.extractedInfo.personalInfo.location || ''}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      extractedInfo: {
                        ...prev.extractedInfo,
                        personalInfo: {
                          ...prev.extractedInfo.personalInfo,
                          location: e.target.value
                        }
                      }
                    }))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">GitHub</label>
                  <input
                    type="url"
                    value={resumeData.extractedInfo.personalInfo.github || ''}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      extractedInfo: {
                        ...prev.extractedInfo,
                        personalInfo: {
                          ...prev.extractedInfo.personalInfo,
                          github: e.target.value
                        }
                      }
                    }))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={resumeData.extractedInfo.personalInfo.linkedin || ''}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      extractedInfo: {
                        ...prev.extractedInfo,
                        personalInfo: {
                          ...prev.extractedInfo.personalInfo,
                          linkedin: e.target.value
                        }
                      }
                    }))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Twitter</label>
                  <input
                    type="url"
                    value={resumeData.extractedInfo.personalInfo.twitter || ''}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      extractedInfo: {
                        ...prev.extractedInfo,
                        personalInfo: {
                          ...prev.extractedInfo.personalInfo,
                          twitter: e.target.value
                        }
                      }
                    }))}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Skills
              </h2>
              
              {/* Technical Skills */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm font-medium mb-3 block">Technical Skills</label>
                <textarea
                  value={resumeData.extractedInfo.skills.technical.join(', ')}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    extractedInfo: {
                      ...prev.extractedInfo,
                      skills: {
                        ...prev.extractedInfo.skills,
                        technical: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                      }
                    }
                  }))}
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="JavaScript, React, Node.js, Python, etc."
                />
              </div>

              {/* Soft Skills */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm font-medium mb-3 block">Soft Skills</label>
                <textarea
                  value={resumeData.extractedInfo.skills.soft.join(', ')}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    extractedInfo: {
                      ...prev.extractedInfo,
                      skills: {
                        ...prev.extractedInfo.skills,
                        soft: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                      }
                    }
                  }))}
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Leadership, Communication, Problem Solving, etc."
                />
              </div>

              {/* Languages */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-3 block">Languages</label>
                <textarea
                  value={resumeData.extractedInfo.skills.languages.join(', ')}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    extractedInfo: {
                      ...prev.extractedInfo,
                      skills: {
                        ...prev.extractedInfo.skills,
                        languages: e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang)
                      }
                    }
                  }))}
                  rows={2}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="English, Spanish, French, etc."
                />
              </div>
            </motion.div>

            {/* Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Projects
              </h2>
              <div className="space-y-4">
                {resumeData.extractedInfo.projects.map((project, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Project Name</label>
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => {
                            const updatedProjects = [...resumeData.extractedInfo.projects];
                            updatedProjects[index] = { ...project, name: e.target.value };
                            setResumeData(prev => ({
                              ...prev,
                              extractedInfo: {
                                ...prev.extractedInfo,
                                projects: updatedProjects
                              }
                            }));
                          }}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Project Link</label>
                        <input
                          type="url"
                          value={project.link || ''}
                          onChange={(e) => {
                            const updatedProjects = [...resumeData.extractedInfo.projects];
                            updatedProjects[index] = { ...project, link: e.target.value };
                            setResumeData(prev => ({
                              ...prev,
                              extractedInfo: {
                                ...prev.extractedInfo,
                                projects: updatedProjects
                              }
                            }));
                          }}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                          placeholder="https://github.com/yourproject"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-gray-300 text-sm mb-2">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const updatedProjects = [...resumeData.extractedInfo.projects];
                          updatedProjects[index] = { ...project, description: e.target.value };
                          setResumeData(prev => ({
                            ...prev,
                            extractedInfo: {
                              ...prev.extractedInfo,
                              projects: updatedProjects
                            }
                          }));
                        }}
                        rows={3}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeEdit; 