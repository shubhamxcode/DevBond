import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  fullText: string;
  extractedInfo: {
    personalInfo: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
      techField:String
      techSubField:String
    };
    summary: string;
    skills: {
      technical: string[];
      soft: string[];
      languages: string[];
    };
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
      achievements: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      gpa?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      year: string;
      expiryDate?: string;
    }>;
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      link?: string;
    }>;
  };
  metadata: {
    hasAIParsing: boolean;
    skillsCount: number;
    experienceCount: number;
    educationCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  fullText: {
    type: String,
    required: true
  },
  extractedInfo: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String,
      techField:String,
      techSubField:String,
    },
    summary: {
      type: String,
      default: ''
    },
    skills: {
      technical: [String],
      soft: [String],
      languages: [String]
    },
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String,
      achievements: [String]
    }],
    education: [{
      degree: String,
      institution: String,
      year: String,
      gpa: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      year: String,
      expiryDate: String
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String
    }]
  },
  metadata: {
    hasAIParsing: {
      type: Boolean,
      default: false
    },
    skillsCount: {
      type: Number,
      default: 0
    },
    experienceCount: {
      type: Number,
      default: 0
    },
    educationCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Create index on userId for faster queries
resumeSchema.index({ userId: 1 });

// Create unique compound index to prevent duplicate resumes for same user
resumeSchema.index({ userId: 1, fileName: 1 }, { unique: true });

const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export default Resume; 