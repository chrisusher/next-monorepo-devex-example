import { NextRequest, NextResponse } from 'next/server'
import { getProject, NotFoundError } from '@repo/server/projects/get-project'

/**
 * GET /api/projects/:id
 *
 * Thin route handler — all logic is delegated to the `@repo/server` use-case.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const project = await getProject({ projectId: id, request: req })
    return NextResponse.json(project)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 })
    }
    if (err instanceof Error && err.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof Error && err.message.startsWith('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
