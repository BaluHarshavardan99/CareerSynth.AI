import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextareaAutosize,
  // CircularProgress,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import { useSelector, useDispatch } from "react-redux";
import { setJobInput, setResumeFile, setParsedResumeText } from "../Store/store";
import Loading from "./Loading";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const apiURL =  process.env.REACT_APP_API_ENDPOINT;



const CoverLetter = ({ mode, models }) => {
  const dispatch = useDispatch();
  const { jobInput, resumeFile, parsedResumeText } = useSelector((state) => state.job);

  const [coverLetter, setCoverLetter] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = React.useState(false);
  const [customPrompt, setCustomPrompt] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState(models[1] || "");
  const [errorFields, setErrorFields] = React.useState({ jobInput: false, resumeFile: false, selectedModel: false });

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
      dispatch(setParsedResumeText(""));
    }
  };

  const validateFields = () => {
    const newErrorFields = {
      jobInput:!jobInput,
      resumeFile:!resumeFile,
      selectedModel:!selectedModel,
    };
    setErrorFields(newErrorFields);

    return!Object.values(newErrorFields).some((field) => field);
  }


  const handleGenerate = async () => {
    if (!validateFields()) {
      return;
    }


    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
      resume: parsedResumeText,
      job_description: jobInput,
      model_name: selectedModel,
      user_custom_prompt: isCustomPrompt ? customPrompt : "",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    try {
      setIsLoading(true);
      setCoverLetter(null); // Clear the previous cover letter

      


      const response = await fetch(
        `${apiURL}/api/generate-cover-letter`,
        requestOptions
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP Error: ${response.status} - ${errorDetails}`);
      }

      const data = await response.json();
      setCoverLetter(data.cover_letter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("An error occurred while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb:4, fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 6, mt: 15 }}>
        <Typography variant="h2" sx={{ fontWeight: "bold", color: "#2E3B55", mb: 2, fontFamily: "'Poppins', sans-serif" }}>
          Build Your Cover Letter Effortlessly
        </Typography>
        <Typography variant="body1" sx={{ color: "#6C7A93", fontSize: "1.2rem", fontFamily: "'Poppins', sans-serif" }}>
          Create a tailored cover letter with AI in just a few simple steps.
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
          "Customize the letter with an optional prompt.",
          "Select a model and click Generate.",
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
            <Typography variant="h6" sx={{ color: "#6C7A93", fontFamily: "'Poppins', sans-serif" }}>
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

      {/* Generate Button */}
      {isLoading ? (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"// Ensure the container spans the full height
  >
    <Loading />
  </Box>
) : (
  <Box textAlign="center">
    <Button
      variant="contained"
      size="large"
      onClick={handleGenerate}
      disabled={isLoading}
      sx={{
        width: "100%",
        py: 1.5,
        fontSize: "1rem",
        backgroundColor: "#2E3B55",
        "&:hover": { backgroundColor: "#4B5E7A" },
      }}
    >
      <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}> Generate Cover Letter</Typography>
    </Button>
  </Box>
)}

      
      {/* Cover Letter */}
      {coverLetter && (
        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: "12px",
            backgroundColor: "#F7F9FC",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            whiteSpace: "pre-line",
            lineHeight: 1.8,
          }}
        >
          <Typography variant="body1" sx={{ color: "#2E3B55" }}>
            {coverLetter}
          </Typography>
        </Box>
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

export default CoverLetter;
