import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This API route runs on the SERVER — no CORS issues at all
// Mobile browser → Vercel server → Supabase (server to server = always works)
export async function POST(request: NextRequest) {
  try {
    // Create admin client on server side
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!  // service role — bypasses everything
    )

    const formData = await request.formData()
    const file     = formData.get('file') as File
    const metadata = formData.get('metadata') as string

    if (!file)     return NextResponse.json({ error: 'No file provided' },     { status: 400 })
    if (!metadata) return NextResponse.json({ error: 'No metadata provided' }, { status: 400 })

    const data = JSON.parse(metadata)

    // Upload file — server to server, no CORS
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const filePath = `papers/${fileName}`

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error: storageError } = await supabase.storage
      .from('papers')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (storageError) {
      return NextResponse.json({ error: `Storage: ${storageError.message}` }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('papers')
      .getPublicUrl(filePath)

    // Insert to database
    const { error: dbError } = await supabase.from('papers').insert({
      ...data,
      file_url:    publicUrl,
      file_name:   file.name,
      is_approved: false,
    })

    if (dbError) {
      return NextResponse.json({ error: `Database: ${dbError.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, publicUrl })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
