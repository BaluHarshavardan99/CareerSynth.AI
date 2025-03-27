import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const InterviewSimulationDashboard = ({ simulationData }) => {
  // Parse the JSON string, removing markdown characters
  const parsedData = JSON.parse(
    simulationData.interview_sim.replace(/```/g, "")
  );

  const {
    interview_metadata,
    interview_summary,
    interview_exchange,
  } = parsedData;

  return (
    <Box sx={{ width: "100%", mt: 4, mb:4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          bgcolor: "white",
          color: "black",
          borderRadius: "8px",
        }}
      >
        {/* Interview Metadata */}
        <Typography variant="h5" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif", color: "text.secondary", fontWeight: "bold" }}>
          Interview Simulation Results
        </Typography>
        <Divider sx={{ my: 2}} />
        <Box >
          <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>
            <strong>Position:</strong> {interview_metadata.position}
          </Typography>
          <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>
            <strong>Interview Type:</strong> {interview_metadata.interview_type}
          </Typography>
          <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>
            <strong>Interviewer:</strong> {interview_metadata.interviewer}
          </Typography>
          <Typography variant="subtitle1" sx={{fontFamily: "'Poppins', sans-serif"}}>
            <strong>Duration:</strong> {interview_metadata.duration}
          </Typography>
        </Box>
        <Divider sx={{ my: 2}} />

        {/* Interview Summary */}
        <Box>
          <Typography variant="h6" sx={{ color: "#64557e", mb: 1, fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}>
            Interview Summary
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontFamily: "'Poppins', sans-serif" }}>
            <strong>Candidate Background:</strong>{" "}
            {interview_summary.candidate_background}
          </Typography>
          <Typography variant="body1" sx={{fontFamily: "'Poppins', sans-serif"}}>
            <strong>Job Fit Analysis:</strong>{" "}
            {interview_summary.job_fit_analysis}
          </Typography>
        </Box>
        <Divider sx={{ my: 2}} />

        {/* Interview Exchange */}
        <List >
          {interview_exchange.map((exchange, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <ListItem
                sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
              >
                <Typography variant="h6" sx={{ color: "#2972b6", mb: 1, fontFamily: "'Poppins', sans-serif",fontWeight: "bold" }}>
                  Question {exchange.question_number}:
                </Typography>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: "bold", color: "#e17411", fontFamily: "'Poppins', sans-serif" }}>
                      {exchange.interviewer_question}
                    </Typography>
                  }
                />
              </ListItem>

              {/* Candidate Response - STAR Format */}
              <Box sx={{ pl: 4, mt: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#0291db", fontWeight: "bold", mb: 1, fontFamily: "'Poppins', sans-serif" }}
                >
                  Candidate Response:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Situation:</strong> {exchange.candidate_response.situation}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Task:</strong> {exchange.candidate_response.task}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Action:</strong> {exchange.candidate_response.action}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Result:</strong> {exchange.candidate_response.result}
                </Typography>
              </Box>

              {/* Potential Follow-Up Questions */}
              <Box sx={{ pl: 4, mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#e91e63", fontWeight: "bold", mb: 1, fontFamily: "'Poppins', sans-serif" }}
                >
                  Potential Follow-Up Questions:
                </Typography>
                <List sx={{ listStyleType: "disc", pl: 4 }}>
                  {exchange.potential_follow_ups.map((question, qIdx) => (
                    <ListItem
                      key={qIdx}
                      sx={{ display: "list-item" }}
                    >
                      {question}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default InterviewSimulationDashboard;
