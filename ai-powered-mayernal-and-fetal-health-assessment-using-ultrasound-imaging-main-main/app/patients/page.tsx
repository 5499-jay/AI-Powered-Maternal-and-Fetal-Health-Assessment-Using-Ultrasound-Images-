'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { PatientInfoForm } from '@/components/patient-info-form'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/lib/auth-context'
import { Loader2, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PatientsPage() {
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
          <p className="text-sm font-semibold text-muted-foreground">Loading Patient Portal…</p>
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
              <Users className="h-4 w-4" />
              Perinatal Patient Portal
            </div>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Patient Records & Medical History
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage patient demographics, add or update records, export CSV/Excel files, and review historical ultrasound scan timelines.
            </p>
          </div>

          <Button
            onClick={() => router.push('/scan')}
            className="rounded-full gap-2 font-semibold text-xs py-2 px-5 shadow-sm"
          >
            Start Scan for {activePatient.name.split(' ')[0]}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Patient Management Portal Component */}
        <PatientInfoForm />
      </main>
      <SiteFooter />
    </div>
  )
}
