'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Ruler,
  Baby,
  Gauge,
  Stethoscope,
  FileText,
  User,
  BrainCircuit,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { XAIHeatmapViewer } from '@/components/xai-heatmap-viewer'
import { ClinicalReportModal } from '@/components/clinical-report-modal'
import { useAuth } from '@/lib/auth-context'
import type { Analysis, Severity } from '@/lib/types'

const severityStyles: Record<Severity, string> = {
  low: 'bg-primary/10 text-primary border-primary/20',
  moderate: 'bg-accent/10 text-accent border-accent/25',
  high: 'bg-destructive/10 text-destructive border-destructive/25',
}

const qualityStyles: Record<string, string> = {
  poor: 'text-destructive',
  adequate: 'text-accent',
  good: 'text-primary',
  excellent: 'text-primary',
}

function Meter({ percentile }: { percentile: number }) {
  const clamped = Math.max(1, Math.min(99, percentile))
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

interface ResultsPanelProps {
  analysis: Analysis
  imageSrc: string
}

export function ResultsPanel({ analysis, imageSrc }: ResultsPanelProps) {
  const { activePatient } = useAuth()
  const [showReportModal, setShowReportModal] = useState(false)

  if (!analysis.isUltrasound) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h3 className="font-display font-semibold text-foreground">
              This doesn&apos;t look like an ultrasound
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {analysis.overallAssessment}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const patient = analysis.patientInfo || activePatient
  const ga = analysis.gestationalAge

  return (
    <div className="space-y-5">
      {/* Patient Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-sm">
              {patient.name} <span className="font-normal text-muted-foreground text-xs">({patient.patientId})</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Age: {patient.age}y · LMP: {patient.lmp} · Hist: {patient.gravidaPara}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowReportModal(true)}
          className="rounded-full gap-2 font-semibold text-xs py-2 px-4 shadow-sm"
        >
          <FileText className="h-4 w-4" />
          Generate Clinical Report
        </Button>
      </div>

      {/* Summary header */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Detected Anatomical Plane
            </p>
            <p className="font-display text-lg font-bold text-foreground">
              {analysis.planeType}
            </p>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-xs text-muted-foreground">Image Quality</p>
              <p
                className={`font-display text-sm font-bold capitalize ${
                  qualityStyles[analysis.imageQuality.rating] ?? 'text-foreground'
                }`}
              >
                {analysis.imageQuality.rating}
              </p>
            </div>
            <div className="h-9 w-px bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">Model Confidence</p>
              <p className="font-display text-sm font-bold text-foreground">
                {Math.round(analysis.confidence)}%
              </p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {analysis.overallAssessment}
        </p>
      </div>

      {/* CNN + Transformer Model Badge */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <BrainCircuit className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            CNN + Vision Transformer Architecture
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-muted/40 p-2.5">
            <span className="text-muted-foreground block text-[10px]">CNN Feature Extractor</span>
            <span className="font-semibold text-foreground">
              {analysis.modelArchitecture?.cnnFeatureExtractor || 'EfficientNet-B4 Spatial Encoder'}
            </span>
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5">
            <span className="text-muted-foreground block text-[10px]">Transformer Backbone</span>
            <span className="font-semibold text-foreground">
              {analysis.modelArchitecture?.transformerEncoder || 'ViT-B/16 Multi-Head Self-Attention'}
            </span>
          </div>
        </div>
      </div>

      {/* XAI Heatmap & Vision Transformer Attention Component */}
      <XAIHeatmapViewer
        imageSrc={imageSrc}
        xai={analysis.xai}
        architecture={analysis.modelArchitecture}
      />

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-primary">
            <Baby className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Gestational Age (GA)
            </span>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
            {ga.weeks}
            <span className="text-lg font-bold">w</span> {ga.days}
            <span className="text-lg font-bold">d</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{ga.method}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-primary">
            <Gauge className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Est. Fetal Weight (EFW)
            </span>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
            {analysis.estimatedFetalWeight.grams}
            <span className="text-lg font-bold"> g</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {analysis.estimatedFetalWeight.percentile}th percentile
          </p>
        </div>
      </div>

      {/* Biometry */}
      {analysis.biometry.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="font-display font-semibold text-foreground">
              Fetal Biometry Measurements
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {analysis.biometry.map((b) => (
              <div key={b.name} className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm font-bold text-foreground">
                    {b.name}
                  </span>
                  <span className="font-display text-sm font-bold text-foreground">
                    {b.valueMm} mm
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{b.label}</p>
                <Meter percentile={b.percentile} />
                <p className="mt-1 text-right text-[11px] text-muted-foreground">
                  {b.percentile}th pct
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Observations */}
      {analysis.observations.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="font-display font-semibold text-foreground">
              Clinical Observations
            </h3>
          </div>
          <ul className="space-y-2">
            {analysis.observations.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk flags */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-accent" aria-hidden="true" />
          <h3 className="font-display font-semibold text-foreground">
            Risk Indicators
          </h3>
        </div>
        {analysis.riskFlags.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
            No significant risk indicators detected in this scan view.
          </p>
        ) : (
          <ul className="space-y-3">
            {analysis.riskFlags.map((r, i) => (
              <li
                key={i}
                className={`rounded-xl border p-3 ${severityStyles[r.severity]}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{r.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    {r.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed opacity-90">{r.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="rounded-xl bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Not a medical diagnosis.</strong> NatalisAI
        is a clinical screening decision support aid. All biometry results are generated by CNN-Transformer deep learning models and must be validated by a qualified clinician.
      </p>

      {/* Clinical Report Modal */}
      {showReportModal && (
        <ClinicalReportModal
          analysis={analysis}
          imageSrc={imageSrc}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  )
}
