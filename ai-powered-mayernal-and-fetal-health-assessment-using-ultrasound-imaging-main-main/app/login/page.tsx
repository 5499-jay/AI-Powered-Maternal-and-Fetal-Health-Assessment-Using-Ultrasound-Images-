'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  BrainCircuit,
  Eye,
  FileSpreadsheet,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  Building2,
  UserCheck,
  BadgeCheck,
  KeyRound,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('s.jenkins@stjude-maternity.org')
  const [password, setPassword] = useState('demo123456')

  // Registration states
  const [regClinicName, setRegClinicName] = useState('')
  const [regDoctorName, setRegDoctorName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regLicense, setRegLicense] = useState('')
  const [regRole, setRegRole] = useState('Lead Perinatal Sonographer')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    const res = await login(email, password)
    setIsLoading(false)

    if (res.success) {
      router.push('/')
    } else {
      setErrorMsg(res.error || 'Authentication failed.')
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    if (!regClinicName || !regDoctorName || !regEmail || !regPassword) {
      setErrorMsg('Please fill in all required fields.')
      setIsLoading(false)
      return
    }

    const res = await register({
      clinicName: regClinicName,
      doctorName: regDoctorName,
      email: regEmail,
      password: regPassword,
      licenseNumber: regLicense,
      role: regRole,
    })

    setIsLoading(false)

    if (res.success) {
      router.push('/')
    } else {
      setErrorMsg(res.error || 'Registration failed.')
    }
  }

  const handleDemoSignIn = async () => {
    setIsLoading(true)
    setErrorMsg(null)
    const res = await login('s.jenkins@stjude-maternity.org', 'demo123456')
    setIsLoading(false)
    if (res.success) {
      router.push('/')
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left panel - Decorative & Information */}
      <div className="hidden w-1/2 flex-col justify-between border-r border-border bg-card p-12 lg:flex relative overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Activity className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              Natalis<span className="text-primary">AI</span>
            </span>
          </div>

          <div className="mt-12 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Next-Gen Obstetric Diagnostics
            </div>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-tight">
              Enterprise Multi-Clinic AI Platform
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Secure JWT authenticated gateway for maternity centers, ultrasound clinics, and perinatal specialists. Combine CNN spatial feature extraction with Vision Transformers (ViT) and Explainable AI (XAI) Grad-CAM report generation.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 max-w-lg">
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-primary font-semibold text-sm">
                <KeyRound className="h-4 w-4" />
                <span>JWT Authentication</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Cryptographically signed JWT bearer tokens for full clinic isolation.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-primary font-semibold text-sm">
                <BrainCircuit className="h-4 w-4" />
                <span>CNN + ViT Engine</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Dual deep learning model for precision BPD, HC, AC, FL biometry.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-primary font-semibold text-sm">
                <Eye className="h-4 w-4" />
                <span>XAI Grad-CAM Heatmaps</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Visual explainability highlighting anatomical focus regions.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-primary font-semibold text-sm">
                <FileSpreadsheet className="h-4 w-4" />
                <span>CSV Patient Database</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Add, update, search, and export patient demographics to CSV/Excel.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Trust Badges */}
        <div className="relative z-10 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>JWT Bearer Security</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>HIPAA & DICOM 3.0 Ready</span>
          </div>
        </div>
      </div>

      {/* Right panel - Auth Forms */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 overflow-y-auto">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div>
            <div className="flex items-center gap-2.5 lg:hidden mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Natalis<span className="text-primary">AI</span>
              </span>
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Clinic Authentication
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your facility account or register a new clinic.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setErrorMsg(null)
              }}
              className={`rounded-lg py-2.5 transition ${
                mode === 'login'
                  ? 'bg-background text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In (Existing Clinic)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setErrorMsg(null)
              }}
              className={`rounded-lg py-2.5 transition ${
                mode === 'register'
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register New Clinic
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs font-semibold text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Clinic / Doctor Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    placeholder="s.jenkins@stjude-maternity.org"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-6 font-semibold shadow-md text-base gap-2"
              >
                {isLoading ? 'Authenticating Token…' : 'Sign in with JWT'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* REGISTER CLINIC FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Clinic / Hospital Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={regClinicName}
                    onChange={(e) => setRegClinicName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                    placeholder="e.g. Metro Perinatal & Fetal Care Clinic"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Doctor / Sonographer *
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={regDoctorName}
                      onChange={(e) => setRegDoctorName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="Dr. Alan Grant"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Medical License No.
                  </label>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={regLicense}
                      onChange={(e) => setRegLicense(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="LIC-8840-OB"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Clinic Account Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                    placeholder="doctor@metro-maternity.org"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Security Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
                    placeholder="Create a strong password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-6 font-semibold shadow-md text-base gap-2 bg-primary text-primary-foreground"
              >
                {isLoading ? 'Creating JWT Account…' : 'Register Clinic Account'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">
                Or Quick Access
              </span>
            </div>
          </div>

          {/* Quick Demo Login Button */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-xs font-medium text-foreground">
              Evaluating the platform? Access as St. Jude Hospital demo clinic.
            </p>
            <Button
              onClick={handleDemoSignIn}
              disabled={isLoading}
              variant="outline"
              className="mt-3 w-full rounded-xl border-primary/30 bg-background text-primary hover:bg-primary/10 font-semibold"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              1-Click Clinician Demo Sign-In (JWT)
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Protected by enterprise HS256 JWT encryption & bcrypt hashing. Authorized medical personnel only.
          </p>
        </div>
      </div>
    </div>
  )
}
