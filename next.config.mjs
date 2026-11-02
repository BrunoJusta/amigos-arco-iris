/** @type {import('next').NextConfig} */
const nextConfig = {
  // O motor da app arranca uma vez; o modo estrito do React em desenvolvimento arrancava-o duas vezes.
  reactStrictMode: false,
  async headers() {
    return [
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }, { key: 'Service-Worker-Allowed', value: '/' }] },
      { source: '/personagens/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }] },
    ];
  },
};
export default nextConfig;
