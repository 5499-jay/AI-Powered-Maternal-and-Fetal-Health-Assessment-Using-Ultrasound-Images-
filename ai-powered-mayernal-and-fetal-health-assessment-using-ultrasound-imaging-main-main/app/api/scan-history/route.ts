import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SCAN_HISTORY_FILE = path.join(DATA_DIR, 'scan_history.json')

export interface ScanRecord {
  id: string
  patientId: string
  patientName: string
  scanDate: string
  timestamp: string
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
  primaryFocusRegion?: string
  previewImage?: string
}

function ensureHistoryFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(SCAN_HISTORY_FILE)) {
    // Seed initial history for default patient
    const seed: ScanRecord[] = [
      {
        id: 'SCAN-2026-001',
        patientId: 'PT-2026-8841',
        patientName: 'Elena Rostova',
        scanDate: '2026-06-10',
        timestamp: '2026-06-10T10:30:00.000Z',
        planeType: 'Midsagittal Fetal Profile (12w Scan)',
        imageQuality: {
          rating: 'good',
          note: 'Early 1st trimester dating & NT assessment scan.',
        },
        gestationalAge: {
          weeks: 12,
          days: 3,
          method: 'Crown-Rump Length (CRL)',
        },
        biometry: [
          { name: 'CRL', label: 'Crown-Rump Length', valueMm: 58.4, percentile: 54 },
          { name: 'NT', label: 'Nuchal Translucency', valueMm: 1.3, percentile: 45 },
          { name: 'NB', label: 'Nasal Bone', valueMm: 2.8, percentile: 52 },
        ],
        estimatedFetalWeight: {
          grams: 58,
          percentile: 50,
        },
        observations: [
          'Normal 1st trimester nuchal translucency measurement.',
          'Nasal bone present and hyperechoic.',
          'No early major anatomical abnormalities identified.',
        ],
        riskFlags: [],
        overallAssessment: 'Early 12-week screening scan demonstrates normal fetal anatomy and low aneuploidy risk indicators.',
        confidence: 96,
        primaryFocusRegion: 'Nasal Bone & Nuchal Translucency',
      },
      {
        id: 'SCAN-2026-002',
        patientId: 'PT-2026-9102',
        patientName: 'Amara Okafor',
        scanDate: '2026-07-15',
        timestamp: '2026-07-15T14:15:00.000Z',
        planeType: 'Trans-abdominal Plane (Fetal Abdomen)',
        imageQuality: {
          rating: 'adequate',
          note: 'Maternal acoustic attenuation noted.',
        },
        gestationalAge: {
          weeks: 24,
          days: 1,
          method: 'Biometry Composite (FGR Screening)',
        },
        biometry: [
          { name: 'BPD', label: 'Biparietal Diameter', valueMm: 58.2, percentile: 32 },
          { name: 'HC', label: 'Head Circumference', valueMm: 218.4, percentile: 28 },
          { name: 'AC', label: 'Abdominal Circumference', valueMm: 178.1, percentile: 7 },
          { name: 'FL', label: 'Femur Length', valueMm: 41.5, percentile: 35 },
        ],
        estimatedFetalWeight: {
          grams: 520,
          percentile: 8,
        },
        observations: [
          'Abdominal circumference measures below the 10th percentile for 24 weeks.',
          'Head-sparing asymmetric growth pattern observed.',
          'Uterine artery Doppler screening recommended.',
        ],
        riskFlags: [
          {
            label: 'Suspected Fetal Growth Restriction (FGR / IUGR)',
            severity: 'high',
            detail: 'Abdominal circumference (178.1mm) & EFW (520g) are below the 10th percentile for 24w1d.',
          },
        ],
        overallAssessment: 'Asymmetric Fetal Growth Restriction (FGR) flagged with abdominal circumference < 10th percentile. Close Doppler monitoring advised.',
        confidence: 93,
        primaryFocusRegion: 'Abdominal Wall & Portal Vein',
      },
    ]
    fs.writeFileSync(SCAN_HISTORY_FILE, JSON.stringify(seed, null, 2), 'utf-8')
  }
}

function readHistory(): ScanRecord[] {
  ensureHistoryFile()
  try {
    const content = fs.readFileSync(SCAN_HISTORY_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

function writeHistory(records: ScanRecord[]) {
  ensureHistoryFile()
  fs.writeFileSync(SCAN_HISTORY_FILE, JSON.stringify(records, null, 2), 'utf-8')
}

// GET /api/scan-history?patientId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')

    const allRecords = readHistory()

    if (patientId) {
      const filtered = allRecords.filter((r) => r.patientId === patientId)
      return NextResponse.json({ scans: filtered })
    }

    return NextResponse.json({ scans: allRecords })
  } catch (err) {
    console.error('GET /api/scan-history error:', err)
    return NextResponse.json({ error: 'Failed to retrieve scan history.' }, { status: 500 })
  }
}

// POST /api/scan-history - Save new scan analysis record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.patientId || !body.planeType) {
      return NextResponse.json({ error: 'patientId and planeType required.' }, { status: 400 })
    }

    const allRecords = readHistory()

    const newScan: ScanRecord = {
      id: `SCAN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      patientId: body.patientId,
      patientName: body.patientName || body.patientInfo?.name || 'Unknown Patient',
      scanDate: body.scanDate || new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      planeType: body.planeType,
      imageQuality: body.imageQuality || { rating: 'good', note: 'Clear visual plane' },
      gestationalAge: body.gestationalAge || { weeks: 20, days: 0, method: 'Hadlock Biometry' },
      biometry: body.biometry || [],
      estimatedFetalWeight: body.estimatedFetalWeight || { grams: 350, percentile: 50 },
      observations: body.observations || [],
      riskFlags: body.riskFlags || [],
      overallAssessment: body.overallAssessment || '',
      confidence: body.confidence || 95,
      primaryFocusRegion: body.xai?.primaryFocusRegion || body.primaryFocusRegion,
      previewImage: body.image || body.previewImage,
    }

    allRecords.unshift(newScan) // newest first
    writeHistory(allRecords)

    return NextResponse.json({ success: true, scan: newScan })
  } catch (err) {
    console.error('POST /api/scan-history error:', err)
    return NextResponse.json({ error: 'Failed to record scan history.' }, { status: 500 })
  }
}

// DELETE /api/scan-history?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Scan ID required.' }, { status: 400 })
    }

    const allRecords = readHistory()
    const filtered = allRecords.filter((r) => r.id !== id)
    writeHistory(filtered)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/scan-history error:', err)
    return NextResponse.json({ error: 'Failed to delete scan history.' }, { status: 500 })
  }
}
