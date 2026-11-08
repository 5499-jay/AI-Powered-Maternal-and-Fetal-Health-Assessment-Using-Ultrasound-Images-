'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/lib/auth-context'
import {
  Loader2,
  ScanLine,
  Users,
  BrainCircuit,
  Database,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'

export default function Page() {
  const router = useRouter()
  const { isAuthenticated, isLoading, activePatient, user } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-muted-foreground">Authenticating Clinic Gateway…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !user) return null

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Main Hero Banner */}
        <Hero />

        {/* Dedicated Navigation Portal Section */}
        <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Clinic Navigation Portal
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Dedicated Perinatal Diagnostic Modules
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Select a module to perform ultrasound biometry scans, manage patient records, export CSV reports, or explore model architecture specifications.
              </p>
            </div>

            {/* Navigation Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Ultrasound Scanner */}
              <Link
                href="/scan"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:border-primary hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                    <ScanLine className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary">
                    Ultrasound Scanner
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Upload an obstetric scan, run CNN + ViT biometry regression, and view interactive XAI Grad-CAM heatmaps.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>Open Scanner</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Card 2: Patient Database & Records */}
              <Link
                href="/patients"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:border-primary hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary">
                    Patient Database
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Manage patient demographics, add/update records, export CSV/Excel, and review historical scan timelines.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>View Patient Records</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Card 3: CNN+ViT Workflow */}
              <Link
                href="/workflow"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:border-primary hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary">
                    CNN+ViT Workflow
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Technical breakdown of EfficientNet-B4 spatial feature extraction and Vision Transformer self-attention.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>Explore Workflow</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Card 4: Datasets & Validation */}
              <Link
                href="/datasets"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:border-primary hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110">
                    <Database className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary">
                    Clinical Datasets
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    HC18, FetReg, and SAM-Med2D validation corpora benchmarking precision across BPD, HC, AC, and FL.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>View Datasets</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            </div>

            {/* Quick Active Patient Bar */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-card p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Patient Selected</p>
                  <p className="font-display text-base font-bold text-foreground">
                    {activePatient.name} <span className="font-normal text-muted-foreground text-xs">({activePatient.patientId})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/patients">
                  <span className="text-xs font-semibold text-muted-foreground hover:text-foreground">Switch Patient</span>
                </Link>
                <Link href="/scan">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90">
                    <ScanLine className="h-4 w-4" />
                    Scan Active Patient
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
