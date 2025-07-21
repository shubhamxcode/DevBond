import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, User, Briefcase, GraduationCap, Award, Code, Sparkles, Zap, Target, Linkedin, Github, Globe, Twitter } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Particles } from '../magicui/particles';
import { Techdata, setResumeInfo } from '../Slices/userslice';

interface PersonalInfo {
  name?: string;
  email?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
  achievements: string[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  link?: string;
}

interface ExtractedInfo {
  personalInfo: PersonalInfo;
  summary: string;
  skills: Skills;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  techField?: string; // Add techField to the interface
  techSubField?: string; // Add techSubField to the interface
}

interface Metadata {
  hasAIParsing: boolean;
  skillsCount: number;
  experienceCount: number;
  educationCount: number;
}

interface ParsedResumeData {
  fullText: string;
  pageCount: number;
  fileSize: number;
  fileName: string;
  extractedInfo: ExtractedInfo;
  metadata: Metadata;
}

const normalizeLinkedin = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://linkedin.com/in/${url.replace(/^linkedin[./]*/i, '')}`;
};

const normalizeGithub = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://github.com/${url.replace(/^github[./]*/i, '')}`;
};

const ResumeParserUI: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add state for bio and project links
  const [bio, setBio] = useState('');
  const [projectLinks, setProjectLinks] = useState<string[]>([]);
  const [bioError, setBioError] = useState('');
  const [projectLinksError, setProjectLinksError] = useState<string[]>([]);

  const apiUrl = import.meta.env.DEV ? "http://localhost:4001" : import.meta.env.VITE_RENDER_URL_;
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
  const navigate = useNavigate();
  const dispatch=useDispatch()

  // Update projectLinks state when parsedData changes
  useEffect(() => {
    if (parsedData && parsedData.extractedInfo.projects) {
      setProjectLinks(parsedData.extractedInfo.projects.map(p => p.link || ''));
      setProjectLinksError(parsedData.extractedInfo.projects.map(() => ''));
    }
  }, [parsedData]);

  // Check authentication on component mount
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  // Check if user has already completed setup
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

        if (isSetupComplete) {
          // User has both resume and field selected, redirect to profile
          navigate('/profile');
        } else if (hasResume && !hasSelectedField) {
          // User has resume but no field selected, redirect to field selection
          navigate('/field');
        }
        // If user has no resume, stay on this page
      } catch (error) {
        console.error('Error checking user setup:', error);
        // Continue with resume parsing if check fails
      }
    };

    checkUserSetup();
  }, [accessToken, navigate, apiUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleParseResume = async () => {
    if (!file) return;
    if (!accessToken) {
      setError('Please login to parse resumes');
      return;
    }

    setParsing(true);
    setProgress(0);
    setError(null);

    let progressInterval: NodeJS.Timeout | undefined;

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('resume', file);

      // Simulate progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >=90) {
            if (progressInterval) {
              clearInterval(progressInterval);
            }
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload and parse resume
      const response = await axios.post(`${apiUrl}/api/users/parse-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
      
    );
    console.log(`response of file data:`,response);
    

      clearInterval(progressInterval);
      setProgress(100);

      // Set parsed data
      setParsedData(response.data.data);
      
      // Reset file after successful parsing
      setTimeout(() => {
        setFile(null);
        setParsing(false);
        setProgress(0);
      }, 1000);

    } catch (error: any) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setProgress(0);
      setParsing(false);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to parse resume. Please try again.');
      }
    }
  };

  const resetState = () => {
    setFile(null);
    setParsing(false);
    setProgress(0);
    setParsedData(null);
    setError(null);
    setSaving(false);
  };

  const handleSaveData = async () => {
    if (!parsedData) return;
    if (!accessToken) {
      setError('Please login to save resume data');
      return;
    }
    let valid = true;
    if (!bio.trim()) {
      setBioError('Bio is required');
      valid = false;
    } else {
      setBioError('');
    }
    const newProjectLinksError = projectLinks.map((link) => {
      if (!link.trim()) {
        valid = false;
        return 'Project link is required';
      }
      // Optionally, validate URL format here
      return '';
    });
    setProjectLinksError(newProjectLinksError);
    if (!valid) return;
    setSaving(true);
    setError(null);

    try {
      const response = await axios.post(`${apiUrl}/api/users/save-resume`, {
        parsedData: parsedData,
        bio,
        projectLinks
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      // Show success message (UI, not alert)
      setSuccessMessage('🎉 Resume data saved successfully! You can edit your resume on your profile.');
      // Save techSubField to Redux for filtering cards by subfield
      dispatch(Techdata(response.data.data.extractedInfo.personalInfo.techSubField))
      // Update resumeInfo in Redux
      dispatch(setResumeInfo(response.data.data));
      // Navigate to field page after 4 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        navigate('/field');
      }, 4000);
      // Reset state after successful save
      resetState();

    } catch (error: any) {
      setSaving(false);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to save resume data. Please try again.');
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center bg-black/80 relative overflow-hidden px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles quantity={500} className="absolute inset-0 w-full h-full" color="#a5b4fc" />
      </div>
      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-2 sm:mr-4 shadow-lg">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-transparent bg-gradient-to-b from-white via-gray-300 to-gray-600 bg-clip-text drop-shadow-2xl">
                Resume Parser
              </h1>
            </div>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and let our AI extract key information to showcase your skills and experience
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 sm:mt-6 rounded-full"></div>
          </motion.div>
          {/* Main Container */}
          <motion.div 
            className="rounded-2xl border border-gray-700/50 bg-black/50 backdrop-blur-xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {successMessage && (
                <motion.div
                  key="success"
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-green-900/50 border border-green-700/50 rounded-2xl p-8 mb-6 backdrop-blur-sm">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
                    <h3 className="text-xl font-semibold text-green-200 mb-2">Success</h3>
                    <p className="text-green-300">{successMessage}</p>
                  </div>
                </motion.div>
              )}
              {!file && !parsing && !parsedData && (
                <motion.div
                  key="upload"
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="border-2 border-dashed border-gray-600/50 rounded-2xl p-16 hover:border-blue-400/60 hover:bg-gray-900/30 transition-all duration-300 group">
                    <motion.div
                      className="mb-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                        <Upload className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      </div>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">Upload your resume</h3>
                    <p className="text-gray-400 mb-8 text-lg">Drag and drop your PDF here, or click to browse</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="upload"
                    />
                    <motion.label 
                      htmlFor="upload" 
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose PDF File
                    </motion.label>
                  </div>
                  
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-red-900/50 border border-red-700/50 rounded-2xl p-8 mb-6 backdrop-blur-sm">
                    <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-red-200 mb-2">Error</h3>
                    <p className="text-red-300">{error}</p>
                  </div>
                  <motion.button
                    onClick={resetState}
                    className="w-full bg-gray-800/50 text-gray-200 py-4 px-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try Again
                  </motion.button>
                </motion.div>
              )}

              {file && !parsing && !error && (
                <motion.div
                  key="file-selected"
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-green-900/50 border border-green-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
                    <FileText className="mx-auto h-16 w-16 text-green-400 mb-4" />
                    <h3 className="text-xl font-semibold text-green-200 mb-2">{file.name}</h3>
                    <p className="text-green-300">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="space-y-4">
                    <motion.button
                      onClick={handleParseResume}
                      className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="h-5 w-5 mr-2 inline" />
                      Parse Resume
                    </motion.button>
                    <motion.button
                      onClick={() => setFile(null)}
                      className="w-full bg-gray-800/50 text-gray-200 py-3 px-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Choose Different File
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {parsing && (
                <motion.div
                  key="parsing"
                  className="space-y-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-10 w-10 text-blue-400" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-3">Parsing Your Resume</h3>
                    <p className="text-gray-300 text-lg">AI is analyzing your document...</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Parsing Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <motion.div 
                      className="w-3 h-3 bg-blue-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-3 h-3 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-3 h-3 bg-pink-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}

              

              {parsedData && parsedData.extractedInfo && (
                <motion.div
                  key="parsed-data"
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-green-900/50 border border-green-700/50 rounded-2xl p-8 text-center backdrop-blur-sm">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
                    <h3 className="text-2xl font-semibold text-green-200 mb-2">Resume Parsed Successfully!</h3>
                    <p className="text-green-300 text-lg">
                      Pages: {parsedData.pageCount} | Size: {(parsedData.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {parsedData.metadata.hasAIParsing && (
                      <div className="flex items-center justify-center mt-3">
                        <Sparkles className="h-5 w-5 text-green-400 mr-2" />
                        <span className="text-sm text-green-400 font-medium">AI-Enhanced Parsing Applied</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Personal Information */}
                  {parsedData.extractedInfo.personalInfo.name && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Personal Information</h4>
                      </div>
                      <div className="text-gray-300 space-y-2">
                        {parsedData.extractedInfo.personalInfo.name && (
                          <p><span className="font-medium text-blue-300">Name:</span> {parsedData.extractedInfo.personalInfo.name}</p>
                        )}
                        {parsedData.extractedInfo.personalInfo.email && (
                          <p><span className="font-medium text-blue-300">Email:</span> {parsedData.extractedInfo.personalInfo.email}</p>
                        )}
                        {parsedData.extractedInfo.personalInfo.location && (
                          <p><span className="font-medium text-blue-300">Location:</span> {parsedData.extractedInfo.personalInfo.location}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Summary */}
                  {parsedData.extractedInfo.summary && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-xl font-semibold text-white mb-3">Professional Summary</h4>
                      <p className="text-gray-300 leading-relaxed">{parsedData.extractedInfo.summary}</p>
                    </motion.div>
                  )}

                  {/* Skills */}
                  {((parsedData.extractedInfo.skills?.technical?.length > 0) || 
                    (parsedData.extractedInfo.skills?.soft?.length > 0) || 
                    (parsedData.extractedInfo.skills?.languages?.length > 0)) && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mr-3">
                          <Code className="h-5 w-5 text-green-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Skills</h4>
                      </div>
                      <div className="space-y-4">
                        {parsedData.extractedInfo.skills?.technical && Array.isArray(parsedData.extractedInfo.skills.technical) && parsedData.extractedInfo.skills.technical.length > 0 && (
                          <div>
                            <p className="font-medium text-blue-300 mb-2">Technical Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {parsedData.extractedInfo.skills.technical.map((skill, index) => (
                                <motion.span 
                                  key={index} 
                                  className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-700/50"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.4 + index * 0.05 }}
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                        {parsedData.extractedInfo.skills?.soft && Array.isArray(parsedData.extractedInfo.skills.soft) && parsedData.extractedInfo.skills.soft.length > 0 && (
                          <div>
                            <p className="font-medium text-green-300 mb-2">Soft Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {parsedData.extractedInfo.skills.soft.map((skill, index) => (
                                <motion.span 
                                  key={index} 
                                  className="bg-green-900/50 text-green-200 px-3 py-1 rounded-full text-sm border border-green-700/50"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.5 + index * 0.05 }}
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                        {parsedData.extractedInfo.skills?.languages && Array.isArray(parsedData.extractedInfo.skills.languages) && parsedData.extractedInfo.skills.languages.length > 0 && (
                          <div>
                            <p className="font-medium text-purple-300 mb-2">Languages:</p>
                            <div className="flex flex-wrap gap-2">
                              {parsedData.extractedInfo.skills.languages.map((skill, index) => (
                                <motion.span 
                                  key={index} 
                                  className="bg-purple-900/50 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-700/50"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.6 + index * 0.05 }}
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Experience */}
                  {parsedData.extractedInfo.experience?.length > 0 && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center mr-3">
                          <Briefcase className="h-5 w-5 text-yellow-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Experience</h4>
                      </div>
                      <div className="space-y-6">
                        {parsedData.extractedInfo.experience?.map((exp, index) => (
                          <motion.div 
                            key={index} 
                            className="border-l-2 border-yellow-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <p className="font-semibold text-white text-lg">{exp.title}</p>
                            <p className="text-yellow-300 font-medium">{exp.company}</p>
                            <p className="text-gray-400 text-sm mb-2">{exp.duration}</p>
                            <p className="text-gray-300 leading-relaxed mb-3">{exp.description}</p>
                            {exp.achievements?.length > 0 && (
                              <ul className="space-y-1">
                                {exp.achievements?.map((achievement, idx) => (
                                  <li key={idx} className="text-sm text-gray-400 flex items-start">
                                    <span className="text-yellow-400 mr-2 mt-1">•</span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Education */}
                  {parsedData.extractedInfo.education?.length > 0 && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mr-3">
                          <GraduationCap className="h-5 w-5 text-indigo-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Education</h4>
                      </div>
                      <div className="space-y-4">
                        {parsedData.extractedInfo.education?.map((edu, index) => (
                          <motion.div 
                            key={index} 
                            className="border-l-2 border-indigo-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <p className="font-semibold text-white text-lg">{edu.degree}</p>
                            <p className="text-indigo-300 font-medium">{edu.institution}</p>
                            <p className="text-gray-400 text-sm">{edu.year}</p>
                            {edu.gpa && <p className="text-gray-400 text-sm">GPA: {edu.gpa}</p>}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Certifications */}
                  {parsedData.extractedInfo.certifications?.length > 0 && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mr-3">
                          <Award className="h-5 w-5 text-orange-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Certifications</h4>
                      </div>
                      <div className="space-y-3">
                        {parsedData.extractedInfo.certifications?.map((cert, index) => (
                          <motion.div 
                            key={index} 
                            className="border-l-2 border-orange-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            <p className="font-semibold text-white">{cert.name}</p>
                            <p className="text-orange-300">{cert.issuer}</p>
                            <p className="text-gray-400 text-sm">{cert.year}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Projects */}
                  {parsedData.extractedInfo.projects?.length > 0 && (
                    <motion.div 
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-full flex items-center justify-center mr-3">
                          <Code className="h-5 w-5 text-pink-400" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">Projects</h4>
                      </div>
                      <div className="space-y-6">
                        {parsedData.extractedInfo.projects?.map((project, index) => (
                          <motion.div 
                            key={index} 
                            className="border-l-2 border-pink-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                          >
                            <p className="font-semibold text-white text-lg mb-2">{project.name}</p>
                            <p className="text-gray-300 leading-relaxed mb-3">{project.description}</p>
                            {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {project.technologies.map((tech, idx) => (
                                  <span key={idx} className="bg-pink-900/50 text-pink-200 px-2 py-1 rounded-full text-xs border border-pink-700/50">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                            {(project.url || project.link) && (
                              <a 
                                href={project.url || project.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-pink-400 text-sm hover:underline inline-flex items-center"
                              >
                                View Project →
                              </a>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Social Media Links */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parsedData.extractedInfo.personalInfo.linkedin && (
                        <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/20">
                          <Linkedin className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-400">LinkedIn</p>
                            <a
                              href={normalizeLinkedin(parsedData.extractedInfo.personalInfo.linkedin)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <span>{parsedData.extractedInfo.personalInfo.linkedin.replace(/^linkedin[./]*/i, '')}</span>
                            </a>
                          </div>
                        </div>
                      )}
                      {parsedData.extractedInfo.personalInfo.github && (
                        <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/20">
                          <Github className="w-5 h-5 text-gray-200" />
                          <div>
                            <p className="text-sm text-gray-400">GitHub</p>
                            <a
                              href={normalizeGithub(parsedData.extractedInfo.personalInfo.github)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <span>{parsedData.extractedInfo.personalInfo.github.replace(/^github[./]*/i, '')}</span>
                            </a>
                          </div>
                        </div>
                      )}
                      {parsedData.extractedInfo.personalInfo.portfolio && (
                        <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/20">
                          <Globe className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-sm text-gray-400">Portfolio</p>
                            <a
                              href={parsedData.extractedInfo.personalInfo.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <span>{parsedData.extractedInfo.personalInfo.portfolio}</span>
                            </a>
                          </div>
                        </div>
                      )}
                      {parsedData.extractedInfo.personalInfo.twitter && (
                        <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/20">
                          <Twitter className="w-5 h-5 text-sky-400" />
                          <div>
                            <p className="text-sm text-gray-400">Twitter</p>
                            <a
                              href={parsedData.extractedInfo.personalInfo.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <span>{parsedData.extractedInfo.personalInfo.twitter.replace(/^twitter[./]*/i, '')}</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Move manual fields here, after all parsed sections and before Save button */}
                  <div className="space-y-4 pt-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Bio <span className="text-red-400">*</span></label>
                      <textarea
                        className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={3}
                        required
                      />
                      {bioError && <p className="text-red-400 text-sm mt-1">{bioError}</p>}
                    </div>
                    {parsedData.extractedInfo.projects?.length > 0 && (
                      <div>
                        <label className="block text-white font-semibold mb-2">Project Links <span className="text-red-400">*</span></label>
                        {parsedData.extractedInfo.projects.map((project, idx) => (
                          <div key={idx} className="mb-2">
                            <span className="text-gray-300">{project.name}:</span>
                            <input
                              type="url"
                              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 mt-1"
                              value={projectLinks[idx] || ''}
                              onChange={e => {
                                const newLinks = [...projectLinks];
                                newLinks[idx] = e.target.value;
                                setProjectLinks(newLinks);
                              }}
                              required
                              placeholder="https://project-link.com"
                            />
                            {projectLinksError[idx] && <p className="text-red-400 text-sm mt-1">{projectLinksError[idx]}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Save and Continue buttons remain after manual fields */}
                  <div className="space-y-4 pt-6">
                    <motion.button
                      onClick={handleSaveData}
                      disabled={saving || !bio.trim() || (parsedData && parsedData.extractedInfo.projects && projectLinks.some(link => !link.trim()))}
                      className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: saving ? 1 : 0.98 }}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Save Data
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeParserUI;