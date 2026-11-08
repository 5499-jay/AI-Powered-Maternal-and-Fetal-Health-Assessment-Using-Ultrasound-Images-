'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { HowItWorks } from '@/components/how-it-works'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/lib/auth-context'
import { Loader2, BrainCircuit } from 'lucide-react'

export default function WorkflowPage() {
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
          <p className="text-sm font-semibold text-muted-foreground">Loading Workflow Specs…</p>
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
            <BrainCircuit className="h-4 w-4" />
            CNN + Vision Transformer Architecture
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Model Architecture & XAI Workflow
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Detailed technical walkthrough of the EfficientNet-B4 spatial feature extractor, ViT-B/16 multi-head self-attention backbone, and Grad-CAM explainable AI saliency visualization.
          </p>
        </div>

        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  )
}
