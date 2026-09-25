/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export. The app is entirely client-side - no API routes, no server
  // actions - so this produces a plain folder of HTML/CSS/JS in out/ that any
  // host can serve, instead of relying on Vercel detecting Next.js correctly.
  output: "export",
};

export default nextConfig;
