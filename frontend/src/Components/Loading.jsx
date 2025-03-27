import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const gifTexts = {
  "saute.gif": "Your ingredients are sizzling... stay tuned! 🍳🔥 ",
  "legs_in_water.gif": "Enjoy the flow – we’ve got your career covered! 🏞️🎯",
  "hammock.gif": "Chill out – we’ve got your career building covered! 🌞🎧",
  "rocket.gif": "Launching your career to new heights! 🚀✨",
  "auto.gif": "Transforming your career journey – from ordinary to extraordinary! 🚀",
  "van.gif": "You’re in good hands – let us do the driving. 🚐💖",
  "workout.gif": "The AI’s on the grind, so you can unwind! 🏋️‍♂️🤖",
  "ducks.gif": "Quack, quack, results on track! 🐣...🐥",
};

const Loading = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const gifKeys = Object.keys(gifTexts);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // Start fade-out transition

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % gifKeys.length); // Move to next GIF
        setIsVisible(true); // Start fade-in transition
      }, 500); // Transition duration for fade-out
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [gifKeys.length]);

  const currentGif = gifKeys[currentIndex];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "30vh",
        transition: "opacity 0.5s ease-in-out",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {currentGif && (
        <>
          <Box
            component="img"
            src={`/${currentGif}`} // Replace with the actual path to your GIFs
            alt={gifTexts[currentGif]}
            sx={{
              width: "50%",
              maxWidth: "500px",
              marginBottom: 2,
            }}
          />
          <Typography
            variant="h5"
            textAlign="center"
            fontFamily={"Comic Neue, sans-serif"}
            fontWeight="bold"
          >
            {gifTexts[currentGif]}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default Loading;