import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CSV_PATH = path.join(process.cwd(), 'data', 'patients.csv')

const CSV_HEADERS = [
  'patientId',
  'name',
  'age',
  'lmp',
  'gravidaPara',
  'clinicalIndication',
  'scanDate',
  'createdAt',
  'updatedAt',
]

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim())
  return lines.slice(1).map((line) => {
    // Handle commas inside quoted fields
    const values: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
    values.push(current.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })
    return row
  })
}

function rowToCSVLine(row: Record<string, string>): string {
  return CSV_HEADERS.map((h) => {
    const val = (row[h] ?? '').replace(/"/g, '""')
    return val.includes(',') || val.includes('"') || val.includes('\n') ? `"${val}"` : val
  }).join(',')
}

function readCSV(): Record<string, string>[] {
  ensureDataDir()
  if (!fs.existsSync(CSV_PATH)) {
    // Seed with sample patients
    const now = new Date().toISOString()
    const seed = [
      {
        patientId: 'PT-2026-8841',
        name: 'Elena Rostova',
        age: '29',
        lmp: '2026-01-15',
        gravidaPara: 'G2P1',
        clinicalIndication: 'Routine 2nd Trimester Biometry & Anomaly Scan',
        scanDate: '2026-08-05',
        createdAt: now,
        updatedAt: now,
      },
      {
        patientId: 'PT-2026-9102',
        name: 'Amara Okafor',
        age: '32',
        lmp: '2026-02-01',
        gravidaPara: 'G1P0',
        clinicalIndication: 'Fetal Growth Restriction (FGR) & Doppler Screening',
        scanDate: '2026-08-05',
        createdAt: now,
        updatedAt: now,
      },
      {
        patientId: 'PT-2026-7430',
        name: 'Sophia Patel',
        age: '26',
        lmp: '2025-12-10',
        gravidaPara: 'G3P2',
        clinicalIndication: 'Late 2nd Trimester Profile & Femur Evaluation',
        scanDate: '2026-08-05',
        createdAt: now,
        updatedAt: now,
      },
    ]
    const csvContent = [CSV_HEADERS.join(','), ...seed.map(rowToCSVLine)].join('\n')
    fs.writeFileSync(CSV_PATH, csvContent, 'utf-8')
    return seed
  }
  const content = fs.readFileSync(CSV_PATH, 'utf-8')
  return parseCSV(content)
}

function writeCSV(rows: Record<string, string>[]) {
  ensureDataDir()
  const csvContent = [CSV_HEADERS.join(','), ...rows.map(rowToCSVLine)].join('\n')
  fs.writeFileSync(CSV_PATH, csvContent, 'utf-8')
}

// GET: list all patients
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format')

    const rows = readCSV()

    if (format === 'csv') {
      const csvContent = [CSV_HEADERS.join(','), ...rows.map(rowToCSVLine)].join('\n')
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="natalis_patients.csv"',
        },
      })
    }

    if (format === 'excel') {
      // Generate Excel-compatible CSV (with BOM for proper UTF-8 in Excel)
      const csvContent = '\uFEFF' + [CSV_HEADERS.join(','), ...rows.map(rowToCSVLine)].join('\n')
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': 'attachment; filename="natalis_patients.xls"',
        },
      })
    }

    return NextResponse.json({ patients: rows })
  } catch (err) {
    console.error('GET /api/patients error:', err)
    return NextResponse.json({ error: 'Failed to load patients' }, { status: 500 })
  }
}

// POST: add new patient
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rows = readCSV()

    // Check for duplicate patientId
    const exists = rows.find((r) => r.patientId === body.patientId)
    if (exists) {
      return NextResponse.json({ error: 'Patient ID already exists.' }, { status: 409 })
    }

    const now = new Date().toISOString()
    const newRow: Record<string, string> = {
      patientId: body.patientId || `PT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: body.name || '',
      age: String(body.age || ''),
      lmp: body.lmp || '',
      gravidaPara: body.gravidaPara || '',
      clinicalIndication: body.clinicalIndication || '',
      scanDate: body.scanDate || new Date().toISOString().split('T')[0],
      createdAt: now,
      updatedAt: now,
    }

    rows.push(newRow)
    writeCSV(rows)

    return NextResponse.json({ success: true, patient: newRow })
  } catch (err) {
    console.error('POST /api/patients error:', err)
    return NextResponse.json({ error: 'Failed to add patient' }, { status: 500 })
  }
}

// PUT: update existing patient by patientId
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const rows = readCSV()

    const idx = rows.findIndex((r) => r.patientId === body.patientId)
    if (idx === -1) {
      return NextResponse.json({ error: 'Patient not found.' }, { status: 404 })
    }

    const now = new Date().toISOString()
    rows[idx] = {
      ...rows[idx],
      name: body.name ?? rows[idx].name,
      age: String(body.age ?? rows[idx].age),
      lmp: body.lmp ?? rows[idx].lmp,
      gravidaPara: body.gravidaPara ?? rows[idx].gravidaPara,
      clinicalIndication: body.clinicalIndication ?? rows[idx].clinicalIndication,
      scanDate: body.scanDate ?? rows[idx].scanDate,
      updatedAt: now,
    }

    writeCSV(rows)

    return NextResponse.json({ success: true, patient: rows[idx] })
  } catch (err) {
    console.error('PUT /api/patients error:', err)
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 })
  }
}

// DELETE: remove patient by patientId
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID required' }, { status: 400 })
    }

    const rows = readCSV()
    const filtered = rows.filter((r) => r.patientId !== patientId)

    if (filtered.length === rows.length) {
      return NextResponse.json({ error: 'Patient not found.' }, { status: 404 })
    }

    writeCSV(filtered)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/patients error:', err)
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 })
  }
}
