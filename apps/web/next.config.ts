import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enables more precise tree-shaking by restricting each package to
  // only the files it actually exports. This is important for keeping
  // the Next.js module graph small in a monorepo.
  transpilePackages: ['@repo/ui'],

  // Opt in to Turbopack for faster local dev.
  // Remove this line if you hit Turbopack-specific issues.
  // turbopack: {},

  experimental: {
    // Restricts Server Components to only importing server-safe code.
    // Helps catch accidental client/server boundary violations early.
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
