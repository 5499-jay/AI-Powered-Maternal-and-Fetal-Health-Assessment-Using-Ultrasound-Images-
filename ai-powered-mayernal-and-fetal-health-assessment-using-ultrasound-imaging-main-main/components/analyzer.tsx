'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Upload,
  ScanLine,
  X,
  Loader2,
  Sparkles,
  ImageIcon,
  AlertTriangle,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PatientInfoForm } from '@/components/patient-info-form'
import { ResultsPanel } from '@/components/results-panel'
import { useAuth } from '@/lib/auth-context'
import type { Analysis, PatientInfo } from '@/lib/types'

const SAMPLES = [
  { src: '/samples/head-circumference.png', label: 'Head (HC)' },
  { src: '/samples/abdomen.png', label: 'Abdomen (AC)' },
  { src: '/samples/femur.png', label: 'Femur (FL)' },
  { src: '/samples/fetal-profile.png', label: 'Profile' },
]

type Status = 'idle' | 'loading' | 'done' | 'error'

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function urlToDataUrl(url: string): Promise<{ dataUrl: string; mediaType: string }> {
  const res = await fetch(url)
  const blob = await res.blob()
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
  return { dataUrl, mediaType: blob.type || 'image/png' }
}

export function Analyzer() {
  const { activePatient } = useAuth()
  const [preview, setPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<string>('image/png')
  const [status, setStatus] = useState<Status>('idle')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setPreview(null)
    setAnalysis(null)
    setStatus('idle')
    setError(null)
  }

  const runAnalysis = useCallback(
    async (dataUrl: string, type: string, currentPatient?: PatientInfo) => {
      setStatus('loading')
      setError(null)
      setAnalysis(null)
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: dataUrl,
            mediaType: type,
            patientInfo: currentPatient || activePatient,
          }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || 'Analysis failed.')
        }
        const data = (await res.json()) as Analysis
        setAnalysis(data)
        setStatus('done')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.')
        setStatus('error')
      }
    },
    [activePatient],
  )

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.')
        setStatus('error')
        return
      }
      const dataUrl = await fileToDataUrl(file)
      setPreview(dataUrl)
      setMediaType(file.type)
      void runAnalysis(dataUrl, file.type)
    },
    [runAnalysis],
  )

  const handleSample = useCallback(
    async (src: string) => {
      const { dataUrl, mediaType: type } = await urlToDataUrl(src)
      setPreview(dataUrl)
      setMediaType(type)
      void runAnalysis(dataUrl, type)
    },
    [runAnalysis],
  )

  return (
    <div className="space-y-6">
      {/* Patient Information Input Section */}
      <PatientInfoForm />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Left: input */}
        <div className="space-y-5">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              const file = e.dataTransfer.files?.[0]
              if (file) void handleFile(file)
            }}
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
              dragging ? 'border-primary bg-primary/5' : 'border-border bg-card'
            }`}
          >
            {preview ? (
              <div className="relative">
                <img
                  src={preview || '/placeholder.svg'}
                  alt="Uploaded ultrasound scan for analysis"
                  className="aspect-square w-full object-contain bg-foreground/[0.03]"
                />
                <button
                  onClick={reset}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-xs transition hover:bg-background"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
                {status === 'loading' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-xs">
                    <div className="relative flex items-center justify-center">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <Brain className="absolute h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      Running CNN + ViT Transformer Pipeline…
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Extracting biometry features & generating Grad-CAM heatmaps
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-4 font-display font-semibold text-foreground">
                  Drop an ultrasound scan
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  PNG or JPG · or choose a sample scan below
                </p>
                <Button
                  className="mt-5 rounded-full"
                  onClick={() => inputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" aria-hidden="true" />
                  Browse files
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void handleFile(file)
                  }}
                />
              </div>
            )}
          </div>

          {/* Sample gallery */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              Try a sample ultrasound scan
            </p>
            <div className="grid grid-cols-4 gap-3">
              {SAMPLES.map((s) => (
                <button
                  key={s.src}
                  onClick={() => void handleSample(s.src)}
                  disabled={status === 'loading'}
                  className="group overflow-hidden rounded-xl border border-border bg-card text-left transition hover:border-primary disabled:opacity-60"
                >
                  <img
                    src={s.src || '/placeholder.svg'}
                    alt={`Sample ${s.label} ultrasound`}
                    className="aspect-square w-full object-cover transition group-hover:scale-105"
                  />
                  <span className="block px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: results */}
        <div>
          {status === 'idle' && (
            <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 text-center">
              <ScanLine className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 font-display font-semibold text-foreground">
                CNN-Transformer & XAI Report
              </p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Upload or select a scan to generate biometry estimates and interactive Grad-CAM XAI heatmaps.
              </p>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              <p className="mt-3 font-display font-semibold text-foreground">
                Executing CNN + Transformer Analysis
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Processing spatial features & cross-attention maps for patient {activePatient.name}…
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
              <p className="mt-3 font-display font-semibold text-foreground">
                Analysis unavailable
              </p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" className="mt-4 rounded-full" onClick={reset}>
                Try again
              </Button>
            </div>
          )}

          {status === 'done' && analysis && (
            <ResultsPanel analysis={analysis} imageSrc={preview || '/samples/head-circumference.png'} />
          )}
        </div>
      </div>
    </div>
  )
}
