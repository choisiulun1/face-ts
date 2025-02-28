/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wvgzaimadmppquqbufpl.supabase.co",
        pathname: "/storage/v1/object/public/photos/**",
      },
    ],
  },
};

export default nextConfig;
