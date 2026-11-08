import { Sparkles, ArrowRight, ShieldCheck, Baby, Gauge, Brain, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Brain className="h-3.5 w-3.5" aria-hidden="true" />
            CNN + Vision Transformer (ViT) & XAI Powered
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Clearer insight into every{' '}
            <span className="text-primary">heartbeat.</span>
          </h1>

          <p className="mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            NatalisAI combines CNN spatial feature extraction with Vision Transformers and Explainable AI (XAI) Grad-CAM heatmaps. Upload an ultrasound scan to analyze patient biometry, gestational age, and generate structured clinical reports.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              render={<a href="#assess" />}
              nativeButton={false}
              size="lg"
              className="rounded-full gap-2 font-semibold shadow-md"
            >
              Start Patient Scan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              render={<a href="#workflow" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="rounded-full gap-2"
            >
              <Eye className="h-4 w-4 text-primary" />
              Explore XAI Workflow
            </Button>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { icon: Gauge, stat: 'CNN+ViT', label: 'Hybrid model' },
              { icon: Eye, stat: 'Grad-CAM', label: 'XAI Heatmaps' },
              { icon: ShieldCheck, stat: 'XAI Report', label: 'Exportable PDF' },
            ].map(({ icon: Icon, stat, label }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-4">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <dd className="mt-2 font-display text-lg font-bold text-foreground">
                  {stat}
                </dd>
                <dt className="text-xs text-muted-foreground">{label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-foreground font-semibold">
                  Grad-CAM XAI Heatmap & Contours
                </span>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                CNN-ViT Active
              </span>
            </div>

            <div className="relative aspect-square w-full bg-black">
              <img
                src="/samples/fetal-profile.png"
                alt="Fetal profile scan"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 mix-blend-screen opacity-70">
                <svg className="h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="none">
                  <radialGradient id="heroHeat" cx="45%" cy="42%" r="35%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </radialGradient>
                  <rect width="100%" height="100%" fill="url(#heroHeat)" />
                  <ellipse cx="180" cy="170" rx="90" ry="70" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border bg-card p-4 shadow-lg sm:block">
            <p className="text-xs font-semibold text-primary flex items-center gap-1">
              <Brain className="h-3.5 w-3.5" /> High XAI Saliency
            </p>
            <p className="font-display text-base font-bold text-foreground">Anatomical Caliper Fit: 96%</p>
            <p className="text-xs text-muted-foreground">Patient: Elena Rostova (20w 3d)</p>
          </div>
        </div>
      </div>
    </section>
  )
}
