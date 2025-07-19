import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { User, Mail, MapPin, Calendar, Award, Briefcase, GraduationCap, Code, Globe, Star, FileText, Users, Languages } from 'lucide-react';

const UserResumeInfo = () => {
  const resumeInfo = useSelector((state: RootState) => state.userProfile.resumeInfo);
  const [activeSection, setActiveSection] = useState('personal');

  if (!resumeInfo) {
    return (
      <div className="min-h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 text-center border border-gray-700/30 backdrop-blur-sm">
        <div className="animate-pulse">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No resume information available.</p>
        </div>
      </div>
    );
  }

  const { extractedInfo, bio, projectLinks } = resumeInfo;

  const sections = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'bio', label: 'Bio', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Globe },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ];

  const SkillBadge = ({ skill, type }: { skill: string, type: string }) => {
    const colors: Record<'technical' | 'soft' | 'languages', string> = {
      technical: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300',
      soft: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300',
      languages: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300'
    };
    return (
      <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${colors[type as 'technical' | 'soft' | 'languages']} border backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group`}>
        <span className="text-sm font-medium group-hover:text-white transition-colors duration-300">{skill}</span>
      </div>
    );
  };

  const ExperienceCard = ({ exp }: { exp: any, index: number }) => (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{exp.title}</h4>
              <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">{exp.duration}</span>
            </div>
            <p className="text-blue-300 font-medium mb-2">{exp.company}</p>
            <p className="text-gray-300 mb-3">{exp.description}</p>
            {exp.achievements?.length > 0 && (
              <div className="space-y-2">
                {exp.achievements.map((ach: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{ach}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ proj, index }: { proj: any, index: number }) => (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors duration-300">{proj.name}</h4>
              {((projectLinks && projectLinks[index]) || proj.link) && (
                <a 
                  href={projectLinks?.[index] || proj.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:scale-110 transform"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
            <p className="text-gray-300 mb-3">{proj.description}</p>
            {proj.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {proj.technologies.map((tech: string, i: number) => (
                  <span key={i} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-md border border-gray-600/30">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30"></div>
          <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-0">
              User information
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8 bg-gray-800/50 rounded-2xl p-2 border border-gray-700/30 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeSection === id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Personal Info */}
          {activeSection === 'personal' && extractedInfo?.personalInfo && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-400" />
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {extractedInfo.personalInfo.name && (
                    <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/20">
                      <User className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-white font-medium">{extractedInfo.personalInfo.name}</p>
                      </div>
                    </div>
                  )}
                  {extractedInfo.personalInfo.email && (
                    <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/20">
                      <Mail className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white font-medium">{extractedInfo.personalInfo.email}</p>
                      </div>
                    </div>
                  )}
                  {extractedInfo.personalInfo.location && (
                    <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/20">
                      <MapPin className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">{extractedInfo.personalInfo.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bio */}
          {activeSection === 'bio' && bio && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-purple-400" />
                  Professional Bio
                </h2>
                <div className="prose prose-lg prose-invert">
                  <p className="text-gray-200 leading-relaxed text-lg">{bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          {activeSection === 'skills' && extractedInfo?.skills && (
            <div className="space-y-6">
              {extractedInfo.skills.technical?.length > 0 && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {extractedInfo.skills.technical.map((skill: string, idx: number) => (
                        <SkillBadge key={idx} skill={skill} type="technical" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {extractedInfo.skills.soft?.length > 0 && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {extractedInfo.skills.soft.map((skill: string, idx: number) => (
                        <SkillBadge key={idx} skill={skill} type="soft" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {extractedInfo.skills.languages?.length > 0 && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {extractedInfo.skills.languages.map((lang: string, idx: number) => (
                        <SkillBadge key={idx} skill={lang} type="languages" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Experience */}
          {activeSection === 'experience' && extractedInfo?.experience?.length > 0 && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                  Professional Experience
                </h2>
                <div className="space-y-6">
                  {extractedInfo.experience.map((exp: any, idx: number) => (
                    <ExperienceCard key={idx} exp={exp} index={idx} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Education */}
          {activeSection === 'education' && extractedInfo?.education?.length > 0 && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-pink-400" />
                  Education
                </h2>
                <div className="space-y-4">
                  {extractedInfo.education.map((edu: any, idx: number) => (
                    <div key={idx} className="group">
                      <div className="flex items-start gap-4 p-6 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-lg font-bold text-white mb-1">{edu.degree}</h4>
                          <p className="text-pink-300 font-medium mb-2">{edu.institution}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{edu.year}</span>
                            </div>
                            {edu.gpa && (
                              <span className="bg-gray-600/50 px-2 py-1 rounded-md">GPA: {edu.gpa}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects */}
          {activeSection === 'projects' && extractedInfo?.projects?.length > 0 && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-orange-400" />
                  Projects
                </h2>
                <div className="space-y-6">
                  {extractedInfo.projects.map((proj: any, idx: number) => (
                    <ProjectCard key={idx} proj={proj} index={idx} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certifications */}
          {activeSection === 'certifications' && extractedInfo?.certifications?.length > 0 && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/30 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Certifications
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {extractedInfo.certifications.map((cert: any, idx: number) => (
                    <div key={idx} className="group">
                      <div className="flex items-center gap-4 p-6 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-lg font-bold text-white mb-1">{cert.name}</h4>
                          <p className="text-yellow-300 font-medium mb-1">{cert.issuer}</p>
                          <p className="text-sm text-gray-400">{cert.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserResumeInfo; 