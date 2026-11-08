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
    // Seed default demo clinic
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

function writeClinics(clinics: any[]) {
  ensureClinicsFile()
  fs.writeFileSync(CLINICS_FILE, JSON.stringify(clinics, null, 2), 'utf-8')
}

export async function POST(req: NextRequest) {
  try {
    const { clinicName, doctorName, email, password, licenseNumber, role } = await req.json()

    if (!clinicName || !doctorName || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide Clinic Name, Doctor Name, Email, and Password.' },
        { status: 400 },
      )
    }

    const clinics = readClinics()

    // Check if email already registered
    const existing = clinics.find((c) => c.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      return NextResponse.json(
        { error: 'A clinic with this email address is already registered.' },
        { status: 409 },
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    const newClinic = {
      clinicId: `CLN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clinicName,
      doctorName,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'Perinatal Sonographer',
      licenseNumber: licenseNumber || `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    }

    clinics.push(newClinic)
    writeClinics(clinics)

    // Generate JWT Token
    const payload = {
      clinicId: newClinic.clinicId,
      clinicName: newClinic.clinicName,
      doctorName: newClinic.doctorName,
      email: newClinic.email,
      role: newClinic.role,
      licenseNumber: newClinic.licenseNumber,
    }

    const token = await signToken(payload)

    const response = NextResponse.json({
      success: true,
      message: 'Clinic registered successfully.',
      token,
      user: payload,
    })

    // Also set HTTP-Only cookie for security
    response.cookies.set('natalis_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err) {
    console.error('Register API Error:', err)
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 })
  }
}
