import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Chip,
  Alert,
  CircularProgress,
  Card,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const InterviewPrepDashboard = ({ prepData }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (prepData) {
      try {
        const parsedInterviewPrep = JSON.parse(prepData.interview_prep);
        setParsedData(parsedInterviewPrep);
        setError(null);
      } catch (err) {
        console.error("Error parsing interview prep data:", err);
        setError("Failed to parse interview preparation data.");
        setParsedData(null);
      }
    }
  }, [prepData]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!prepData) return null;

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!parsedData) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, fontFamily: "'Poppins', sans-serif" }} color="text.secondary">
          Loading your interview preparation details...
        </Typography>
      </Box>
    );
  }

  const { strategic_analysis, preparation_guide, questions } = parsedData;

  return (
    <Box sx={{ width: "100%", mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={<Typography sx={{fontFamily: "'Poppins', sans-serif"}} ><span role="img" aria-label="Analysis">📊</span> Strategic Analysis</Typography>} />
          <Tab label={<Typography sx={{fontFamily: "'Poppins', sans-serif"}}><span role="img" aria-label="Guide">📘</span> Preparation Guide</Typography>} />
          <Tab label={<Typography sx={{fontFamily: "'Poppins', sans-serif"}}><span role="img" aria-label="Questions">❓</span> Interview Questions</Typography>} />
        </Tabs>

        {/* Strategic Analysis Tab */}
        {currentTab === 0 && (
          <Box
          sx={{
            p: 3,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{fontFamily: "'Poppins', sans-serif"}}>💼 Experience Alignment</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Matching Experiences</Typography>
                {strategic_analysis?.experience_alignment?.matching_experiences?.map((exp, index) => (
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h6" sx={{ color: "#4caf50", mr: 1, fontFamily: "'Poppins', sans-serif" }}>
                        ✅
                      </Typography>
                      <Typography variant="subtitle1" color="success" sx={{fontFamily: "'Poppins', sans-serif"}}>{exp.requirement}</Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mt: 1, fontFamily: "'Poppins', sans-serif" }}>{exp.matching_experience}</Typography>
                    <Chip
                      label={exp.strength_level}
                      color={exp.strength_level === "High" ? "success" : "default"}
                      size="small"
                      sx={{ mt: 1, fontFamily: "'Poppins', sans-serif" }}
                    />
                  </Card>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Potential Gaps  ⚠️</Typography>
                {strategic_analysis?.experience_alignment?.potential_gaps?.map((gap, index) => (
                  <Card key={index}
                    sx={{
                        mb: 2,
                        p: 2,
                        bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                      }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h6" color="error" sx={{ mr: 1 }}>
                        🚨
                      </Typography>
                      <Typography variant="subtitle1" color="error" sx={{fontFamily: "'Poppins', sans-serif"}}>{gap.gap}</Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{gap.mitigation_strategy}</Typography>
                  </Card>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Key Achievements🎖️ </Typography>
                {strategic_analysis?.experience_alignment?.key_achievements?.map((achievement, index) => (
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h6" sx={{ color: "#ffca28", mr: 1 }}>
                        🏆
                      </Typography>
                      <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>{achievement.achievement}</Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mt: 1, fontFamily: "'Poppins', sans-serif"  }}>{achievement.relevance}</Typography>
                  </Card>
                ))}
              </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 3 }} />

            {/* Interview Context */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{fontFamily: "'Poppins', sans-serif"}}>🎯 Interview Context</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Key Interests</Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {strategic_analysis?.interview_context?.interviewer_perspective?.key_interests?.map((interest, idx) => (
                    <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                      {interest}
                    </Typography>
                  ))}
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 2, fontFamily: "'Poppins', sans-serif" }}>Time Management</Typography>
                <Typography color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                  Introduction: {strategic_analysis?.interview_context?.time_management?.introduction} minutes
                </Typography>
                <Typography color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                  Main Discussion: {strategic_analysis?.interview_context?.time_management?.main_discussion} minutes
                </Typography>
                <Typography color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                  Questions: {strategic_analysis?.interview_context?.time_management?.questions} minutes
                </Typography>
                <Typography color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                  Closing: {strategic_analysis?.interview_context?.time_management?.closing} minutes
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Critical Areas</Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {strategic_analysis?.interview_context?.critical_areas?.map((area, idx) => (
                    <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{area}</Typography>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {/* Preparation Guide Tab */}
        {currentTab === 1 && (
          <Box 
          sx={{
            p: 3,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",}}>
            {/* Technical Preparation */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{fontFamily: "'Poppins', sans-serif"}}>🛠️ Technical Preparation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {preparation_guide?.technical_preparation?.core_concepts?.map((concept, index) => (
                  <Card key={index}
                    sx={{
                      mb: 2,
                        p: 2,
                        bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                    }}>
                    <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>{concept.concept}</Typography>
                    <Typography color="text.secondary"sx={{fontFamily: "'Poppins', sans-serif"}}>Importance: {concept.importance}</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {concept.review_materials.map((material, idx) => (
                        <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{material}</Typography>
                      ))}
                    </Box>
                  </Card>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Experience Preparation */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">🚀 Experience Preparation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {preparation_guide?.experience_preparation?.key_projects?.map((project, index) => (
                  <Card key={index} sx={{mb: 2,
                        p: 2,
                        bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)", }}>
                    <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>Project: {project.project}</Typography>
                    <Typography color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>Relevance: {project.relevance}</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {project.key_points.map((point, idx) => (
                        <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{point}</Typography>
                      ))}
                    </Box>
                  </Card>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* Company Preparation */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">🏢 Company Preparation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>Industry Trends</Typography>
                <Card sx={{ mb: 2,
                        p: 2,
                        bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)", }}>
                  {preparation_guide?.company_preparation?.industry_trends?.map((trend, idx) => (
                    <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{trend}</Typography>
                  ))}
                </Card>
                <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>Company Background</Typography>
                <Card sx={{ mb: 2,
                        p: 2,
                        bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)", }}>
                  <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Key Points:</Typography>
                  {preparation_guide?.company_preparation?.company_background?.key_points?.map((point, idx) => (
                    <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{point}</Typography>
                  ))}
                  <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Recent Developments:</Typography>
                  {preparation_guide?.company_preparation?.company_background?.recent_developments?.map((development, idx) => (
                    <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{development}</Typography>
                  ))}

                </Card>
                <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>Role Specific</Typography>
                <Card sx={{ mb: 2,
                        p: 2,
                        bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)", }}>
                  <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Key Responsibilities:</Typography>
                  {preparation_guide?.company_preparation?.role_specific?.key_responsibilities?.map((responsibility, idx) => (
                    <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{responsibility}</Typography>
                  ))}
                  <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Expected Challenges:</Typography>
                  {preparation_guide?.company_preparation?.role_specific?.expected_challenges?.map((challenge, idx) => (
                    <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>{challenge}</Typography>
                  ))}
                </Card>

              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {/* Interview Questions Tab */}
        {currentTab === 2 && (
          <Box sx={{
            p: 3,
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",}} >
            {/* Guaranteed Questions */}
            <Typography variant="h6" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>❓ Guaranteed Questions</Typography>
            {questions?.guaranteed_questions?.map((q, index) => (
              <Card key={index}
                sx={{
                  mb: 4,
                  p: 3,
                  bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif" }}>{q.question}</Typography>
                <Typography variant="subtitle2" sx={{fontFamily: "'Poppins', sans-serif"}}>Answer Framework:</Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography sx={{ mb: 1, fontFamily: "'Poppins', sans-serif" }}>{q.answer_framework.opening}</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {q.answer_framework.key_points.map((point, idx) => (
                      <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                        {point}
                      </Typography>
                    ))}
                  </Box>
                  <Typography color="text.secondary" sx={{ mt: 1, fontFamily: "'Poppins', sans-serif" }}>
                    {q.answer_framework.conclusion}
                  </Typography>
                </Box>
              </Card>
            ))}

            {/* Likely Questions */}
            <Typography variant="h6" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>🔮 Likely Questions</Typography>
            {questions?.likely_questions?.map((q, index) => (
              <Card key={index} sx={{ mb: 4,
                  p: 3,
                  bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)", }}>
                <Typography variant="subtitle1" sx={{ mb: 2,fontFamily: "'Poppins', sans-serif" }}>{q.question}</Typography>
                <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>Answer Framework:</Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography sx={{ mb: 1, fontFamily: "'Poppins', sans-serif" }}>{q.answer_framework.opening}</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {q.answer_framework.key_points.map((point, idx) => (
                      <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                        {point}
                      </Typography>
                    ))}
                  </Box>
                  <Typography color="text.secondary" sx={{ mt: 1, fontFamily: "'Poppins', sans-serif" }}>
                    {q.answer_framework.conclusion}
                  </Typography>
                </Box>
              </Card>
            ))}

            {/* Preparation Questions */}
            <Typography variant="h6" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>📋 Preparation Questions</Typography>
            <Card sx={{ mb: 4,
                  p: 3,
                  bgcolor: "#FFFFFF",
                        border: "1px solid #DDD",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)", }}>
              <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Technical Review</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {questions?.preparation_questions?.technical_review?.map((item, idx) => (
                  <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                    {item}
                  </Typography>
                ))}
              </Box>
              <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Project Discussion</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {questions?.preparation_questions?.project_discussion?.map((project, idx) => (
                  <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                    {project}
                  </Typography>
                ))}
              </Box>
              <Typography variant="subtitle1" gutterBottom sx={{fontFamily: "'Poppins', sans-serif"}}>Metrics to Remember</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {questions?.preparation_questions?.metrics_to_remember?.map((metric, idx) => (
                  <Typography component="li" key={idx} color="text.secondary" sx={{fontFamily: "'Poppins', sans-serif"}}>
                    {metric}
                  </Typography>
                ))}
              </Box>
            </Card>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default InterviewPrepDashboard;
