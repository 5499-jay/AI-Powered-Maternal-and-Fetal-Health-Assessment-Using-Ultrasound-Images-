import { Activity } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display font-bold text-foreground">
            Natalis<span className="text-primary">AI</span>
          </span>
        </div>
        <p className="max-w-md text-center text-xs leading-relaxed text-muted-foreground sm:text-right">
          Research and demonstration prototype. Not a medical device and not intended
          for clinical diagnosis. Always consult a qualified healthcare professional.
        </p>
      </div>
    </footer>
  )
}
