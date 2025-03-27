from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from dotenv import load_dotenv
import os
# import logging
from openai import OpenAI
from langchain.chat_models.base import BaseChatModel
from langchain.schema import BaseMessage, ChatResult, AIMessage, HumanMessage, SystemMessage
from google.cloud import secretmanager


# Load environment variables
load_dotenv()
os.environ["GCP_PROJECT_ID"] = "rbs-backend-447700" 

app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Available Groq models
GROQ_MODELS = [
    "llama-3.1-8b-instant",
    "deepseek-chat",
    "llama-3.3-70b-versatile"
    
]

# Input models
class CoverLetterRequest(BaseModel):
    resume: str
    job_description: str
    model_name: str
    user_custom_prompt: str

class ResumeOptimizationRequest(BaseModel):
    resume: str
    job_description: str
    model_name: str
    user_custom_prompt: str
    resume_section: str

class InterviewPrepRequest(BaseModel):
    resume: str
    job_description: str
    interviewer_role: str
    interviewer_profile: str
    interview_duration: int
    interview_description: str
    model_name: str
    user_custom_prompt: str

class InterviewSimulation(BaseModel):
    resume: str
    job_description: str
    interview_type: str
    interviewer_role: str
    interviewer_profile: str
    interview_duration: int
    interview_description: str
    model_name: str
    user_custom_prompt: str

# Function to fetch API key from Secret Manager
def get_secret(secret_name: str) -> str:
    try:
        client = secretmanager.SecretManagerServiceClient()
        project_id = os.getenv("GCP_PROJECT_ID")
        name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        raise Exception(f"Error fetching secret {secret_name}: {str(e)}")

# # Helper function to get LLM
# def get_llm(model_name: str) -> BaseChatModel:
#     if model_name not in GROQ_MODELS:
#         raise HTTPException(status_code=400, detail="Invalid model name")
    
#     return ChatGroq(
#         temperature=0,
#         groq_api_key=get_secret("GROQ_API_KEY"),
#         model_name=model_name
#     )

def get_llm(model_name: str) -> BaseChatModel:
    if model_name not in GROQ_MODELS:
        raise HTTPException(status_code=400, detail="Invalid model name")
    
    # groq_api_key = get_secret("GROQ_API_KEY")
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ API key not found")
        
    return ChatGroq(
        temperature=0,
        groq_api_key=groq_api_key.strip(),  # Remove any whitespace
        model_name=model_name
    )

# Your existing prompt templates (COVER_LETTER_TEMPLATE, RESUME_OPTIMIZATION_TEMPLATE, etc.)
# Copy all your prompt templates from the original file here
# Cover Letter Generation
COVER_LETTER_TEMPLATE = """
You are an expert cover letter writer at a top recruiting firm specializing in ATS optimization. 
Your task is to craft a compelling cover letter that strictly uses information from the provided 
resume to match the job description requirements.

Resume:
{resume}

Job Description:
{job_description}

User's Custom Requirements:
{user_custom_prompt}

Follow these precise guidelines:

1. OPENING PARAGRAPH:
- Begin with a strong introduction referencing the specific job title
- Mention how you discovered the position
- Include a brief (1-2 sentence) summary of your most relevant qualification from the resume

2. BODY PARAGRAPHS (2-3):
- Each paragraph must reference specific accomplishments from the resume
- Format: Situation -> Action -> Result
- Use metrics and achievements mentioned in the resume
- Connect each point directly to job requirements
- Only include information present in the resume

3. CLOSING PARAGRAPH:
- Summarize why you're an excellent fit based on resume qualifications
- Express enthusiasm for the opportunity
- Include clear call to action

STRICT REQUIREMENTS:
- Divide the cover letter into paragraphs 
- Must use formal business letter format
- Every claim must be verifiable from the resume
- Use active voice and professional tone
- Avoid generic statements that could apply to any candidate

PROHIBITED:
- Adding skills or experiences not mentioned in the resume
- Generic phrases like "I am a hard worker"
- Unsubstantiated claims
- Personal information not related to professional qualifications
"""

