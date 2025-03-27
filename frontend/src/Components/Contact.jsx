import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

const Contact = React.forwardRef((props, ref) => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_u59q6nv", // Replace with your actual service ID
        "template_alzlog8", // Replace with your actual template ID
        form.current,
        "DncPXcnduNbBQmH6k" // Replace with your actual public key
      )
      .then(
        (result) => {
          console.log("SUCCESS!", result.status, result.text);
          alert("Email sent successfully!");
        },
        (error) => {
          console.log("FAILED...", error.text);
          alert("Failed to send email.");
        }
      );
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, fontFamily: "'Poppins', sans-serif" }}
    >

    <Box textAlign="center" sx={{ mb: 6, mt: 15 }}>
      <Typography
        variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#2E3B55",
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
          }}
      >
        Get in Touch
      </Typography>
       <Typography
                variant="body1"
                sx={{
                    textAlign: "center",
                  color: "#6C7A93",
                  fontSize: "1.2rem",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Tell us how Awesome we are! ❤️
              </Typography>

      

      <form ref={form} onSubmit={sendEmail}>
        <Box
          sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 3,
          mb: 6,
            mt: 6,
          p: 4,
          backgroundColor: "#F7F9FC",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        }}
        >
          <TextField
            name="from_name"
            label="Name"
            variant="outlined"
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#2E3B55",
                },
              },
            }}
          />

          <TextField
            name="from_email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#2E3B55",
                },
              },
            }}
          />

          <TextField
            name="message"
            label="Message"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#2E3B55",
                },
              },
            }}
          />

          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#2E3B55",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#4B5E7A",
                },
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </form>
      </Box>
    </Container>
    
  );
});

export default Contact;
