import { Request, Response } from 'express';
import asyncHandler from '../utils/asynchandler';
import ApiError from '../utils/apierror';
import ApiResponse from '../utils/apiresponse';
import pdf from 'pdf-parse';
import fs from 'fs';
import MistralService from '../services/mistral.service';
import Resume from '../models/resumeschema';

// Extend Request interface to include file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const parseResume = asyncHandler(async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    // Check if file is PDF
    if (req.file.mimetype !== 'application/pdf') {
      throw new ApiError(400, "Only PDF files are allowed");
    }

    // Read the uploaded file
    const dataBuffer = fs.readFileSync(req.file.path);
    
    // Parse PDF content to get text
    const data = await pdf(dataBuffer);
    const textContent = data.text;
    
    // Use Mistral API to parse resume with AI
    let aiParsedData = null;
    
    try {
      aiParsedData = await MistralService.parseResumeFromPDF(dataBuffer);
      
    } catch (aiError) {
      console.error('Mistral API Error:', aiError);
      throw new ApiError(500, "Failed to parse resume with AI. Please try again.");
    }
    
    // Combine basic parsing with AI-enhanced parsing
    const parsedData = {
      fullText: textContent,
      pageCount: data.numpages,
      fileSize: req.file.size,
      fileName: req.file.originalname,
      extractedInfo: {
        // AI-enhanced parsing results
        personalInfo: {
          ...(aiParsedData?.personalInfo || {}),
          techField: aiParsedData?.techField || '',
          techSubField: aiParsedData?.techSubField || ''
        },
        summary: aiParsedData?.summary || '',
        skills: {
          technical: aiParsedData?.skills?.technical || [],
          soft: aiParsedData?.skills?.soft || [],
          languages: aiParsedData?.skills?.languages || []
        },
        experience: aiParsedData?.experience || [],
        education: aiParsedData?.education || [],
        certifications: aiParsedData?.certifications || [],
        projects: aiParsedData?.projects || []
      },
      // Basic metadata
      metadata: {
        hasAIParsing: !!aiParsedData,
        skillsCount: (aiParsedData?.skills?.technical?.length || 0) + 
                    (aiParsedData?.skills?.soft?.length || 0) + 
                    (aiParsedData?.skills?.languages?.length || 0),
        experienceCount: aiParsedData?.experience?.length || 0,
        educationCount: aiParsedData?.education?.length || 0
      }
    };

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    return res.status(200).json(
      new ApiResponse(parsedData, "Resume parsed successfully")
    );

  } catch (error) {
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('Resume parsing error:', error);
    throw new ApiError(500, "Failed to parse resume");
  }
});

const saveResumeData = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { parsedData, bio, projectLinks } = req.body;
    if (!parsedData) {
      throw new ApiError(400, "No parsed data provided");
    }
    if (!bio || typeof bio !== 'string' || !bio.trim()) {
      throw new ApiError(400, "Bio is required");
    }
    if (!Array.isArray(projectLinks) || projectLinks.length !== (parsedData.extractedInfo.projects?.length || 0) || projectLinks.some(link => !link || !link.trim())) {
      throw new ApiError(400, "Project links are required for all projects");
    }
    // Get user from authenticated request
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }
    // Upsert (update or insert) resume document
    const filter = { userId: user._id, fileName: parsedData.fileName };
    const update = {
      $set: {
        username: user.username,
        fileSize: parsedData.fileSize,
        pageCount: parsedData.pageCount,
        fullText: parsedData.fullText,
        extractedInfo: parsedData.extractedInfo,
        metadata: parsedData.metadata,
        bio,
        projectLinks
      }
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const savedResume = await Resume.findOneAndUpdate(filter, update, options);
    return res.status(201).json(
      new ApiResponse(savedResume, "Resume data saved successfully")
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Save resume error:', error);
    throw new ApiError(500, "Failed to save resume data");
  }
});

export { parseResume, saveResumeData };