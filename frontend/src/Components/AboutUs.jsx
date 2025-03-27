import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { LinkedIn, Language, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const aboutUsContent = {
  about: {
    title: "About Us",
    description:
      "At CareerSynth.AI, we are a dedicated team of passionate engineers driven by a shared vision: empowering individuals to achieve their career aspirations with cutting-edge AI technology. Combining expertise in full-stack development and artificial intelligence, we’ve built a platform that simplifies job hunting, enhances career growth, and prepares you for success in an ever-evolving professional landscape.",
  },
  mission: {
    title: "Our Mission 🚀",
    description:
      "We aim to eliminate the challenges we faced during our own job searches—jumping between multiple tools and resources for tasks that should be seamless and unified. At CareerSynth.AI, we believe career growth should be accessible, efficient, and tailored to each individual.",
  },
  vision: {
    title: "Our Vision 🌏",
    description:
      "To revolutionize the way people approach career development, empowering individuals with tools that combine cutting-edge AI and intuitive design, making success within reach for everyone.",
  },
  developers: [
    {
      name: "Sagar Gopalasetti",
      role: "Fullstack Engineer",
      description:
        "Dedicated and versatile full-stack developer with a passion for creating efficient and user-friendly web applications. With 3 years of professional experience in technologies like React, Next.js, Node.js, MySQL, PostgreSQL, and MongoDB.",
      linkedin: "https://www.linkedin.com/in/sagar-gopalasetti/",
      portfolio: "https://sagar-gopalasetti.github.io/react-portfolio/",
    },
    {
      name: "Balu Harshavardan Koduru",
      role: "AI/ML Engineer",
      description:
        "AI Engineer with expertise in building scalable generative AI applications and LLM-powered systems. Passionate about leveraging AI technology to create practical solutions that enhance professional development and career growth.",
      linkedin: "https://www.linkedin.com/in/balu-koduru/",
      portfolio: "https://balu-koduru-portfolio.netlify.app",
    },
  ],
};

const AboutUs = () => {
  const pageEndRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToEnd = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      pageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      setIsAtBottom(isBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 10, sm: 12, md: 18 },
        mb: 8,
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          mb: { xs: 6, sm: 8 },
          py: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 4 },
          backgroundColor: "#00254D",
          color: "white",
          borderRadius: "12px",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            mb: 3,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "4rem" },
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {aboutUsContent.about.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#B3C0D6",
            fontSize: { xs: "1rem", sm: "1.2rem" },
            mx: "auto",
            maxWidth: 1000,
            lineHeight: 1.8,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {aboutUsContent.about.description}
        </Typography>
      </Box>

      {/* Mission and Vision */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: { xs: "center", md: "space-between" },
          mb: 8,
        }}
      >
        {[aboutUsContent.mission, aboutUsContent.vision].map((section, index) => (
          <Card
            key={index}
            sx={{
              flex: "1 1 calc(50% - 16px)",
              minWidth: "280px",
              p: { xs: 3, sm: 4 },
              backgroundColor: "#F7F9FC",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.5rem", sm: "1.8rem" },
                  color: "#00254D",
                  mb: 2,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {section.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#6C7A93",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {section.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Developers */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.8rem", sm: "2rem" },
            color: "#00254D",
            mb: { xs: 4, sm: 6 },
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Meet the Founders 👨🏻‍💻
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 4 },
          }}
        >
          {aboutUsContent.developers.map((dev, index) => (
            <Card
              key={index}
              sx={{
                flex: "1 1 280px",
                maxWidth: "600px",
                p: { xs: 3, sm: 4 },
                borderRadius: "16px",
                backgroundColor: "white",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#00254D",
                    mb: 1,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {dev.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#6C7A93",
                    mb: 2,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {dev.role}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#6C7A93",
                    lineHeight: 1.8,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {dev.description}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Tooltip title="LinkedIn" arrow>
                    <IconButton
                      component="a"
                      href={dev.linkedin}
                      target="_blank"
                      color="primary"
                    >
                      <LinkedIn />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Portfolio" arrow>
                    <IconButton
                      component="a"
                      href={dev.portfolio}
                      target="_blank"
                      color="inherit"
                    >
                      <Language />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Disclaimer */}
      <Box
        ref={pageEndRef}
        sx={{
          mt: 8,
          py: 2,
          textAlign: "center",
          px: { xs: 2, sm: 4 },
          backgroundColor: "#F7F9FC",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#6C7A93",
            fontSize: "0.8rem",
            mx: "auto",
            maxWidth: 1500,
            lineHeight: 1.6,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          CareerSynth.AI is committed to providing innovative career tools, but
          individual results may vary. Always review and refine the outputs for
          optimal use.
        </Typography>
        
      </Box>
      <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 4, fontFamily: "'Poppins', sans-serif", fontSize: "1.2rem" }}>
      Made with love from Buffalo, NY{" "}
      <Box
        component="img"
        src="/bull.png" // Replace with your image path
        alt="love"
        sx={{
          width: 26,
          height: 26,
          mx: 1,
          // my:1 // Adds spacing around the image
        }}
      />
    </Typography>

      {/* Floating Arrow */}
      <IconButton
        onClick={scrollToEnd}
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          backgroundColor: "#00254D",
          color: "white",
          "&:hover": {
            backgroundColor: "#004080",
          },
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        {isAtBottom ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>
    </Container>
  );
};

export default AboutUs;