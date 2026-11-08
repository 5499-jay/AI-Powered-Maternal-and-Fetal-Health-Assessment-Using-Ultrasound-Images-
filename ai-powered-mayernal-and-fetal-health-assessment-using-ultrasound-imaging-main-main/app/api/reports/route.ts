import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json')

export interface StoredReport {
  reportId: string
  patientId: string
  patientName: string
  patientAge: number
  patientLmp: string
  gravidaPara: string
  clinicalIndication: string
  scanDate: string
  createdAt: string
  doctorName: string
  hospitalName: string
  licenseNumber?: string
  planeType: string
  imageQuality: {
    rating: string
    note: string
  }
  gestationalAge: {
    weeks: number
    days: number
    method: string
  }
  biometry: Array<{
    name: string
    label: string
    valueMm: number
    percentile: number
  }>
  estimatedFetalWeight: {
    grams: number
    percentile: number
  }
  observations: string[]
  riskFlags: Array<{
    label: string
    severity: 'low' | 'moderate' | 'high'
    detail: string
  }>
  overallAssessment: string
  confidence: number
  modelArchitecture?: {
    architectureName: string
    cnnFeatureExtractor: string
    transformerEncoder: string
    fusionMechanism: string
  }
  xai?: {
    primaryFocusRegion: string
    clinicalRationale: string
    featureAttributions: Array<{ feature: string; importance: number; description: string }>
    anatomicalLandmarks: Array<{ name: string; xPct: number; yPct: number; confidence: number }>
  }
  imageUrl: string // File URL or base64 data URL
}

function ensureStorageDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  if (!fs.existsSync(REPORTS_FILE)) {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

function readReports(): StoredReport[] {
  ensureStorageDirs()
  try {
    const data = fs.readFileSync(REPORTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeReports(reports: StoredReport[]) {
  ensureStorageDirs()
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf-8')
}

// Save base64 image data to local disk file if it's base64
function saveImageToDisk(imageData: string, patientId: string): string {
  ensureStorageDirs()
  if (!imageData || !imageData.startsWith('data:image')) {
    return imageData || '/samples/fetal-profile.png'
  }

  try {
    const matches = imageData.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) return imageData

    const ext = matches[1] || 'png'
    const base64Data = matches[2]
    const filename = `scan-${Date.now()}-${patientId.replace(/[^a-zA-Z0-9]/g, '')}.${ext}`
    const filepath = path.join(UPLOADS_DIR, filename)

    fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'))
    return `/api/uploads/${filename}`
  } catch (err) {
    console.error('Failed to write image to disk:', err)
    return imageData
  }
}

// GET /api/reports?patientId=... or ?id=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')
    const reportId = searchParams.get('id')

    const reports = readReports()

    if (reportId) {
      const found = reports.find((r) => r.reportId === reportId)
      if (!found) return NextResponse.json({ error: 'Report not found' }, { status: 404 })
      return NextResponse.json({ report: found })
    }

    if (patientId) {
      const filtered = reports.filter((r) => r.patientId === patientId)
      return NextResponse.json({ reports: filtered })
    }

    return NextResponse.json({ reports })
  } catch (err) {
    console.error('GET /api/reports error:', err)
    return NextResponse.json({ error: 'Failed to retrieve reports.' }, { status: 500 })
  }
}

// POST /api/reports - Store a full scanning report & image
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const reports = readReports()

    const patient = body.patientInfo || body.patient || {}
    const storedImageUrl = saveImageToDisk(body.image || body.imageSrc || body.previewImage, patient.patientId || 'PT-UNKNOWN')

    const newReport: StoredReport = {
      reportId: body.reportId || `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: patient.patientId || 'PT-2026-8841',
      patientName: patient.name || 'Elena Rostova',
      patientAge: patient.age || 29,
      patientLmp: patient.lmp || '2026-01-15',
      gravidaPara: patient.gravidaPara || 'G2P1',
      clinicalIndication: patient.clinicalIndication || 'Obstetric Ultrasound Scan',
      scanDate: patient.scanDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      doctorName: body.doctorName || 'Dr. Sarah Jenkins',
      hospitalName: body.hospitalName || 'St. Jude Women & Children Hospital',
      licenseNumber: body.licenseNumber,
      planeType: body.planeType || body.analysis?.planeType || 'Obstetric Ultrasound Plane',
      imageQuality: body.imageQuality || body.analysis?.imageQuality || { rating: 'good', note: 'Clear visual plane' },
      gestationalAge: body.gestationalAge || body.analysis?.gestationalAge || { weeks: 20, days: 0, method: 'Hadlock Composite' },
      biometry: body.biometry || body.analysis?.biometry || [],
      estimatedFetalWeight: body.estimatedFetalWeight || body.analysis?.estimatedFetalWeight || { grams: 350, percentile: 50 },
      observations: body.observations || body.analysis?.observations || [],
      riskFlags: body.riskFlags || body.analysis?.riskFlags || [],
      overallAssessment: body.overallAssessment || body.analysis?.overallAssessment || '',
      confidence: body.confidence || body.analysis?.confidence || 95,
      modelArchitecture: body.modelArchitecture || body.analysis?.modelArchitecture,
      xai: body.xai || body.analysis?.xai,
      imageUrl: storedImageUrl,
    }

    reports.unshift(newReport)
    writeReports(reports)

    return NextResponse.json({ success: true, report: newReport })
  } catch (err) {
    console.error('POST /api/reports error:', err)
    return NextResponse.json({ error: 'Failed to store report.' }, { status: 500 })
  }
}

// DELETE /api/reports?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reportId = searchParams.get('id')

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    const reports = readReports()
    const filtered = reports.filter((r) => r.reportId !== reportId)
    writeReports(filtered)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/reports error:', err)
    return NextResponse.json({ error: 'Failed to delete report.' }, { status: 500 })
  }
}
