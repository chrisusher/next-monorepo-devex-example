import { NextRequest, NextResponse } from 'next/server'
import { getMe } from '@repo/server/users/get-me'

export async function GET(req: NextRequest) {
  try {
    const user = await getMe({ request: req })
    return NextResponse.json(user)
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