# Your existing route handlers
@app.post("/api/generate-cover-letter")
async def generate_cover_letter(request: CoverLetterRequest):
    try:
        prompt = PromptTemplate(
              template=COVER_LETTER_TEMPLATE,
              input_variables=["resume", "job_description", "user_custom_prompt"]
          )
      
        if request.model_name == "deepseek-chat":
            rendered_prompt = prompt.format(
                resume=request.resume,
                job_description=request.job_description,
                user_custom_prompt=request.user_custom_prompt
                )
            # deepseek_api_key = get_secret("DEEPSEEK_API_KEY")
            deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
            if not deepseek_api_key:
                raise HTTPException(status_code=500, detail="DeepSeek API key not found in Parameter Store.")
            client = OpenAI(api_key=deepseek_api_key, base_url="https://api.deepseek.com")
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are an expert cover letter writer at a top recruiting firm specializing in ATS optimization."},
                    {"role": "user", "content": rendered_prompt},
                    ],
                    stream=False,
                    temperature=1.3,
                    max_tokens=8000,
                    )
            return {"cover_letter": response.choices[0].message.content}
        else:
          # groq_api_key = get_secret("GROQ_API_KEY")
          # if not groq_api_key:
          #     raise HTTPException(status_code=500, detail="GROQ API key not found in Parameter Store.")
          llm = get_llm(request.model_name)          
          chain = prompt | llm
          response = chain.invoke({
              "resume": request.resume,
              "job_description": request.job_description,
              "user_custom_prompt": request.user_custom_prompt
          })
          return {"cover_letter": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Resume Optimization and Keyword Extraction
RESUME_OPTIMIZATION_TEMPLATE = """
You are an expert resume analyst and career coach with deep experience in talent acquisition and job matching. 
Your task is to analyze the provided resume section against the job description and provide detailed, actionable 
feedback.

Resume Section to Analyze: {resume_section}
Job Description: {job_description}
Custom User Prompt (if any): {user_custom_prompt}

Analysis Steps for Each Section:

SECTION 1 - NEW POINTS SUGGESTIONS: Suggest atleast 6 new points covering all the subsections of the resume section. 
1. Gap Analysis:
   - Compare job requirements against current resume content
   - Identify missing critical experiences
   - Note unexpressed relevant achievements

2. Point Generation:
   - Focus on gaps identified in job requirements
   - Leverage candidate's background for relevant examples
   - Ensure alignment with industry standards
   - Include specific metrics and technical details

3. Validation:
   - Verify each suggestion is realistic given the experience
   - Ensure alignment with job requirements
   - Confirm measurable impact inclusion
   - Check technical keyword relevance

SECTION 2 - KEYWORD ANALYSIS:
1. Keyword Extraction:
   First, extract ALL important keywords from the job description that are valuable for ATS/Recruiter evaluation:
   - Must extract ALL technical skills and technologies mentioned
   - ALL programming languages and frameworks
   - ALL tools, platforms, and software
   - ALL methodologies and processes
   - ALL soft skills that appear multiple times or are emphasized
   - ALL industry-specific terminology
   - ALL required certifications
   - ANY keywords that appear to be emphasized or repeated in the job description
   
2. Comprehensive Matching Process:
   For EACH extracted keyword:
   - Perform case-insensitive exact match check in the resume section
   - Mark as "Yes" if present in ANY form
   - Mark as "No" if absent
   - You must include EVERY important keyword in the output, regardless of whether it's present or not
   
3. Recommendation Formation:
   For EACH "No" keyword:
   - Create a specific bullet point showing how to incorporate the keyword
   - Identify the most relevant subsection for placement
   - Explain why this placement makes sense
   - Ensure the recommendation aligns with the candidate's actual experience
   
IMPORTANT OUTPUT FORMATTING INSTRUCTIONS:
1. Return ONLY pure JSON without any additional formatting characters
2. Do NOT include ```json, \n, or any other markdown/formatting syntax
3. The response should start directly with the opening curly brace
4. Ensure proper JSON escaping for any special characters
5. Do not add any text before or after the JSON object

Format your response as a clean JSON object:
{{
    "analysis_results": {{
        "section_1": {{
            "title": "Suggested New Points",
            "suggestions": [
                {{
                    "bullet_point": "<detailed point with metrics and technical keywords>",
                    "rationale": "<specific gap or requirement addressed>",
                    "alignment": "<relevant job requirements and how this point meets them and where it can be placed in the resume>"
                }}
            ]
        }},
        "section_2": {{
            "title": "Keyword Analysis",
            "keywords": [
                {{
                    "key_term": "<extract EVERY important keyword from job description>",
                    "present_in_resume": "<strictly Yes or No>",
                    "recommendation": "<Required if No: provide specific bullet point for incorporating this keyword>",
                    "placement_reasoning": "<Required if No: specify exact subsection and detailed reasoning for placement>"
                }}
            ]
        }}
    }}
}}

Additional Requirements for Section 3:
1. Include ALL important keywords from job description, not just matches
2. Ensure "present_in_resume" is ALWAYS either "Yes" or "No"
3. For "No" matches, ALWAYS provide both recommendation and placement_reasoning
4. For "Yes" matches, set recommendation and placement_reasoning to "Already present in resume"
5. Keywords should be listed in order of importance/frequency in job description
6. Include technical terms, soft skills, and methodologies
7. Do not skip any important keyword, even if it seems minor

Critical and Strict Requirements:
1. Start response directly with {{ and end with }}
2. No markdown formatting (```), newline characters (\n), or other special formatting
3. No additional text outside the JSON object
4. Ensure all JSON syntax is valid and properly nested
5. Use proper escaping for quotes and special characters within strings
"""

func2_prompt_template = """
You are an expert resume analyst and career coach with deep experience in talent acquisition and job matching. 
Your task is to analyze the provided resume section against the job description and provide detailed, actionable 
feedback.

Resume Section to Analyze: {resume_section}
Job Description: {job_description}
Custom User Prompt (if any): {user_custom_prompt}

Analysis Steps for Each Section:

SECTION 1 - EXISTING POINTS OPTIMIZATION:
1. Mandatory Subsection Detection (CRITICAL):
   a. First pass - Identification:
      - Scan for ALL experience entries containing:
        * Company name AND
        * Role/title AND
        * Date range
      - Create a LIST of ALL detected experiences
      - Count total number of experiences found
   
   b. Second pass - Validation:
      - Compare detected experiences against original text
      - Confirm NO experiences were missed
      - Record exact count of bullet points per experience
      - REQUIRE minimum 4 distinct subsections for typical resume
      - Flag if fewer subsections found than exist in input

   c. Quality Check:
      - Assert all date ranges are accounted for
      - Verify no content exists outside detected subsections
      - Confirm all experiences have associated bullet points

2. Comprehensive Analysis Requirements:
   For EACH subsection identified above:
   - Must process ALL bullet points
   - Must analyze EVERY subsection detected
   - Cannot skip or combine subsections
   - Must maintain chronological order
   - Must process most recent to oldest experience

3. For each bullet point in EVERY subsection:
   Analyze and improve based on:
   - Quantifiable metrics presence and effectiveness
   - Impact demonstration (business value, outcomes)
   - Action verb strength and specificity
   - Technical keyword inclusion and relevance
   - Alignment with job requirements

4. For bullet points needing improvement:
   - Identify specific weaknesses
   - Add missing metrics where possible
   - Strengthen action verbs
   - Enhance technical detail
   - Improve alignment with job requirements

5. For effective bullet points:
   - Document why they work well
   - Note specific elements that make them strong

IMPORTANT OUTPUT FORMATTING INSTRUCTIONS:
1. Return ONLY pure JSON without any additional formatting characters
2. Do NOT include ```json, \n, or any other markdown/formatting syntax
3. The response should start directly with the opening curly brace
4. Ensure proper JSON escaping for any special characters
5. Do not add any text before or after the JSON object

Format your response as a clean JSON object:
{{
    "analysis_results": {{
        "section_1": {{
            "title": "Existing Points Optimization",
            "subsections": [
                {{
                    "subsection_name": "<company/role name>",
                    "points": [
                        {{
                            "original": "<original bullet point>",
                            "improved": "<enhanced version with metrics, stronger verbs, and job alignment>",
                            "reasoning": "<specific improvements made and their value>"
                        }}
                    ],
                    "unchanged_points": [
                        {{
                            "point": "<bullet point>",
                            "assessment": "<specific elements that make it effective>"
                        }}
                    ]
                }}
            ]
        }}
    }}
}}
"""

#Resume Parsing Function
def extract_resume_section(raw_resume_text, section_name):
    try:
        # logger.info("INSIDE THE extract_resume_section FUNCTION ..........")
        
        # Initialize the Groq LLM
        func_llm = ChatGroq(
            temperature=0,
            groq_api_key= os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile"
        )

        # Define the prompt template
        func_prompt = PromptTemplate(
            template=(
                """Extract the exact contents of the '{section_name}' section from the following resume text. 
                Do not modify, paraphrase, or summarize the content after extracting it. 
                Ensure the output is an exact match to the text in the specified section.
                Resume Text: {resume_text}
                Output only the content from the '{section_name}' section.
                """
            ),
            input_variables=["section_name", "resume_text"]
        )

        # Create the chain and invoke the LLM
        func_chain = func_prompt | func_llm
        func_response = func_chain.invoke({
            "section_name": section_name,
            "resume_text": raw_resume_text
        })

        # Extract the content from the AIMessage response
        if not func_response or not hasattr(func_response, "content"):
            # logger.error("Received an empty or invalid response from the LLM.")
            raise ValueError("LLM response is empty or invalid.")

        response_content = func_response.content.strip()

        if not response_content:
            # logger.error("Received empty content after processing.")
            raise ValueError("LLM returned empty content.")

        # logger.info("LLM response successfully received.")
        return response_content

    except Exception as e:
        # logger.error(f"Error in extract_resume_section: {str(e)}", exc_info=True)
        raise

def optimize_resume_points(resume_section, job_description, user_custom_prompt, model_name):
    
    if model_name == "deepseek-chat":
        func2_prompt = PromptTemplate(
            template=func2_prompt_template,
            input_variables=[
                "resume_section", "job_description", "user_custom_prompt"
            ]
        )
        
        func2_rendered_prompt = func2_prompt.format(
            resume_section=resume_section,
            job_description=job_description,
            user_custom_prompt=user_custom_prompt
        )
        
        # deepseek_api_key = get_secret("DEEPSEEK_API_KEY")
        deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
        if not deepseek_api_key:
            raise HTTPException(status_code=500, detail="DeepSeek API key not found in Parameter Store.")
        client = OpenAI(api_key=deepseek_api_key, base_url="https://api.deepseek.com")
        func2_response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are an expert resume analyst and career coach with deep experience in talent acquisition and job matching. Your task is to analyze the provided resume section against the job description and provide detailed, actionable feedack."},
                    {"role": "user", "content": func2_rendered_prompt},
                    ],
                    stream=False,
                    temperature=1.3,
                    max_tokens=8000,
                    )
        return func2_response.choices[0].message.content
        
    
    else:
      # Initialize the Groq LLM
      func2_llm = ChatGroq(
          temperature=0,
          groq_api_key= os.getenv("GROQ_API_KEY"),
          model_name=model_name
      )

      func2_prompt = PromptTemplate(
              template=func2_prompt_template,
              input_variables=[
                  "resume_section", "job_description", "user_custom_prompt"
              ]
          )
      
      func2_chain = func2_prompt | func2_llm
      func2_response = func2_chain.invoke({
              "resume_section": resume_section,
              "job_description": job_description,
              "user_custom_prompt": user_custom_prompt,
          })
      func2_response_content = func2_response.content

      return func2_response_content

