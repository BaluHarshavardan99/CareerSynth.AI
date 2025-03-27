import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextareaAutosize,
  // CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormHelperText,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  setJobInput,
  setResumeFile,
  setParsedResumeText,
} from "../Store/store";
import * as pdfjsLib from "pdfjs-dist";
import InterviewPrepDashboard from "./InterviewPrep/InterviewPrepDashboard.jsx";
import Loading from "./Loading.jsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
const apiURL = process.env.REACT_APP_API_ENDPOINT;

const InterviewPrep = ({ models }) => {
  const dispatch = useDispatch();
  const { jobInput, resumeFile, parsedResumeText } = useSelector(
    (state) => state.job
  );

  const [interviewer, setInterviewer] = useState("");
  const [duration, setDuration] = useState("");
  // const [interviewType, setInterviewType] = useState("");
  const [description, setDescription] = useState("");
  const [interviewerProfile, setInterviewerProfile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [selectedModel, setSelectedModel] = useState(models[1] || "");
  const [errorFields, setErrorFields] = useState({
    jobInput: false,
    resumeFile: false,
    interviewer: false,
    duration: false,
    description: false,
  });



  useEffect(() => {
    if (models.length > 0 && !models.includes(selectedModel)) {
      setSelectedModel(models[1]);
    }
  }, [models, selectedModel]);

  const extractTextFromPdf = async (file) => {
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let extractedText = "";
        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          extractedText += pageText + "\n";
        }
        dispatch(setParsedResumeText(extractedText.trim()));
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      alert("Failed to parse PDF. Please ensure the file is valid.");
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    dispatch(setResumeFile(file));

    if (file.type === "application/pdf") {
      extractTextFromPdf(file);
    } else {
      dispatch(setParsedResumeText(""));
    }
  };

  const validateFields = () => {
    const newErrorFields = {
      jobInput: !jobInput,
      resumeFile: !resumeFile,
      interviewer: !interviewer,
      duration: !duration,
      description: !description,
    };
    setErrorFields(newErrorFields);

    return !Object.values(newErrorFields).some((field) => field);
  };




  const handleFormSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const interviewDetails = {
      resume: parsedResumeText,
      job_description: jobInput,
      // interview_type: interviewType,
      interviewer_role: interviewer,
      interviewer_profile: interviewerProfile,
      interview_duration: duration,
      interview_description: description,
      model_name: selectedModel,
      user_custom_prompt: customPrompt,
    };

    try {
      setIsLoading(true);
      setInterviewPrep(null);
      const response = await fetch(
        `${apiURL}/api/interview-prep`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(interviewDetails),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP Error: ${response.status} - ${errorDetails}`);
      }

      const result = await response.json();
      console.log("Interview Prep Result:", result);
      setInterviewPrep(result);
    } catch (error) {
      console.error("Error during submission:", error);
      alert(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb:4, fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 6, mt: 15 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#2E3B55",
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Interview Preparation Made Easy
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#6C7A93",
            fontSize: "1.2rem",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Plan your interview effectively with tailored preparation.
        </Typography>
      </Box>

      


      {/* Steps */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 3,
          mb: 6,
          p: 4,
          backgroundColor: "#F7F9FC",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        {[
          "Paste the job description below.",
          "Upload your resume in PDF format.",
          "Fill in interview details.",
          "Click submit for tailored preparation.",
        ].map((step, index) => (
          <Box
            key={index}
            sx={{
              flex: "1 1 200px",
              textAlign: "center",
              p: 3,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                fontSize: "3rem",
                color: "#2E3B55",
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {index + 1}
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#6C7A93", fontFamily: "'Poppins', sans-serif" }}
            >
              {step}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Form */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 1, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}
        >
          Job Description*
        </Typography>
        <TextareaAutosize
          minRows={5}
          placeholder="Paste Job Description"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: errorFields.jobInput ? "2px solid red" : "1px solid #DDD",
            backgroundColor: "#FBFCFD",
          }}
          value={jobInput}
          onChange={(e) => {
            dispatch(setJobInput(e.target.value));
            setErrorFields({ ...errorFields, jobInput: false });
          }}
        />
        {errorFields.jobInput && (
          <FormHelperText sx={{ color: "red", mt: 1 }}>
            Job description is required.
          </FormHelperText>
        )}

      </Box>

      {/* Resume Upload */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 1, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}
        >
          Upload Resume*
        </Typography>
        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: errorFields.resumeFile ? "red" : "#2E3B55",
            "&:hover": { backgroundColor: "#4B5E7A" },
          }}
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={(e) => {
              handleFileUpload(e.target.files[0]);
              setErrorFields({ ...errorFields, resumeFile: false });
            }}
            accept=".pdf"
          />
        </Button>
        {resumeFile && (
          <Typography
            sx={{
              mt: 1,
              fontSize: "14px",
              color: "#6C7A93",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Selected File: {resumeFile.name}
          </Typography>
        )}

        {errorFields.resumeFile && (
          <FormHelperText sx={{ color: "red", mt: 1 }}>
            Resume is required.
          </FormHelperText>
        )}
      </Box>

      {/* Interview Details */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}
        >
          Interview Details
        </Typography>
        <TextField
          label="Interviewer Designation*"
          placeholder="e.g., Technical Recruiter, Hiring Manager"
          variant="outlined"
          fullWidth
          error={errorFields.interviewer}
          helperText={
            errorFields.interviewer
              ? "Interviewer designation is required."
              : ""
          }
          sx={{ mb: 2 }}
          value={interviewer}
          onChange={(e) => {
            setInterviewer(e.target.value);
            setErrorFields({ ...errorFields, interviewer: false });
          }}
        />
        <TextField
        label="Duration in minutes*"
          placeholder="e.g., 30, 45"
          type="number"
          variant="outlined"
          fullWidth
          error={errorFields.duration}
          helperText={
            errorFields.duration ? "Duration is required." : ""
          }
          sx={{ mb: 2 }}
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            setErrorFields({ ...errorFields, duration: false });
          }}
        />
        {/* <TextField
          label="Interview Type*"
          placeholder="Technical, Behavioral"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={interviewType}
          onChange={(e) => setInterviewType(e.target.value)}
        /> */}
        <TextareaAutosize
          minRows={4}
          placeholder="Interview Description*"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: errorFields.description ? "2px solid red" : "1px solid #DDD",
            backgroundColor: "#FBFCFD",
          }}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrorFields({ ...errorFields, description: false });
          }}
        />
        {errorFields.description && (
          <FormHelperText sx={{ color: "red", mt: 1 }}>
            Description is required.
          </FormHelperText>
        )}
        <TextField
          label="Interviewer Profile (Optional)"
          placeholder="Description of the interviewer"
          variant="outlined"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
          value={interviewerProfile}
          onChange={(e) => setInterviewerProfile(e.target.value)}
        />

        {/* Custom Prompt */}
        <Switch
          checked={isCustomPrompt}
          onChange={(e) => setIsCustomPrompt(e.target.checked)}
        />
        <Typography
          variant="body1"
          component="span"
          sx={{ ml: 2, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}
        >
          Use Custom Prompt
        </Typography>
        {isCustomPrompt && (
          <TextareaAutosize
            minRows={3}
            placeholder="Enter your custom prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #DDD",
              backgroundColor: "#FBFCFD",
            }}
          />
        )}
      </Box>

      {/* Model Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 1, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}
        >
          Select AI Model*
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={selectedModel}
            onChange={(e) => {setSelectedModel(e.target.value);
            console.log(e.target.value)}}
            label="Model"
          >
            {models.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Submit Button */}
      {isLoading ? ( <Box
    display="flex"
    justifyContent="center"
    alignItems="center"// Ensure the container spans the full height
  >
    <Loading />
  </Box>):(<Button
        variant="contained"
        size="large"
        onClick={handleFormSubmit}
        disabled={isLoading}
        sx={{
          width: "100%",
          py: 1.5,
          fontSize: "1rem",
          backgroundColor: "#2E3B55",
          "&:hover": { backgroundColor: "#4B5E7A" },
        }}
      >
        
          Submit Interview Details
       
      </Button>)}
      
      {interviewPrep && <InterviewPrepDashboard prepData={interviewPrep} />}
      {/* Disclaimer */}
<Box
  sx={{
    mt: 4,
    py: 2,
    textAlign: "center",
    backgroundColor: "#F7F9FC",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  }}
>
  <Typography
    variant="body2"
    sx={{
      color: "#6C7A93",
      fontSize: "0.9rem",
      fontFamily: "'Poppins', sans-serif",
    }}
  >
    AI can make mistakes. Please double-check responses.
  </Typography>
</Box>
    </Container>
  );
};

export default InterviewPrep;
