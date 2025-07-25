
import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

class MistralService {
  private client: Mistral;
  private model: string;

  constructor() {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY is not configured');
    }
    
    this.client = new Mistral({ apiKey });
    this.model = process.env.MISTRAL_MODEL || 'mistral-medium';
    
    // Debug logging
    console.log('MistralService initialized with model:', this.model);
    console.log('Environment MISTRAL_MODEL:', process.env.MISTRAL_MODEL);
  }

  // Helper function to extract text content from response
  private extractTextContent(content: string | any[]): string {
    if (typeof content === 'string') {
      return content;
    }
    
    if (Array.isArray(content)) {
      // Handle ContentChunk array
      return content
        .filter(chunk => chunk.type === 'text')
        .map(chunk => chunk.text)
        .join('');
    }
    
    return '';
  }



  async parseResumeFromPDF(pdfBuffer: Buffer): Promise<any> {
    // First extract text from PDF using pdf-parse
    const pdf = require('pdf-parse');
    const pdfData = await pdf(pdfBuffer);
    const resumeText = pdfData.text;
    
    try {
      const response = await this.client.chat.complete({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Parse this resume text and extract structured information. Return the result as a valid JSON object with the following structure:
                 
                 {
                   "personalInfo": {
                     "name": "Full Name",
                     "email": "email@example.com",
                     "phone": "phone number",
                     "location": "city, state/country",
                     "linkedin": "linkedin url",
                     "github": "github url",
                     "portfolio": "portfolio url"
                   },
                   "summary": "Professional summary or objective",
                   "skills": {
                     "technical": ["skill1", "skill2"],
                     "soft": ["skill1", "skill2"],
                     "languages": ["language1", "language2"]
                   },
                   "experience": [
                     {
                       "title": "Job Title",
                       "company": "Company Name",
                       "duration": "start date - end date",
                       "description": "Detailed job description and responsibilities",
                       "achievements": ["achievement1", "achievement2"],
                       "technologies": ["tech1", "tech2"]
                     }
                   ],
                   "education": [
                     {
                       "degree": "Degree Name",
                       "institution": "Institution Name",
                       "year": "Graduation Year",
                       "gpa": "GPA if available"
                     }
                   ],
                   "certifications": [
                     {
                       "name": "Certification Name",
                       "issuer": "Issuing Organization",
                       "year": "Year obtained",
                       "expiryDate": "expiry date if available"
                     }
                   ],
                   "projects": [
                     {
                       "name": "Project Name",
                       "description": "Project description",
                       "technologies": ["tech1", "tech2"],
                       "link": "project url if available"
                     }
                   ],
                   "techField": "Main technology field or domain of the user, e.g., Software Engineering, Data Science, Web Development, etc.",
                   "techSubField": "If the main field is Web Development, specify if the user is primarily Frontend, Backend, or Fullstack. For other fields, specify a relevant specialization if possible (e.g., Machine Learning for Data Science, Mobile for App Development, etc.). If not clear, return null or 'unknown'."
                 }
                 
                 Important: For experience section, extract the actual job details, responsibilities, and achievements from the resume text. Don't just extract time periods. Look for job titles, company names, and detailed descriptions of what the person did in each role.
                 
                 For 'techField', you must extract this strictly and only from explicit, clear evidence in the resume. Do not guess or infer. If the information is not clearly present, return null or 'unknown'. For the same resume, your output for these fields must always be identical and deterministic. Do not generate random or inconsistent values. This is a strict requirement from the user (Cursor). Accuracy is more important than filling the field.
                 For 'techSubField', if the main field is Web Development, specify if the user is primarily Frontend, Backend, or Fullstack. For other fields, specify a relevant specialization if possible. If not clear, return null or 'unknown'. Do not guess or infer. Be strictly consistent for the same input.
                 
                 Resume text:
                 ${resumeText}
                 
                 Extract all available information from the resume. If any field is not found, use an empty object, array, or string as appropriate.

                 Important: Return only valid JSON. Do not include any text or explanation before or after the JSON.`
              }
            ]
          }
        ],
        temperature: 0,
        maxTokens: 4000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from Mistral API');
      }

      const textContent = this.extractTextContent(content);
      if (!textContent) {
        throw new Error('No text content in response');
      }
      try {
        return JSON.parse(textContent);
      } catch (e) {
        // Try to extract JSON substring if extra text is present
        const jsonMatch = textContent.match(/{[\s\S]*}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Failed to parse JSON from Mistral response');
      }

    } catch (error: any) {
      console.error('Mistral API Error:', error);
      
      // If it's a model error, try with a fallback model
      if (error.message && error.message.includes('Invalid model')) {
        console.log('Model error detected, trying with mistral-small as fallback');
        try {
          const fallbackResponse = await this.client.chat.complete({
            model: 'mistral-small',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Parse this resume text and extract structured information. Return as JSON with: personalInfo (name, email, phone, location, linkedin, github, portfolio), summary, skills (technical, soft, languages), experience (title, company, duration, description, achievements, technologies), education, certifications, projects, techField, techSubField.
                    
                    Important: For experience section, extract the actual job details, responsibilities, and achievements from the resume text. Don't just extract time periods.
                    For 'techField', infer the main technology field or domain of the user based on their skills, experience, education, and projects. Use a concise label such as 'Software Engineering', 'Data Science', 'Web Development', 'Cybersecurity', etc. If not clear, return an empty string.
                    For 'techSubField', if the main field is Web Development, specify if the user is primarily Frontend, Backend, or Fullstack. For other fields, specify a relevant specialization if possible. If not clear, return an empty string.
                    
                    Resume text:
                    ${resumeText}`
                  }
                ]
              }
            ],
            temperature: 0.1,
            maxTokens: 4000
          });

          const fallbackContent = fallbackResponse.choices[0]?.message?.content;
          if (fallbackContent) {
            const textContent = this.extractTextContent(fallbackContent);
            if (textContent) {
              const parsedData = JSON.parse(textContent);
              return parsedData;
            }
          }
        } catch (fallbackError) {
          console.error('Fallback model also failed:', fallbackError);
        }
      }
      
      throw new Error('Failed to parse resume with AI');
    }
  }


}

export default new MistralService();