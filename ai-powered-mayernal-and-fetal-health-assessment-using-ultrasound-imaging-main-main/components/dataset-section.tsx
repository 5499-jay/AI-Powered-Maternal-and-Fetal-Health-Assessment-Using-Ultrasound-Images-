import { Database, ArrowUpRight } from 'lucide-react'

const DATASETS = [
  {
    name: 'HC18 Challenge',
    org: 'Grand Challenge · Radboud UMC',
    desc: '1,334 two-dimensional ultrasound images of the standard head plane with expert head-circumference annotations. A benchmark for fetal biometry.',
    tag: '1,334 images',
    href: 'https://hc18.grand-challenge.org/',
  },
  {
    name: 'FETAL_PLANES_DB',
    org: 'BCNatal · Zenodo',
    desc: 'Large-scale set of 12,400 maternal-fetal ultrasound images across six anatomical planes (brain, abdomen, femur, thorax, cervix, other).',
    tag: '12,400 images',
    href: 'https://zenodo.org/records/3904280',
  },
  {
    name: 'ACOUSLIC-AI',
    org: 'Grand Challenge',
    desc: 'Abdominal circumference measurement dataset from blind-sweep ultrasound acquisitions, aimed at low-resource obstetric screening.',
    tag: 'Blind-sweep',
    href: 'https://acouslic-ai.grand-challenge.org/',
  },
  {
    name: 'Fetal Health Classification',
    org: 'Kaggle',
    desc: '2,126 cardiotocogram (CTG) records labelled normal, suspect, or pathological — a complement to imaging for maternal-fetal risk modelling.',
    tag: '2,126 records',
    href: 'https://www.kaggle.com/datasets/andrewmvd/fetal-health-classification',
  },
]

export function DatasetSection() {
  return (
    <section id="datasets" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            <Database className="h-4 w-4" aria-hidden="true" />
            Training & reference data
          </p>
          <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Built on public ultrasound datasets
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            These openly available research datasets underpin fetal biometry and
            maternal-fetal health models. Explore them to reproduce or extend this work.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {DATASETS.map((d) => (
          <a
            key={d.name}
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-md hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {d.name}
                </h3>
                <p className="text-xs text-muted-foreground">{d.org}</p>
              </div>
              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-primary"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {d.desc}
            </p>
            <span className="mt-4 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {d.tag}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