@app.post("/api/optimize-resume")
async def optimize_resume(request: ResumeOptimizationRequest):
    try:
        resume_section_content = extract_resume_section(request.resume,
              request.resume_section)
        
        prompt = PromptTemplate(
              template=RESUME_OPTIMIZATION_TEMPLATE,
              input_variables=["resume_section", "job_description", "user_custom_prompt"]
          )
        
        optimized_resume_points = optimize_resume_points(resume_section_content, request.job_description, 
                                                         request.user_custom_prompt,request.model_name)
        if request.model_name == "deepseek-chat":
            rendered_prompt = prompt.format(
                resume_section=resume_section_content,
                job_description=request.job_description,
                user_custom_prompt=request.user_custom_prompt
                )
            # deepseek_api_key = get_secret("DEEPSEEK_API_KEY")
            deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
            if not deepseek_api_key:
                raise HTTPException(status_code=500, detail="DeepSeek API key not found in Parameter Store.")
            client = OpenAI(api_key=deepseek_api_key, base_url="https://api.deepseek.com")
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are an expert resume analyst and career coach with deep experience in talent acquisition and job matching. Your task is to analyze the provided resume section against the job description and provide detailed, actionable feedback."},
                    {"role": "user", "content": rendered_prompt},
                    ],
                    stream=False,
                    temperature=1.3,
                    max_tokens=8000,
                    )
            return {"Resume_Optimization": optimized_resume_points, "Remaining_Results": response.choices[0].message.content}
    
        else: 
          llm = get_llm(request.model_name)
          # logger.info("INSIDE THE OPTIMIZE RESUME END POINT")          
                   
          chain = prompt | llm
          response = chain.invoke({
              "resume_section": resume_section_content,
              "job_description": request.job_description,
              "user_custom_prompt": request.user_custom_prompt,
          })
          
          return {"Resume_Optimization": optimized_resume_points, "Remaining_Results": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Interview Preparation
INTERVIEW_PREP_TEMPLATE = """
You are a senior interview coach who has helped 1000+ candidates successfully prepare for 
interviews at top companies. Create a comprehensive interview preparation guide.

This is candidate's Resume: 
{resume}

This is the Job Description:
{job_description}

Interview Context:
- Interviewer: {interviewer_role} - {interviewer_profile}
- Duration: {interview_duration} minutes
- Format: {interview_description}
- User's Custom Prompt: {user_custom_prompt}

You will analyze the provided information and generate a response in the specified JSON format below.
Do not include any text, prefixes, or explanations outside the JSON structure.
Ensure the response is a single, valid JSON object.

PREPARATION FRAMEWORK:
1. STRATEGIC ANALYSIS
First analyze:
A. Experience Alignment
   - Map resume experiences to job requirements
   - Identify potential experience gaps
   - List strongest achievements relevant to role
B. Interview Context Analysis
   - Interviewer's perspective based on their role
   - Time management strategy for {interview_duration} minutes
   - Critical areas based on interview type

2. PREPARATION GUIDE
Structure the preparation into:
A. Technical Preparation (if applicable)
   - Core concepts to review
   - Practice exercises
   - System design considerations
   - Coding language specifics
B. Experience Preparation
   - Key projects to highlight
   - Metrics to memorize
   - Challenge-solution stories
   - Leadership examples
C. Company/Role Preparation
   - Industry trends
   - Company background
   - Role-specific knowledge
   - Expected challenges

3. QUESTION PREDICTION & PREPARATION
Generate three types of questions:
A. Guaranteed Questions (80% likelihood)
   - Based on job requirements
   - Based on resume experiences
   - Standard for interview type
B. Likely Questions (50% likelihood)
   - Based on interviewer's role
   - Based on industry trends
   - Based on company challenges
C. Preparation Questions
   - Technical concepts to review
   - Projects to prepare discussing
   - Metrics to remember
4. ANSWER FRAMEWORKS
For each predicted question:
A. Structure:
   - Opening statement
   - Key points to cover
   - Supporting evidence from resume
   - Conclusion/impact
B. Delivery Notes:
   - Time allocation
   - Key phrases to use
   - Data points to include
   - Follow-up considerations

OUTPUT:
{{
  "strategic_analysis": {{
    "experience_alignment": {{
      "matching_experiences": [
        {{
          "requirement": "",
          "matching_experience": "",
          "strength_level": ""
        }}
      ],
      "potential_gaps": [
        {{
          "gap": "",
          "mitigation_strategy": ""
        }}
      ],
      "key_achievements": [
        {{
          "achievement": "",
          "relevance": ""
        }}
      ]
    }},
    "interview_context": {{
      "interviewer_perspective": {{
        "key_interests": [],
        "likely_focus_areas": []
      }},
      "time_management": {{
        "introduction": 0,
        "main_discussion": 0,
        "questions": 0,
        "closing": 0
      }},
      "critical_areas": []
    }}
  }},
  "preparation_guide": {{
    "technical_preparation": {{
      "core_concepts": [
        {{
          "concept": "",
          "importance": "",
          "review_materials": []
        }}
      ],
      "practice_exercises": [
        {{
          "topic": "",
          "recommended_problems": []
        }}
      ],
      "system_design": {{
        "key_considerations": [],
        "practice_scenarios": []
      }}
    }},
    "experience_preparation": {{
      "key_projects": [
        {{
          "project": "",
          "relevance": "",
          "key_points": [],
          "metrics": []
        }}
      ],
      "stories": [
        {{
          "category": "",
          "situation": "",
          "task": "",
          "action": "",
          "result": ""
        }}
      ]
    }},
    "company_preparation": {{
      "industry_trends": [],
      "company_background": {{
        "key_points": [],
        "recent_developments": []
      }},
      "role_specific": {{
        "key_responsibilities": [],
        "expected_challenges": []
      }}
    }}
  }},
  "questions": {{
    "guaranteed_questions": [
      {{
        "question": "",
        "answer_framework": {{
          "opening": "",
          "key_points": [],
          "evidence": [],
          "conclusion": ""
        }},
        "delivery_notes": {{
          "time_allocation": "",
          "key_phrases": [],
          "data_points": []
        }}
      }}
    ],
    "likely_questions": [
      {{
        "question": "",
        "answer_framework": {{
          "opening": "",
          "key_points": [],
          "evidence": [],
          "conclusion": ""
        }},
        "delivery_notes": {{
          "time_allocation": "",
          "key_phrases": [],
          "data_points": []
        }}
      }}
    ],
    "preparation_questions": {{
      "technical_review": [],
      "project_discussion": [],
      "metrics_to_remember": []
    }}
  }}
}}

IMPORTANT NOTES FOR MODEL:
1. Provide output as a pure JSON object without any prefixes, suffixes, or explanatory text
2. Strictly do not provide preambles, explanations, or additional information outside the JSON structure. 
2. Do not include 'json\n' or any other formatting prefixes
3. Fill all fields with relevant content based on the provided information
4. Ensure arrays are properly formatted, even if empty
5. Use double quotes for all strings in JSON
6. Do not include any markdown formatting or code blocks
7. Maintain proper JSON structure and nesting
8. Remove any null or undefined values
"""

@app.post("/api/interview-prep")
async def generate_interview_prep(request: InterviewPrepRequest):
    try:
        if request.model_name == "deepseek-chat":
            prompt = PromptTemplate(
              template=INTERVIEW_PREP_TEMPLATE,
              input_variables=[
                  "resume", "job_description", "interviewer_role", "interviewer_profile",
                  "interview_duration", "interview_description", "user_custom_prompt"
              ]
            )
            rendered_prompt = prompt.format(
                resume=request.resume,
                job_description=request.job_description,
                interviewer_role = request.interviewer_role,
                interviewer_profile=request.interviewer_profile,
                interview_duration=request.interview_duration,
                interview_description=request.interview_description,
                user_custom_prompt=request.user_custom_prompt
                )
            
            # deepseek_api_key = get_secret("DEEPSEEK_API_KEY")
            deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
            if not deepseek_api_key:
                raise HTTPException(status_code=500, detail="DeepSeek API key not found in Parameter Store.")
            client = OpenAI(api_key=deepseek_api_key, base_url="https://api.deepseek.com")
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are a senior interview coach who has helped 1000+ candidates successfully prepare for interviews at top companies. Create a comprehensive interview preparation guide."},
                    {"role": "user", "content": rendered_prompt},
                    ],
                    stream=False,
                    temperature=1.3,
                    max_tokens=8000,
                    )
            return {"interview_prep": response.choices[0].message.content}
            
        
        else:
          llm = get_llm(request.model_name)
          prompt = PromptTemplate(
              template=INTERVIEW_PREP_TEMPLATE,
              input_variables=[
                  "resume", "job_description", "interviewer_role", "interviewer_profile",
                  "interview_duration", "interview_description", "user_custom_prompt"
              ]
          )
          
          chain = prompt | llm
          response = chain.invoke({
              "resume": request.resume,
              "job_description": request.job_description,
              "interviewer_role": request.interviewer_role,
              "interviewer_profile": request.interviewer_profile,
              "interview_duration": request.interview_duration,
              "interview_description": request.interview_description,
              "user_custom_prompt": request.user_custom_prompt
          })
          
          return {"interview_prep": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Interview Simulation
INTERVIEW_SIM_TEMPLATE = """
You are an experienced interviewer conducting an interview. You will simulate a realistic interview based on:

Input Parameters:
- Resume: {resume} (Candidate's background and experience)
- Job Description: {job_description} (Role requirements and expectations) 
- Interview Type: {interview_type} (Style and format of interview)
- Interviewer Role: {interviewer_role} (Your role as the interviewer)
- Interviewer Profile: {interviewer_profile} (Your background and expertise)
- Interview Duration: {interview_duration} (Length of interview)
- Interview Description: {interview_description} (Specific interview guidelines)
- Custom Instructions: {user_custom_prompt} (Additional requirements)

Interview Simulation Guidelines:

1. Role Embodiment:
- Fully embody the specified interviewer role and expertise level.
- Maintain consistent personality throughout the interview.
- Consider the company culture and position requirements from Job Description.
- Follow the specified interview format and duration.

2. Question Strategy:
- Generate 12-15 strategically sequenced questions
- Begin with rapport-building questions before diving deep.
- Answer every question with a detailed and in-depth STAR response.
- Strictly include questions related to the type of interview mentioned by the user - {interview_type} 
- Keep in mind the candidate's background from Resume and the Job Description.
- Follow up on relevant points from previous answers.
- After each response, provide 3-4 follow-up questions related to the candidate's response to deepen the discussion.  

3. Response Generation:
- Create detailed candidate responses following STAR format:
 * Situation: Set the context and background
 * Task: Explain the specific challenge or responsibility
 * Action: Detail the steps taken to address the situation
 * Result: Share the outcomes and learnings
- Ensure responses demonstrate:
 * Clear problem-solving approach
 * Technical depth where appropriate
 * Leadership and teamwork skills
 * Decision-making process
- Generate 3-4 relevant follow-up questions after each response

4. Interview Focus:
- Maintain clear progression of topics
- Ensure technical depth aligns with role requirements
- Focus on real-world scenarios and examples
- Build upon previous responses for context
- Keep engagement professional and constructive

The simulation should maintain professional tone while creating a realistic interview 
environment relevant to the candidate's background and the job requirements. . Each response must strictly follow 
the STAR methodology with detailed answers.


Format your response as a JSON object with the following structure:

{{
  "interview_metadata": {{
    "position": string,
    "interview_type": string,
    "interviewer": string,
    "duration": string
  }},
  "interview_summary": {{
    "candidate_background": string,
    "job_fit_analysis": string
  }},
  "interview_exchange": [
    {{
      "question_number": number,
      "interviewer_question": string,
      "candidate_response": {{
        "situation": string,
        "task": string,
        "action": string,
        "result": string
      }},
      "potential_follow_ups": [
        string,
        string,
        string,
        string
      ]
    }}
  ]
}}

Generate at least 12-15 questions.
Ensure each response strictly follows STAR format with elaborate details for each component.
Include 3-4 potential follow-up questions after each response.
Generate detailed, context-aware responses that demonstrate understanding of both the 
technical and soft skills required for the position.

- Do not deviate from the JSON format. Do not give any extra output apart from a valid JSON. 
- Do not include any markdown or code blocks.
- Do not include any additional text or explanations outside the JSON structure.


Critical Requirements:
1. Start response directly with {{ and end with }}
2. No markdown formatting (```), newline characters (\n), or other special formatting
3. No additional text outside the JSON object
4. Ensure all JSON syntax is valid and properly nested
5. Use proper escaping for quotes and special characters within strings
6. The response should start directly with the opening curly brace
7. Do not add any text before or after the JSON object
8. Start response directly with {{ and end with }}
"""


@app.post("/api/interview-sim")
async def interview_sim(request: InterviewSimulation):
    try:
        if request.model_name == "deepseek-chat":
            prompt = PromptTemplate(
              template=INTERVIEW_SIM_TEMPLATE,
              input_variables=[
                  "resume", "job_description", "interview_type", "interviewer_role",
                  "interviewer_profile", "interview_duration", "interview_description", "user_custom_prompt"
              ]
            )
            rendered_prompt = prompt.format(
                resume=request.resume,
                job_description=request.job_description,
                interview_type=request.interview_type,
                interviewer_role=request.interviewer_role,
                interviewer_profile=request.interviewer_profile,
                interview_duration=request.interview_duration,
                interview_description=request.interview_description,
                user_custom_prompt=request.user_custom_prompt
                )
            
            # deepseek_api_key = get_secret("DEEPSEEK_API_KEY")
            deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
            if not deepseek_api_key:
                raise HTTPException(status_code=500, detail="DeepSeek API key not found in Parameter Store.")
            client = OpenAI(api_key=deepseek_api_key, base_url="https://api.deepseek.com")
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "You are an experienced interviewer conducting an interview. You will simulate a realistic interview"},
                    {"role": "user", "content": rendered_prompt},
                    ],
                    stream=False,
                    temperature=1.3,
                    max_tokens=8000,
                    )
            return {"interview_sim": response.choices[0].message.content}
                
        else: 
          llm = get_llm(request.model_name)
          prompt = PromptTemplate(
              template=INTERVIEW_SIM_TEMPLATE,
              input_variables=[
                  "resume", "job_description", "interview_type",
                  "interviewer_role", "interviewer_profile",
                  "interview_duration", "interview_description", "user_custom_prompt"
              ]
          )
          
          chain = prompt | llm
          response = chain.invoke({
              "resume": request.resume,
              "job_description": request.job_description,
              "interview_type": request.interview_type,
              "interviewer_role": request.interviewer_role,
              "interviewer_profile": request.interviewer_profile,
              "interview_duration": request.interview_duration,
              "interview_description": request.interview_description,
              "user_custom_prompt": request.user_custom_prompt
          })
          
          return {"interview_sim": response.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models")
async def get_available_models():
    return {"models": GROQ_MODELS}

@app.get("/")
async def root():
    return {"message": "Hello, World!"}