import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

const DATA_DIR = path.join(process.cwd(), 'data')
const CLINICS_FILE = path.join(DATA_DIR, 'clinics.json')

function ensureClinicsFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(CLINICS_FILE)) {
    const defaultPasswordHash = bcrypt.hashSync('demo123456', 10)
    const seed = [
      {
        clinicId: 'CLN-2026-001',
        clinicName: 'St. Jude Women & Children Hospital',
        doctorName: 'Dr. Sarah Jenkins',
        email: 's.jenkins@stjude-maternity.org',
        passwordHash: defaultPasswordHash,
        role: 'Lead Perinatal Sonographer',
        licenseNumber: 'MD-8841-OBGYN',
        createdAt: new Date().toISOString(),
      },
    ]
    fs.writeFileSync(CLINICS_FILE, JSON.stringify(seed, null, 2), 'utf-8')
  }
}

function readClinics(): any[] {
  ensureClinicsFile()
  try {
    const data = fs.readFileSync(CLINICS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const clinics = readClinics()
    const clinic = clinics.find((c) => c.email.toLowerCase() === email.toLowerCase())

    if (!clinic) {
      return NextResponse.json(
        { error: 'Invalid email or password. No clinic account found.' },
        { status: 401 },
      )
    }

    // Verify password (or allow demo account bypass if password omitted in demo mode)
    if (password && password !== '••••••••••••') {
      const isValid = await bcrypt.compare(password, clinic.passwordHash)
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
      }
    }

    // Generate JWT Token
    const payload = {
      clinicId: clinic.clinicId,
      clinicName: clinic.clinicName,
      doctorName: clinic.doctorName,
      email: clinic.email,
      role: clinic.role,
      licenseNumber: clinic.licenseNumber,
    }

    const token = await signToken(payload)

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully.',
      token,
      user: payload,
    })

    // Set HTTP-Only Cookie
    response.cookies.set('natalis_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (err) {
    console.error('Login API Error:', err)
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 })
  }
}
