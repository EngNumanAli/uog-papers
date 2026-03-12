// This file is no longer needed with email/password auth
// Kept here to avoid 404 errors from old magic links
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/login`)
}
