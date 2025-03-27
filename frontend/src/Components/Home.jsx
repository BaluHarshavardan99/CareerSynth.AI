import React, { useRef } from "react";
import { Box, Button, Typography, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import SEOComponent from "./SEOComponent";

const Home = ({ mode }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const pageEndRef = useRef(null); // Ref to scroll to the bottom

  const scrollToEnd = () => {
    pageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    { 
      title: "Cover Letter Generator", 
      description: "Generate professional cover letters effortlessly.", 
      path: "/coverletter" 
    },
    { 
      title: "Resume Builder", 
      description: "Optimize Resume in minutes.", 
      path: "/resume" 
    },
    { 
      title: "Interview Prep", 
      description: "Ace your interviews with detailed Prep Guidance.", 
      path: "/interview" 
    },
    { 
      title: "Interview Simulation", 
      description: "Get real-time interview scenarios.", 
      path: "/interview-sim" 
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: mode === "light" ? "background.paper" : "background.default",
        textAlign: "center",
        pb: 5,
        mt: 10,
      }}
    >
      {/* Add the SEOComponent */}
      <SEOComponent
        title="CareerSynth.AI - Transform Your Career with AI Tools"
        description="CareerSynth.AI offers powerful AI-driven tools for cover letter generation, resume optimization, and interview preparation. Empower your career today!"
        keywords="CareerSynth.AI, AI career tools, cover letter generator, resume optimization, interview preparation"
      />

      {/* Hero Content */}
      {!isSmallScreen && (
        <Box
          sx={{
            pt: 7,
            px: 4,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3rem", md: "8rem", lg: "8rem" },
              fontWeight: "bold",
              color: "#2E3B55",
              mt: 0,
              mb: 4,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            CareerSynth.AI
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          pt: 1,
          px: 4,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", sm: "2rem", md: "3rem", lg: "3rem" },
            mb: 1.4,
            fontFamily: "'Poppins', sans-serif",
            color: "text.secondary",
            fontWeight: isSmallScreen ? "bold" : "",
          }}
        >
          Your Career, Powered by AI
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1rem", md: "1.25rem", lg: "1.25rem" },
            mb: 3,
            fontFamily: "'Poppins', sans-serif",
            color: "text.secondary",
          }}
        >
          Generate cover letters, optimize resumes, and ace your interviews—all in one place.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/coverletter")}
          sx={{
            px: 3,
            py: 1.5,
            mb: isSmallScreen ? 5 : 7,
            fontFamily: "'Poppins', sans-serif",
            textTransform: "none",
            backgroundColor: "#2E3B55",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Get Started for FREE!!!
        </Button>
      </Box>

      {/* Feature Tiles */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row", // Stack cards on mobile
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          px: 3,
        }}
      >
        {features.map((feature, index) => (
          <Box
            key={index}
            onClick={() => navigate(feature.path)} // Navigate to the respective page
            sx={{
              width: isSmallScreen ? "90%" : "300px", // Use responsive width
              height: isSmallScreen ? "100px" : "150px", // Adjust height for mobile
              backgroundColor: "#2E3B55",
              color: "white",
              borderRadius: "12px", // Slightly more rounded corners
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Softer shadow
              textAlign: "center",
              cursor: "pointer", // Change cursor to indicate it's clickable
              "&:hover": {
                transform: "scale(1.02)", // Subtle zoom effect
                backgroundColor: "#1E2A45",
                transition: "all 0.3s ease-in-out", // Smooth transition
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {feature.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {feature.description}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Down Arrow Button */}
      <IconButton
        onClick={scrollToEnd}
        sx={{
          mt: 4,
          color: "text.secondary",
          "&:hover": { color: theme.palette.primary.main },
        }}
      >
        <KeyboardDoubleArrowDownIcon fontSize="large" />
      </IconButton>

      {/* YouTube Video Section */}
      <Box
        ref={pageEndRef} // Ref to the end of the page
        sx={{
          mt: 8,
          px: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <iframe
          width={isSmallScreen ? "100%" : "560"}
          height="315"
          src="https://www.youtube.com/embed/7f7psp1mZSk"
          title="CareerSynth.AI Demo"
          frameBorder="2"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Box>
    </Box>
  );
};

export default Home;