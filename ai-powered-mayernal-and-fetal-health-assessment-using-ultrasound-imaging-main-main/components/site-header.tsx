'use client'

import { Activity, LogOut, User, UserCheck, ShieldCheck, ScanLine, Users, BrainCircuit, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, activePatient, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Activity },
    { href: '/scan', label: 'Scan Analyzer', icon: ScanLine },
    { href: '/patients', label: 'Patients & Records', icon: Users },
    { href: '/workflow', label: 'CNN+ViT Workflow', icon: BrainCircuit },
    { href: '/datasets', label: 'Datasets', icon: Database },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Natalis<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1.5 text-xs font-semibold md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Active Patient Badge */}
              <Link href="/patients">
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs hover:border-primary/50 transition">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">
                    Patient: <strong className="text-primary">{activePatient?.name || 'Elena Rostova'}</strong>
                  </span>
                </div>
              </Link>

              {/* Clinician Profile Badge */}
              <div className="flex items-center gap-2 border-l border-border pl-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-xs text-foreground">
                  <UserCheck className="h-4 w-4 text-primary" />
                </span>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold leading-tight text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-none">{user.hospital.split(' ')[0]} Hospital</p>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-full font-semibold gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Clinician Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
