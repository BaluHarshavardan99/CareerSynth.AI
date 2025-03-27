import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ResumeBuilderDashboard = ({ optimizationData }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [parsedData, setParsedData] = useState({ section_1: null, section_2: null, section_3: null });
  const [error, setError] = useState(null);

    useEffect(() => {
      if (optimizationData) {
        try {
          const [resumeOptimization, remainingResults] = optimizationData;
          const section_1 = resumeOptimization?.analysis_results?.section_1 || null;
          const section_2 = remainingResults?.analysis_results?.section_1 || null;
          const section_3 = remainingResults?.analysis_results?.section_2 || null;
          setParsedData({ section_1, section_2, section_3 });
          setError(null);
        } catch (err) {
          console.error("Error parsing optimization data:", err);
          setError("Failed to parse resume optimization data.");
        }
      }
    }, [optimizationData]); // Only dependency is `optimizationData`
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!optimizationData) return null;

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!parsedData.section_1 && !parsedData.section_2 && !parsedData.section_3) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography color="text.secondary">Loading optimization details...</Typography>
      </Box>
    );
  }

  const { section_1, section_2, section_3 } = parsedData;


  return (
    <Box sx={{ width: "100%", mt: 4, fontFamily: "'Poppins', sans-serif" }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          bgcolor: "#F7F9FC",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { backgroundColor: "#2E3B55" } }}
        >
          <Tab
            label={section_1?.title || "Existing Points"}
            sx={{ color: currentTab === 0 ? "#2E3B55" : "#6C7A93", fontFamily: "'Poppins', sans-serif" }}
          />
          <Tab
            label={section_2?.title || "Suggested Points"}
            sx={{ color: currentTab === 1 ? "#2E3B55" : "#6C7A93", fontFamily: "'Poppins', sans-serif" }}
          />
          <Tab
            label={section_3?.title || "Keyword Analysis"}
            sx={{ color: currentTab === 2 ? "#2E3B55" : "#6C7A93", fontFamily: "'Poppins', sans-serif" }}
          />
        </Tabs>

        {/* Existing Points Optimization */}
        {currentTab === 0 && (
          <Box>
            {section_1?.subsections?.map((subsection, idx) => (
              <Accordion key={idx} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#2E3B55" }} />}>
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "#2E3B55" }}>{subsection.subsection_name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {subsection.points?.map((point, index) => (
                    <Card
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "#FFB74D", fontFamily: "'Poppins', sans-serif" }}>
                        Original:
                      </Typography>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>{point.original}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="h6" sx={{ color: "#4CAF50", fontFamily: "'Poppins', sans-serif" }}>
                        Improved:
                      </Typography>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>{point.improved}</Typography>
                      <Typography color="text.secondary" sx={{ mt: 1, fontFamily: "'Poppins', sans-serif" }}>
                        Reasoning: {point.reasoning}
                      </Typography>
                    </Card>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {/* Suggested New Points */}
        {currentTab === 1 && (
          <Box>
            {section_2?.suggestions?.map((suggestion, idx) => (
              <Card
                key={idx}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "#FFFFFF",
                  border: "1px solid #DDD",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography sx={{ color: "#4CAF50", fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}>
                  {suggestion.bullet_point}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  {suggestion.rationale}
                </Typography>
                <Typography color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  {suggestion.alignment}
                </Typography>
              </Card>
            ))}
          </Box>
        )}

        {/* Keyword Analysis */}
        {currentTab === 2 && (
          <Box>
            {section_3?.keywords?.map((keyword, idx) => (
              <Card
                key={idx}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: keyword.present_in_resume === "Yes" ? "#E8F5E9" : "#FFEBEE",
                  border: "1px solid #DDD",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography
                  sx={{
                    color: keyword.present_in_resume === "Yes" ? "#4CAF50" : "#F44336",
                    fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                  }}
                >
                  {keyword.key_term}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  <b>Present in Resume:</b> {keyword.present_in_resume}
                </Typography>
                <Typography color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  <b>Recommendation: </b>{keyword.recommendation}
                </Typography>
                <Typography color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  <b>Placement Reasoning: </b>{keyword.placement_reasoning}
                </Typography>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ResumeBuilderDashboard;
