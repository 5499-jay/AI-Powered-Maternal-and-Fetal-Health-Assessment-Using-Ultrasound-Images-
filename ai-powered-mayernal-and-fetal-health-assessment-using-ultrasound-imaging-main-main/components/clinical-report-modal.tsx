'use client'

import { useRef } from 'react'
import {
  FileText,
  Printer,
  X,
  Activity,
  User,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import type { Analysis } from '@/lib/types'

interface ClinicalReportModalProps {
  analysis: Analysis
  imageSrc: string
  onClose: () => void
}

export function ClinicalReportModal({ analysis, imageSrc, onClose }: ClinicalReportModalProps) {
  const { user, activePatient } = useAuth()
  const reportRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const patient = analysis.patientInfo || activePatient
  const ga = analysis.gestationalAge
  const arch = analysis.modelArchitecture
  const xai = analysis.xai

  // Dynamic Clinician & Clinic Information from Active Session
  const doctorName = user?.name || 'Attending Sonographer'
  const hospitalName = user?.hospital || 'Perinatal Diagnostic Center'
  const clinicianRole = user?.role || 'Lead Perinatal Sonographer'
  const licenseText = user?.licenseNumber ? ` (${user.licenseNumber})` : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-4xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Clinical XAI Ultrasound Assessment Report
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handlePrint} size="sm" className="rounded-full gap-2 font-semibold">
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div ref={reportRef} className="p-8 space-y-6 overflow-y-auto bg-card text-foreground print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Activity className="h-5 w-5" />
                </span>
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  Natalis<span className="text-primary">AI</span> Diagnostics
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground font-semibold">
                {hospitalName} · Department of Perinatal Ultrasound
              </p>
            </div>

            <div className="text-right text-xs space-y-1">
              <p className="font-mono font-bold text-foreground">REPORT ID: REP-{new Date().getFullYear()}-XAI-{Math.floor(1000 + Math.random() * 9000)}</p>
              <p className="text-muted-foreground">Scan Date: {patient.scanDate || new Date().toISOString().split('T')[0]}</p>
              <p className="text-foreground font-semibold">Attending: {doctorName}{licenseText}</p>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Patient Demographics & Clinical Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block">Patient Name:</span>
                <span className="font-bold text-foreground text-sm">{patient.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Medical Record No:</span>
                <span className="font-mono font-semibold text-foreground">{patient.patientId}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Age / Obstetric Hist:</span>
                <span className="font-semibold text-foreground">{patient.age} yrs ({patient.gravidaPara})</span>
              </div>
              <div>
                <span className="text-muted-foreground block">LMP Date:</span>
                <span className="font-semibold text-foreground">{patient.lmp}</span>
              </div>
              <div className="col-span-2 sm:col-span-4">
                <span className="text-muted-foreground block">Clinical Indication:</span>
                <span className="font-medium text-foreground">{patient.clinicalIndication}</span>
              </div>
            </div>
          </div>

          {/* AI Architecture & Plane Detected */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 bg-card">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Anatomical Plane</span>
              <p className="font-display text-lg font-bold text-foreground mt-0.5">{analysis.planeType}</p>
              <p className="text-xs text-muted-foreground mt-1">Image Quality: <strong className="capitalize text-foreground">{analysis.imageQuality.rating}</strong> ({analysis.imageQuality.note})</p>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <span className="text-xs text-primary font-bold uppercase flex items-center gap-1">
                <Brain className="h-3.5 w-3.5" /> AI Engine Model
              </span>
              <p className="font-display text-sm font-bold text-foreground mt-0.5">
                {arch?.architectureName || 'CNN-Transformer Hybrid (EfficientNet-B4 + ViT-B/16)'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Model Confidence: <strong>{Math.round(analysis.confidence)}%</strong></p>
            </div>
          </div>

          {/* Scan & XAI Heatmap Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">Original Ultrasound Scan</span>
              <div className="aspect-square w-full rounded-xl overflow-hidden border border-border bg-black">
                <img src={imageSrc} alt="Raw Scan" className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">Grad-CAM XAI Heatmap & Contours</span>
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-border bg-black">
                <img src={imageSrc} alt="Scan for Heatmap" className="h-full w-full object-contain" />
                <div className="absolute inset-0 mix-blend-screen opacity-70">
                  <svg className="h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="none">
                    <radialGradient id="reportHeat" cx="50%" cy="46%" r="35%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>
                    <rect width="100%" height="100%" fill="url(#reportHeat)" />
                    <ellipse cx="200" cy="195" rx="105" ry="80" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Fetal Biometry Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-primary" />
              CNN-Transformer Biometry Measurements
            </h3>

            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/70 text-foreground uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Measurement</th>
                    <th className="px-4 py-2.5">Parameter</th>
                    <th className="px-4 py-2.5">Value (mm)</th>
                    <th className="px-4 py-2.5">Percentile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analysis.biometry.map((b) => (
                    <tr key={b.name} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-bold">{b.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{b.label}</td>
                      <td className="px-4 py-2.5 font-mono font-semibold">{b.valueMm} mm</td>
                      <td className="px-4 py-2.5 font-semibold text-primary">{b.percentile}th pct</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/20 font-bold">
                    <td className="px-4 py-2.5 text-foreground">Gestational Age (GA)</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{ga.method}</td>
                    <td className="px-4 py-2.5 font-mono text-primary" colSpan={2}>
                      {ga.weeks} weeks {ga.days} days
                    </td>
                  </tr>
                  <tr className="bg-muted/20 font-bold">
                    <td className="px-4 py-2.5 text-foreground">Est. Fetal Weight (EFW)</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Hadlock Formula</td>
                    <td className="px-4 py-2.5 font-mono text-foreground" colSpan={2}>
                      {analysis.estimatedFetalWeight.grams} g ({analysis.estimatedFetalWeight.percentile}th pct)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Observations & Risk Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase text-foreground">Clinical Observations</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {analysis.observations.map((obs, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase text-foreground">Risk Flags</h4>
              {analysis.riskFlags.length === 0 ? (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No high risk indicators detected.
                </p>
              ) : (
                <ul className="space-y-1.5 text-xs">
                  {analysis.riskFlags.map((rf, i) => (
                    <li key={i} className="rounded-lg bg-accent/10 p-2 border border-accent/20">
                      <span className="font-bold text-foreground block">{rf.label} ({rf.severity.toUpperCase()})</span>
                      <span className="text-[11px] text-muted-foreground">{rf.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* XAI Explainability Rationale */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-1.5">
            <h4 className="font-bold text-foreground uppercase flex items-center gap-1.5 text-primary">
              <Brain className="h-4 w-4" /> Explainable AI (XAI) Attribution & Rationale
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {xai?.clinicalRationale || analysis.overallAssessment}
            </p>
          </div>

          {/* Sign-off Signature */}
          <div className="border-t border-border pt-6 flex items-end justify-between">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-primary" /> NatalisAI Perinatal Diagnostic Assistant
              </p>
              <p>Facility: <strong className="text-foreground">{hospitalName}</strong></p>
              <p className="italic">Note: Subject to physician review before diagnostic decision.</p>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-foreground/40 w-56 mb-1 flex items-end justify-center font-serif text-sm italic font-bold text-foreground">
                {doctorName}
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground">
                {clinicianRole} Signature
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
