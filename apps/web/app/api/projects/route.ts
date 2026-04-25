import { NextRequest, NextResponse } from 'next/server'
import { listProjects } from '@repo/server/projects/list-projects'
import { createProjectSchema } from '@repo/api-contracts/projects'
import { projectRepo } from '@repo/db/projects'
import { requireUser } from '@repo/auth/server/require-user'
import { randomUUID } from 'crypto'

/**
 * GET /api/projects
 *
 * The route handler is intentionally thin:
 *  - parse the request
 *  - delegate to a use-case in `@repo/server`
 *  - format the response
 *
 * No business logic lives here.
 */
export async function GET(req: NextRequest) {
  try {
    const projects = await listProjects({ request: req })
    return NextResponse.json(projects)
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * POST /api/projects
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const body = await req.json()
    const input = createProjectSchema.parse(body)

    const project = await projectRepo.create({
      id: randomUUID(),
      name: input.name,
      description: input.description ?? null,
      ownerId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }
}
