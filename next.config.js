/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Keep the native SQLite addon and the generated Prisma client out of the
  // bundler. Without this, Turbopack tries to bundle better-sqlite3's native
  // .node binary on every route that touches the DB, which makes dev compiles
  // crawl. These run only on the server, so they should stay external.
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3'],
}

module.exports = nextConfig
