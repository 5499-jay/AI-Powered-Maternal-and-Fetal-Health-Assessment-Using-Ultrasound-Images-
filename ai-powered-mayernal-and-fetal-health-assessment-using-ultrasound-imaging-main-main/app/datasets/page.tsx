'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { DatasetSection } from '@/components/dataset-section'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/lib/auth-context'
import { Loader2, Database } from 'lucide-react'

export default function DatasetsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

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
          <p className="text-sm font-semibold text-muted-foreground">Loading Datasets…</p>
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
        <div className="mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Database className="h-4 w-4" />
            Training & Benchmark Corpora
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Ultrasound Datasets & Clinical Benchmarks
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Explore the clinical datasets, obstetric ultrasound registries, and performance metrics validating NatalisAI across BPD, HC, AC, and FL biometry benchmarks.
          </p>
        </div>

        <DatasetSection />
      </main>
      <SiteFooter />
    </div>
  )
}
