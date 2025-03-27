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
} from "@mui/material";

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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { strategic_analysis, preparation_guide, questions } = parsedData;

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Strategic Analysis" />
          <Tab label="Preparation Guide" />
          <Tab label="Interview Questions" />
        </Tabs>

        {/* Strategic Analysis */}
        {currentTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Experience Alignment</Typography>
            {strategic_analysis?.experience_alignment?.matching_experiences?.map((exp, index) => (
              <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1">{exp.requirement}</Typography>
                <Typography color="text.secondary">{exp.matching_experience}</Typography>
                <Chip
                  label={exp.strength_level}
                  color={exp.strength_level === "High" ? "success" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}

            <Typography variant="h6" gutterBottom>Potential Gaps</Typography>
            {strategic_analysis?.experience_alignment?.potential_gaps?.map((gap, index) => (
              <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1" color="error">{gap.gap}</Typography>
                <Typography color="text.secondary">{gap.mitigation_strategy}</Typography>
              </Box>
            ))}

            <Typography variant="h6" gutterBottom>Key Achievements</Typography>
            {strategic_analysis?.experience_alignment?.key_achievements?.map((achievement, index) => (
              <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1">{achievement.achievement}</Typography>
                <Typography color="text.secondary">{achievement.relevance}</Typography>
              </Box>
            ))}

            <Typography variant="h6" gutterBottom>Interview Context</Typography>
            <Box>
              <Typography variant="subtitle1">Interviewer Perspective</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {strategic_analysis?.interview_context?.interviewer_perspective?.key_interests?.map((interest, idx) => (
                  <Typography component="li" key={idx} color="text.secondary">{interest}</Typography>
                ))}
                {strategic_analysis?.interview_context?.interviewer_perspective?.likely_focus_areas?.map((area, idx) => (
                  <Typography component="li" key={idx} color="text.secondary">{area}</Typography>
                ))}
              </Box>

              <Typography variant="subtitle1" gutterBottom>Time Management</Typography>
              <Typography color="text.secondary">
                Introduction: {strategic_analysis?.interview_context?.time_management?.introduction} minutes
              </Typography>
              <Typography color="text.secondary">
                Main Discussion: {strategic_analysis?.interview_context?.time_management?.main_discussion} minutes
              </Typography>
              <Typography color="text.secondary">
                Questions: {strategic_analysis?.interview_context?.time_management?.questions} minutes
              </Typography>
              <Typography color="text.secondary">
                Closing: {strategic_analysis?.interview_context?.time_management?.closing} minutes
              </Typography>

              <Typography variant="subtitle1" gutterBottom>Critical Areas</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {strategic_analysis?.interview_context?.critical_areas?.map((area, idx) => (
                  <Typography component="li" key={idx} color="text.secondary">{area}</Typography>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Preparation Guide */}
        {currentTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Technical Preparation</Typography>
            {preparation_guide?.technical_preparation?.core_concepts?.map((concept, index) => (
              <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1">{concept.concept}</Typography>
                <Typography color="text.secondary">Importance: {concept.importance}</Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {concept.review_materials.map((material, idx) => (
                    <Typography component="li" key={idx} color="text.secondary">{material}</Typography>
                  ))}
                </Box>
              </Box>
            ))}

            <Typography variant="subtitle1" gutterBottom>Practice Exercises</Typography>
            {preparation_guide?.technical_preparation?.practice_exercises?.map((exercise, index) => (
              <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1">{exercise.topic}</Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {exercise.recommended_problems.map((problem, idx) => (
                    <Typography component="li" key={idx} color="text.secondary">{problem}</Typography>
                  ))}
                </Box>
              </Box>
            ))}

            <Typography variant="subtitle1" gutterBottom>System Design</Typography>
            <Typography variant="subtitle2" gutterBottom>Key Considerations:</Typography>
            <Box component="ul" sx={{ borderBottom: "1px solid #eee", pl: 2 }}>
              {preparation_guide?.technical_preparation?.system_design?.key_considerations?.map((consideration, idx) => (
                <Typography component="li" key={idx} color="text.secondary">{consideration}</Typography>
              ))}
            </Box>

            <Typography variant="h6" gutterBottom>Experience Preparation</Typography>
            {preparation_guide?.experience_preparation?.key_projects?.map((project, index) => (
              <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1">Project: {project.project}</Typography>
                <Typography color="text.secondary">Relevance: {project.relevance}</Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Key Points:</Typography>
                  {project.key_points.map((point, idx) => (
                    <Typography component="li" key={idx} color="text.secondary">{point}</Typography>
                  ))}
                  {project.metrics.map((metric, idx) => (
                    <Typography component="li" key={idx} color="text.secondary">{metric}</Typography>
                  ))}
                </Box>
              </Box>
            ))}

            <Typography variant="h6" gutterBottom>Company Preparation</Typography>
            <Typography variant="subtitle2">Industry Trends</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {preparation_guide?.company_preparation?.industry_trends?.map((trend, idx) => (
                <Typography component="li" key={idx} color="text.secondary">{trend}</Typography>
              ))}
            </Box>
            <Typography variant="subtitle2">Company Background</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
             <Typography variant="subtitle1" gutterBottom>Key Points:</Typography>
              {preparation_guide?.company_preparation?.company_background?.key_points?.map((point, idx) => (
                <Typography component="li" key={idx} color="text.secondary">{point}</Typography>
              ))}
              <Typography variant="subtitle1" gutterBottom>Recent Developments:</Typography>
              {preparation_guide?.company_preparation?.company_background?.recent_developments?.map((development, idx) => (
                <Typography component="li" key={idx} color="text.secondary">{development}</Typography>
              ))}
            </Box>

            <Typography variant="subtitle2">Role Specific</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Key Responsibilities:</Typography>
              {preparation_guide?.company_preparation?.role_specific?.key_responsibilities?.map((responsibility, idx) => (
                <Typography component="li" key={idx} color="text.secondary">{responsibility}</Typography>
              ))}
              <Typography variant="subtitle1" gutterBottom>Expected Challenges:</Typography>
              {preparation_guide?.company_preparation?.role_specific?.expected_challenges?.map((challenge, idx) => (
                <Typography component="li" key={idx} color="text.secondary">{challenge}</Typography>
              ))}
            </Box>
          </Box>
        )}

        {/* Questions */}
        {currentTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Guaranteed Questions</Typography>
            {questions?.guaranteed_questions?.map((q, index) => (
              <Box key={index} sx={{ mb: 4, pb: 3, borderBottom: "1px solid #eee" }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>{q.question}</Typography>
                <Typography variant="subtitle2">Answer Framework:</Typography>
                <Box sx={{ pl: 2, borderLeft: "3px solid #1976d2" }}>
                  <Typography sx={{ mb: 1 }}>{q.answer_framework.opening}</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {q.answer_framework.key_points.map((point, idx) => (
                      <Typography component="li" key={idx} color="text.secondary">{point}</Typography>
                    ))}
                  </Box>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{q.answer_framework.conclusion}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default InterviewPrepDashboard;


