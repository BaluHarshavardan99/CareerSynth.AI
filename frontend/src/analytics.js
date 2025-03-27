// src/analytics.js

export const trackPageView = (url) => {
    if (window.gtag) {
      window.gtag('config', 'G-E998K3VF52', {
        page_path: url,
      });
    }
  };