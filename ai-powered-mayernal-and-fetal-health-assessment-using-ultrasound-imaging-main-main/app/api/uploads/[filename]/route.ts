import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params
    const sanitizedFilename = path.basename(filename)
    const filepath = path.join(process.cwd(), 'data', 'uploads', sanitizedFilename)

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: 'Image file not found.' }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filepath)
    const ext = path.extname(sanitizedFilename).toLowerCase()
    let contentType = 'image/png'
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.webp') contentType = 'image/webp'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read image file.' }, { status: 500 })
  }
}
