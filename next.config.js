/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Le build ne doit jamais échouer à cause du lint en CI (Vercel/Render)
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
