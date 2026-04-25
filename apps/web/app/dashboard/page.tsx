import { projectRepo } from '@repo/db/projects'
import { Table } from '@repo/ui/table'
import type { Project } from '@repo/api-contracts/projects'

/**
 * Server Component: fetches data on the server and passes it to shared UI.
 *
 * Note: In a real app you'd get the current user from the session and
 * filter by ownerId.  Here we list all seed projects for simplicity.
 */
export default async function DashboardPage() {
  const projects: Project[] = await projectRepo.listForUser(
    '550e8400-e29b-41d4-a716-446655440001',
  )

  const columns = [
    { key: 'name' as const, header: 'Name' },
    { key: 'description' as const, header: 'Description' },
    { key: 'createdAt' as const, header: 'Created' },
  ]

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Projects</h1>
      <Table data={projects} columns={columns} emptyMessage="No projects yet." />
    </main>
  )
}
