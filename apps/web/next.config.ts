import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enables more precise tree-shaking by restricting each package to
  // only the files it actually exports. This is important for keeping
  // the Next.js module graph small in a monorepo.
  transpilePackages: ['@repo/ui'],

  // In Next.js 16, Turbopack is the stable default for `next dev`.
  // Use `next dev --webpack` if you need to fall back to webpack.

  // Restricts Server Components to only importing server-safe packages.
  // Helps catch accidental client/server boundary violations early.
  serverExternalPackages: [],
}

export default nextConfig
