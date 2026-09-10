/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@eduverse/api', '@eduverse/types', '@eduverse/validation', '@eduverse/config', '@eduverse/utils'],
}

module.exports = nextConfig
