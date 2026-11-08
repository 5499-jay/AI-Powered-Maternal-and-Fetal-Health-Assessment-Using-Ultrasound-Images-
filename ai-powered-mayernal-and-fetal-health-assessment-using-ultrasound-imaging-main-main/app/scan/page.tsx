'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { Analyzer } from '@/components/analyzer'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/lib/auth-context'
import { Loader2, ScanLine, Brain, UserCheck } from 'lucide-react'

export default function ScanPage() {
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
          <p className="text-sm font-semibold text-muted-foreground">Authenticating Scanner Access…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !user) return null

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <ScanLine className="h-4 w-4" />
              Ultrasound Diagnostic Scanner
            </div>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Ultrasound Scan & XAI Analysis
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Select or upload an ultrasound scan to run the CNN + Vision Transformer biometry engine, generate Grad-CAM heatmaps, and issue clinical reports.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Patient</p>
              <p className="font-display text-sm font-bold text-foreground">
                {activePatient.name} <span className="text-xs font-normal text-muted-foreground">({activePatient.patientId})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Analyzer Component */}
        <Analyzer />
      </main>
      <SiteFooter />
    </div>
  )
}
