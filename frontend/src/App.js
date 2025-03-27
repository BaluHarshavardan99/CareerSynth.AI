import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CoverLetter from "./Components/CoverLetter";
import ResumeBuilder from "./Components/ResumeBuild";
import InterviewPrep from "./Components/InterviewPrep";
import Home from "./Components/Home";
import InterviewSimulation from "./Components/InterviewSimulator";
import Contact from "./Components/Contact";
import AboutUs from "./Components/AboutUs";
import { trackPageView } from "./analytics";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Box,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {Menu } from "@mui/icons-material";

const apiURL = process.env.REACT_APP_API_ENDPOINT;
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname); // Track the current path
  }, [location]);

  return null; // This component doesn't render anything
};


const App = () => {
  const [mode] = useState("light"); // For theme toggle
  const [drawerOpen, setDrawerOpen] = useState(false); // For hamburger menu
  const [models, setModels] = useState([]); // To store the models
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Fetch models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      try {
        const response = await fetch(
          `${apiURL}/api/models`,
          requestOptions
        );
        const data = await response.json();
        setModels(data.models); // Set the models in state
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  // const handleToggleMode = () => {
  //   setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  // };

  const handleNavigate = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="default">
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.5rem 1rem",
    }}
  >
    {isSmallScreen && (
      <IconButton
        color="inherit"
        onClick={() => setDrawerOpen(true)}
        edge="start"
      >
        <Menu />
      </IconButton>
    )}

    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
      {isSmallScreen ? (
        <Box
          component="span"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "2.3rem",
            fontWeight: "bold",
            color: "#2E3B55",
          }}
        >
          CareerSynth.AI
        </Box>
      ) : (
        <List
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: 0,
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.1rem",
          }}
        >
          <ListItemButton onClick={() => handleNavigate("/")}>
            Home
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigate("/coverletter")}>
            Cover Letter
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigate("/resume")}>
            Resume Builder
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigate("/interview")}>
            Interview Prep
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigate("/interview-sim")}>
            Interview Simulation
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigate("/about-us")}>
            About Us
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigate("/contact")}>
            Contact Us
          </ListItemButton>
        </List>
      )}
    </Box>
    {/* Toggle Mode Button can go here */}
  </Box>
</AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          <ListItem button onClick={() => handleNavigate("/")}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate("/coverletter")}>
            <ListItemText primary="Cover Letter" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate("/resume")}>
            <ListItemText primary="Resume Builder" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate("/interview")}>
            <ListItemText primary="Interview Prep" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate("/interview-sim")}>
            <ListItemText primary="Interview Simulation" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate("/about-us")}>
            <ListItemText primary="About Us" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate("/contact")}>
            <ListItemText primary="Contact Us" />
          </ListItem>
        </List>
      </Drawer>
      <RouteTracker /> {/* Add the Route Tracker component */}
      <Routes>
        <Route path="/" element={<Home mode={mode} models={models} />} />
        <Route
          path="/coverletter"
          element={<CoverLetter mode={mode} models={models} />}
        />
        <Route
          path="/resume"
          element={<ResumeBuilder mode={mode} models={models} />}
        />
        <Route
          path="/interview"
          element={<InterviewPrep mode={mode} models={models} />}
        />
        <Route
          path="/interview-sim"
          element={<InterviewSimulation mode={mode} models={models} />}
        />
        <Route path="/contact" element={<Contact mode={mode} />} />
        <Route path="/about-us" element={<AboutUs mode={mode} />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
