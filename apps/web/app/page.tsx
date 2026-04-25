export default function HomePage() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Next Monorepo DevEx Example</h1>
      <p className="text-gray-600 mb-6">
        This repository demonstrates a scalable, high-performance architecture for large Next.js
        monorepos using pnpm workspaces and Turborepo.
      </p>
      <nav>
        <a
          href="/dashboard"
          className="inline-block rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700"
        >
          View Dashboard →
        </a>
      </nav>
    </main>
  )
}
