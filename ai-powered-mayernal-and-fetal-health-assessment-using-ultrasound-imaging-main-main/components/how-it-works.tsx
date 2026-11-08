import { Upload, BrainCircuit, FileText } from 'lucide-react'

const STEPS = [
  {
    icon: Upload,
    title: 'Capture & upload',
    body: 'Provide a standard obstetric ultrasound plane — head, abdomen, femur, or profile. The image is sent securely for analysis.',
  },
  {
    icon: BrainCircuit,
    title: 'AI vision analysis',
    body: 'A multimodal model identifies the anatomical plane, estimates fetal biometry, gestational age, and screens for risk indicators.',
  },
  {
    icon: FileText,
    title: 'Structured report',
    body: 'Receive a clinician-friendly summary with measurements, percentiles, observations, and flagged concerns in seconds.',
  },
]

export function HowItWorks() {
  return (
    <section id="workflow" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Workflow
          </p>
          <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            From scan to insight in three steps
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-primary/10">
                0{i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
