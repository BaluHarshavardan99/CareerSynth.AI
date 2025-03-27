import React from "react";
import { Helmet } from "react-helmet";

const SEOComponent = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://careersynth-ai.netlify.app/" />
      <meta property="og:image" content="https://careersynth-ai.netlify.app/assets/og-image.jpg" />
      <link rel="canonical" href="https://careersynth-ai.netlify.app/" />
    </Helmet>
  );
};

export default SEOComponent;