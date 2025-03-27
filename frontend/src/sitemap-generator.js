const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

// Define your routes
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/coverletter', changefreq: 'weekly', priority: 0.8 },
  { url: '/resume', changefreq: 'weekly', priority: 0.8 },
  { url: '/interview', changefreq: 'weekly', priority: 0.8 },
  { url: '/interview-sim', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 },
];

// Generate sitemap
const generateSitemap = async () => {
  // Resolve the correct path for the sitemap file
  const publicDir = path.resolve(__dirname, '../public');
  const sitemapFile = path.join(publicDir, 'sitemap.xml');

  // Ensure the directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Create and write the sitemap
  const sitemap = new SitemapStream({ hostname: 'https://careersynth-ai.netlify.app/' });
  links.forEach(link => sitemap.write(link));
  sitemap.end();

  const sitemapData = await streamToPromise(sitemap);
  fs.writeFileSync(sitemapFile, sitemapData.toString());
  console.log('Sitemap generated successfully at public/sitemap.xml');
};

generateSitemap();