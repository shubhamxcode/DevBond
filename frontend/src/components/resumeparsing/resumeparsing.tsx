import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Edit3, CheckCircle, AlertCircle, User, Briefcase, GraduationCap, Award, Code } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

interface PersonalInfo {
  name?: string;
  email?: string;
  location?: string;
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

const ResumeParserUI: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const apiUrl = import.meta.env.DEV ? "http://localhost:4001" : import.meta.env.VITE_RENDER_URL_;
  const accessToken = useSelector((state: RootState) => state.userProfile.accessToken);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

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
          if (prev >= 90) {
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
      });

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

    setSaving(true);
    setError(null);

    try {
      const response = await axios.post(`${apiUrl}/api/users/save-resume`, {
        parsedData: parsedData
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      // Show success message
      alert('Resume data saved successfully!');
      console.log(`resumesavedata response received:`,response);
      
      
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Resume Parser</h1>
          <p className="text-gray-300">Upload your resume and let AI extract key information</p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          {!file && !parsing && !parsedData && (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 hover:border-blue-400 hover:bg-gray-700 transition-all">
                <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-200 mb-2">Upload your resume</h3>
                <p className="text-gray-400 mb-4">Drag and drop your PDF here, or click to browse</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="upload"
                />
                <label htmlFor="upload" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Upload className="h-5 w-5 mr-2" />
                  Choose PDF File
                </label>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <Link to="/field" className="text-gray-400 mb-4">Don't have a resume?</Link> <br />
                <Link to='/field' className="inline-flex items-center px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors">
                  <Edit3 className="h-5 w-5 mr-2" />
                  Fill information manually
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="bg-red-900 border border-red-700 rounded-xl p-6 mb-6">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-3" />
                <h3 className="text-lg font-semibold text-red-200">Error</h3>
                <p className="text-red-300">{error}</p>
              </div>
              <button
                onClick={resetState}
                className="w-full bg-gray-700 text-gray-200 py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {file && !parsing && !error && (
            <div className="text-center">
              <div className="bg-green-900 border border-green-700 rounded-xl p-6 mb-6">
                <FileText className="mx-auto h-12 w-12 text-green-400 mb-3" />
                <h3 className="text-lg font-semibold text-green-200">{file.name}</h3>
                <p className="text-green-300">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleParseResume}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Parse Resume
                </button>
                <button
                  onClick={() => setFile(null)}
                  className="w-full bg-gray-700 text-gray-200 py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Choose Different File
                </button>
              </div>
            </div>
          )}

          {parsing && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
                  <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Parsing Your Resume</h3>
                <p className="text-gray-300">AI is analyzing your document...</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Parsing Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {parsedData && parsedData.extractedInfo && (
            <div className="text-center">
              <div className="bg-green-900 border border-green-700 rounded-xl p-6 mb-6">
                <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
                <h3 className="text-lg font-semibold text-green-200">Resume Parsed Successfully!</h3>
                <p className="text-green-300">
                  Pages: {parsedData.pageCount} | Size: {(parsedData.fileSize / 1024 / 1024).toFixed(2)} MB
                  {parsedData.metadata.hasAIParsing && (
                    <span className="block text-sm text-green-400 mt-1">
                      ✨ AI-Enhanced Parsing Applied
                    </span>
                  )}
                </p>
              </div>
              
              {/* Personal Information */}
              {parsedData.extractedInfo.personalInfo.name && (
                <div className="bg-gray-700 rounded-xl p-6 mb-4 text-left">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 text-blue-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">Personal Information</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-1">
                    {parsedData.extractedInfo.personalInfo.name && (
                      <p><span className="font-medium">Name:</span> {parsedData.extractedInfo.personalInfo.name}</p>
                    )}
                    {parsedData.extractedInfo.personalInfo.email && (
                      <p><span className="font-medium">Email:</span> {parsedData.extractedInfo.personalInfo.email}</p>
                    )}
                    {parsedData.extractedInfo.personalInfo.location && (
                      <p><span className="font-medium">Location:</span> {parsedData.extractedInfo.personalInfo.location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {parsedData.extractedInfo.summary && (
                <div className="bg-gray-700 rounded-xl p-6 mb-4 text-left">
                  <h4 className="text-lg font-semibold text-white mb-3">Professional Summary</h4>
                  <p className="text-gray-300 text-sm">{parsedData.extractedInfo.summary}</p>
                </div>
              )}

              {/* Skills */}
              {((parsedData.extractedInfo.skills?.technical?.length > 0) || 
                (parsedData.extractedInfo.skills?.soft?.length > 0) || 
                (parsedData.extractedInfo.skills?.languages?.length > 0)) && (
                <div className="bg-gray-700 rounded-xl p-6 mb-4 text-left">
                  <div className="flex items-center mb-3">
                    <Code className="h-5 w-5 text-green-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">Skills</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-3">
                    {parsedData.extractedInfo.skills?.technical && Array.isArray(parsedData.extractedInfo.skills.technical) && parsedData.extractedInfo.skills.technical.length > 0 && (
                      <div>
                        <p className="font-medium text-blue-300">Technical Skills:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {parsedData.extractedInfo.skills.technical.map((skill, index) => (
                            <span key={index} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {parsedData.extractedInfo.skills?.soft && Array.isArray(parsedData.extractedInfo.skills.soft) && parsedData.extractedInfo.skills.soft.length > 0 && (
                      <div>
                        <p className="font-medium text-green-300">Soft Skills:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {parsedData.extractedInfo.skills.soft.map((skill, index) => (
                            <span key={index} className="bg-green-900 text-green-200 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {parsedData.extractedInfo.skills?.languages && Array.isArray(parsedData.extractedInfo.skills.languages) && parsedData.extractedInfo.skills.languages.length > 0 && (
                      <div>
                        <p className="font-medium text-purple-300">Languages:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {parsedData.extractedInfo.skills.languages.map((skill, index) => (
                            <span key={index} className="bg-purple-900 text-purple-200 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Experience */}
              {parsedData.extractedInfo.experience?.length > 0 && (
                <div className="bg-gray-700 rounded-xl p-6 mb-4 text-left">
                  <div className="flex items-center mb-3">
                    <Briefcase className="h-5 w-5 text-yellow-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">Experience</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-4">
                    {parsedData.extractedInfo.experience?.map((exp, index) => (
                      <div key={index} className="border-l-2 border-yellow-500 pl-4">
                        <p className="font-medium text-white">{exp.title}</p>
                        <p className="text-yellow-300">{exp.company}</p>
                        <p className="text-gray-400 text-xs">{exp.duration}</p>
                        <p className="mt-2">{exp.description}</p>
                        {exp.achievements?.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {exp.achievements?.map((achievement, idx) => (
                              <li key={idx} className="text-xs text-gray-400">• {achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {parsedData.extractedInfo.education?.length > 0 && (
                <div className="bg-gray-700 rounded-xl p-6 mb-4 text-left">
                  <div className="flex items-center mb-3">
                    <GraduationCap className="h-5 w-5 text-indigo-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">Education</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-3">
                    {parsedData.extractedInfo.education?.map((edu, index) => (
                      <div key={index} className="border-l-2 border-indigo-500 pl-4">
                        <p className="font-medium text-white">{edu.degree}</p>
                        <p className="text-indigo-300">{edu.institution}</p>
                        <p className="text-gray-400 text-xs">{edu.year}</p>
                        {edu.gpa && <p className="text-gray-400 text-xs">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {parsedData.extractedInfo.certifications?.length > 0 && (
                <div className="bg-gray-700 rounded-xl p-6 mb-4 text-left">
                  <div className="flex items-center mb-3">
                    <Award className="h-5 w-5 text-orange-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">Certifications</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-2">
                    {parsedData.extractedInfo.certifications?.map((cert, index) => (
                      <div key={index} className="border-l-2 border-orange-500 pl-4">
                        <p className="font-medium text-white">{cert.name}</p>
                        <p className="text-orange-300">{cert.issuer}</p>
                        <p className="text-gray-400 text-xs">{cert.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {parsedData.extractedInfo.projects?.length > 0 && (
                <div className="bg-gray-700 rounded-xl p-6 mb-4 text-left">
                  <div className="flex items-center mb-3">
                    <Code className="h-5 w-5 text-pink-400 mr-2" />
                    <h4 className="text-lg font-semibold text-white">Projects</h4>
                  </div>
                  <div className="text-gray-300 text-sm space-y-4">
                    {parsedData.extractedInfo.projects?.map((project, index) => (
                      <div key={index} className="border-l-2 border-pink-500 pl-4">
                        <p className="font-medium text-white">{project.name}</p>
                        <p className="mt-1">{project.description}</p>
                        {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech, idx) => (
                              <span key={idx} className="bg-pink-900 text-pink-200 px-2 py-1 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {(project.url || project.link) && (
                          <a href={project.url || project.link} target="_blank" rel="noopener noreferrer" 
                             className="text-pink-400 text-xs hover:underline mt-2 inline-block">
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleSaveData}
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                </button>
                
                <Link to="/field" className="block w-full bg-gray-700 text-gray-200 py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors text-center">
                  Continue to Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeParserUI;