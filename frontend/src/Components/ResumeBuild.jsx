import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  // CircularProgress,
  Switch,
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import { useSelector, useDispatch } from "react-redux";
import {
  setJobInput,
  setResumeFile,
  setParsedResumeText,
} from "../Store/store";
import ResumeBuilderDashboard from "./ResumeOptimize/ResumeOptimizeDashboard";
import Loading from "./Loading";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const apiURL = process.env.REACT_APP_API_ENDPOINT;

const ResumeBuilder = ({ mode, models }) => {
  const dispatch = useDispatch();
  const { jobInput, resumeFile, parsedResumeText } = useSelector(
    (state) => state.job
  );

  const [optimizedResume, setOptimizedResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [resumeSection, setResumeSection] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[1] || "");
  const [errorFields, setErrorFields] = useState({
    jobInput: false,
    resumeFile: false,
    resumeSection: false,
  });

  React.useEffect(() => {
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
      alert("Currently, only PDF files are supported.");
    }
  };

  const handleOptimizeResume = async () => {
    const newErrorFields = {
      jobInput: !jobInput,
      resumeFile: !resumeFile,
      resumeSection: !resumeSection,
    };
    setErrorFields(newErrorFields);

    if (Object.values(newErrorFields).some((field) => field)) {
      return;
    }

    const body = JSON.stringify({
      resume: parsedResumeText,
      job_description: jobInput,
      model_name: selectedModel,
      user_custom_prompt: isCustomPrompt ? customPrompt : "",
      resume_section: resumeSection,
    });

    try {
      setIsLoading(true);
      setOptimizedResume(null)
      const response = await fetch(
        `${apiURL}/api/optimize-resume`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const result = await response.json();

      console.log("Optimization Result:", result);

    // Parse the JSON strings in the response
    const parsedResumeOptimization = JSON.parse(result.Resume_Optimization);
    const parsedRemainingResults = JSON.parse(result.Remaining_Results);

    console.log(parsedRemainingResults);

    // Combine or process data as needed
    const combinedData = [
      parsedResumeOptimization,
      parsedRemainingResults,
    ]

    // Set the optimized resume data
    console.log(combinedData);
    setOptimizedResume(combinedData);
    } catch (error) {
      console.error("Error optimizing resume:", error);
      alert("An error occurred while optimizing the resume. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb:4, fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 6 ,mt: 15 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#2E3B55",
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Optimize Your Resume Seamlessly
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#6C7A93",
            fontSize: "1.2rem",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Refine and tailor your resume with AI in just a few simple steps.
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
          "Select a specific section to optimize.",
          "Add a custom prompt (optional).",
          "Click Optimize to refine your resume.",
        ].map((step, index) => (
          <Box
            key={index}
            sx={{
              flex: "1 1 100px",
              textAlign: "center",
              p: 2,
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


      {/* Job Description */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}>
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
          <FormHelperText sx={{ color: "red", mt: 1 }}>Job description is required.</FormHelperText>
        )}
      </Box>

      {/* Resume Upload */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}>
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
          <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>Upload File</Typography>
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
        {errorFields.resumeFile && (
          <FormHelperText sx={{ color: "red", mt: 1 }}>Resume file is required.</FormHelperText>
        )}
        {resumeFile && (
          <Typography sx={{ mt: 1, fontSize: "14px", color: "#6C7A93", fontFamily: "'Poppins', sans-serif" }}>
            Selected File: {resumeFile.name}
          </Typography>
        )}
      </Box>

      {/* Resume Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}>
          Resume Section to Optimize*
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={resumeSection}
          onChange={(e) => {
            setResumeSection(e.target.value);
            setErrorFields({ ...errorFields, resumeSection: false });
          }}
          error={errorFields.resumeSection}
          helperText={errorFields.resumeSection && "This field is required."}
          placeholder="Enter Section Name "
        />
      </Box>

      {/* Custom Prompt */}
      <Box sx={{ mb: 4 }}>
        <Switch
          checked={isCustomPrompt}
          onChange={(e) => setIsCustomPrompt(e.target.checked)}
        />
        <Typography variant="body1" component="span" sx={{ ml: 2, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}>
          Use Custom Prompt
        </Typography>
        {isCustomPrompt && (
          <TextField
            label="Custom Prompt"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}
      </Box>

      {/* Model Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, color: "#2E3B55", fontFamily: "'Poppins', sans-serif" }}>
          Select AI Model
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={selectedModel}
            label="Model" // Ensure this matches the InputLabel
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setErrorFields({ ...errorFields, selectedModel: false });
            }}
            sx={{ borderColor: errorFields.selectedModel ? "red" : "" }}

          >
            {models.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Optimize Button */}
      {isLoading ? ( <Box
    display="flex"
    justifyContent="center"
    alignItems="center"// Ensure the container spans the full height
  >
    <Loading />
  </Box>) : <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleOptimizeResume}
          disabled={isLoading}
          sx={{
            width: "100%",
            py: 1.5,
            fontSize: "1rem",
            backgroundColor: "#2E3B55",
            "&:hover": { backgroundColor: "#4B5E7A" },
          }}
        >
          <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Optimize Resume
          </Typography>
        </Button>
      </Box>
}
      


      {/* Optimized Resume */}
      {optimizedResume && (
        <ResumeBuilderDashboard optimizationData={optimizedResume} />
      )}
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

export default ResumeBuilder;
