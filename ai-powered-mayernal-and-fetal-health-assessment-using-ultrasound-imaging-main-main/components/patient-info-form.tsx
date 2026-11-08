'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  User,
  Hash,
  Calendar,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Plus,
  Pencil,
  Trash2,
  FileSpreadsheet,
  FileText,
  Save,
  X,
  RefreshCw,
  Users,
  Search,
  History,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth, DEFAULT_PATIENT } from '@/lib/auth-context'
import { PatientHistoryTimeline } from '@/components/patient-history-timeline'
import type { PatientInfo } from '@/lib/types'

const EMPTY_PATIENT: PatientInfo = {
  name: '',
  patientId: '',
  age: 0,
  lmp: '',
  gravidaPara: '',
  clinicalIndication: '',
  scanDate: new Date().toISOString().split('T')[0],
}

type Tab = 'active' | 'records' | 'history'
type FormMode = 'view' | 'add' | 'edit'

export function PatientInfoForm({
  onChange,
}: {
  onChange?: (patient: PatientInfo) => void
}) {
  const { activePatient, setActivePatient } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const [tab, setTab] = useState<Tab>('active')
  const [formMode, setFormMode] = useState<FormMode>('view')
  const [patient, setPatient] = useState<PatientInfo>(activePatient || DEFAULT_PATIENT)
  const [formPatient, setFormPatient] = useState<PatientInfo>(EMPTY_PATIENT)
  const [savedPatients, setSavedPatients] = useState<PatientInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/patients')
      const data = await res.json()
      if (data.patients) {
        const parsed: PatientInfo[] = data.patients.map((p: Record<string, string>) => ({
          name: p.name,
          patientId: p.patientId,
          age: parseInt(p.age) || 0,
          lmp: p.lmp,
          gravidaPara: p.gravidaPara,
          clinicalIndication: p.clinicalIndication,
          scanDate: p.scanDate,
        }))
        setSavedPatients(parsed)
      }
    } catch {
      setError('Could not load patient records.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const handleActiveChange = (field: keyof PatientInfo, value: string | number) => {
    const updated = { ...patient, [field]: value }
    setPatient(updated)
    setActivePatient(updated)
    if (onChange) onChange(updated)
  }

  const handleSelectPatient = (p: PatientInfo) => {
    setPatient(p)
    setActivePatient(p)
    if (onChange) onChange(p)
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
    setTab('active')
  }

  const handleFormChange = (field: keyof PatientInfo, value: string | number) => {
    setFormPatient((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const generateMRN = () => {
    const id = `PT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`
    setFormPatient((prev) => ({ ...prev, patientId: id }))
  }

  const handleSavePatient = async () => {
    if (!formPatient.name || !formPatient.patientId) {
      setError('Patient Name and MRN are required.')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const method = formMode === 'edit' ? 'PUT' : 'POST'
      const res = await fetch('/api/patients', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPatient),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save patient.')
        return
      }
      await fetchPatients()
      setSaveStatus('saved')
      setFormMode('view')
      handleSelectPatient(formPatient)
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setError('Failed to save patient. Please try again.')
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePatient = async (patientId: string) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return
    try {
      await fetch(`/api/patients?patientId=${patientId}`, { method: 'DELETE' })
      await fetchPatients()
    } catch {
      setError('Failed to delete patient.')
    }
  }

  const handleDownload = (format: 'csv' | 'excel') => {
    window.open(`/api/patients?format=${format}`, '_blank')
  }

  const openAddForm = () => {
    setFormPatient({ ...EMPTY_PATIENT, scanDate: new Date().toISOString().split('T')[0] })
    setFormMode('add')
    setError(null)
  }

  const openEditForm = (p: PatientInfo) => {
    setFormPatient({ ...p })
    setFormMode('edit')
    setError(null)
  }

  const filteredPatients = savedPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clinicalIndication.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between p-5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-base font-bold text-foreground">
                Patient Demographics & Medical History
              </p>
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {patient.name || 'No Patient'} · MRN: {patient.patientId} · Age: {patient.age}y · {patient.gravidaPara}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="border-t border-border">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-border px-5 pt-3 overflow-x-auto">
            <button
              onClick={() => { setTab('active'); setFormMode('view') }}
              className={`rounded-t-lg px-4 py-2 text-xs font-semibold transition ${
                tab === 'active'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Active Patient
            </button>
            <button
              onClick={() => { setTab('records'); setFormMode('view') }}
              className={`rounded-t-lg px-4 py-2 text-xs font-semibold transition flex items-center gap-1.5 ${
                tab === 'records'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Patient Database
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                {savedPatients.length}
              </span>
            </button>
            <button
              onClick={() => { setTab('history'); setFormMode('view') }}
              className={`rounded-t-lg px-4 py-2 text-xs font-semibold transition flex items-center gap-1.5 ${
                tab === 'history'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="h-3.5 w-3.5 text-primary" />
              Scan History Timeline
            </button>
          </div>

          {/* ─── Active Patient Tab ─── */}
          {tab === 'active' && (
            <div className="p-5 space-y-4">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Select Active Patient Record
                </p>
                <div className="flex flex-wrap gap-2">
                  {savedPatients.map((p) => (
                    <button
                      key={p.patientId}
                      type="button"
                      onClick={() => handleSelectPatient(p)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                        patient.patientId === p.patientId
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {p.name} ({p.patientId})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Patient Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={patient.name}
                      onChange={(e) => handleActiveChange('name', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="Patient Full Name" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Medical Record No. (MRN)</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={patient.patientId}
                      onChange={(e) => handleActiveChange('patientId', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="PT-2026-XXXX" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Age & Obstetric History</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={patient.age}
                      onChange={(e) => handleActiveChange('age', parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="Age (yrs)" />
                    <input type="text" value={patient.gravidaPara}
                      onChange={(e) => handleActiveChange('gravidaPara', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="G2P1" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Last Menstrual Period (LMP)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="date" value={patient.lmp}
                      onChange={(e) => handleActiveChange('lmp', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Clinical Indication & Risk Symptoms</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={patient.clinicalIndication}
                      onChange={(e) => handleActiveChange('clinicalIndication', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="e.g. Routine Scan, Suspected FGR, Hydrocephalus screen" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  onClick={() => setTab('history')}
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5 text-xs font-semibold"
                >
                  <History className="h-3.5 w-3.5 text-primary" />
                  View Scan History ({patient.name})
                </Button>

                <Button
                  size="sm"
                  className="rounded-full gap-2 text-xs font-semibold"
                  onClick={async () => {
                    await fetch('/api/patients', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(patient),
                    }).catch(() => {})
                    await fetchPatients()
                    setSaveStatus('saved')
                    setTimeout(() => setSaveStatus('idle'), 2500)
                  }}
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Patient Record
                </Button>
              </div>
            </div>
          )}

          {/* ─── Patient Database Tab ─── */}
          {tab === 'records' && formMode === 'view' && (
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, MRN, or indication…"
                    className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={fetchPatients} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" title="Refresh">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button onClick={() => handleDownload('csv')} variant="outline" size="sm" className="rounded-full gap-1.5 text-xs font-semibold">
                    <FileText className="h-3.5 w-3.5 text-primary" /> CSV
                  </Button>
                  <Button onClick={() => handleDownload('excel')} variant="outline" size="sm" className="rounded-full gap-1.5 text-xs font-semibold">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-primary" /> Excel
                  </Button>
                  <Button onClick={openAddForm} size="sm" className="rounded-full gap-1.5 text-xs font-semibold">
                    <Plus className="h-3.5 w-3.5" /> Add Patient
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/70 text-foreground font-semibold uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-2.5">Patient</th>
                      <th className="px-4 py-2.5">MRN</th>
                      <th className="px-4 py-2.5">Age / OB History</th>
                      <th className="px-4 py-2.5">LMP</th>
                      <th className="px-4 py-2.5">Clinical Indication</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                          Loading patient records…
                        </td>
                      </tr>
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No patients found. Click <strong>Add Patient</strong> to create a new record.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((p) => (
                        <tr
                          key={p.patientId}
                          className={`hover:bg-muted/30 transition cursor-pointer ${
                            patient.patientId === p.patientId ? 'bg-primary/5 border-l-2 border-primary' : ''
                          }`}
                          onClick={() => handleSelectPatient(p)}
                        >
                          <td className="px-4 py-3 font-semibold text-foreground">{p.name}</td>
                          <td className="px-4 py-3 font-mono text-muted-foreground">{p.patientId}</td>
                          <td className="px-4 py-3 text-muted-foreground">{p.age}y · {p.gravidaPara}</td>
                          <td className="px-4 py-3 text-muted-foreground">{p.lmp}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">{p.clinicalIndication}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                onClick={() => openEditForm(p)}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-primary"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                onClick={() => handleDeletePatient(p.patientId)}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Add / Edit Patient Form ─── */}
          {tab === 'records' && (formMode === 'add' || formMode === 'edit') && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-foreground">
                  {formMode === 'add' ? '➕ Add New Patient' : '✏️ Edit Patient Record'}
                </h3>
                <Button onClick={() => { setFormMode('view'); setError(null) }} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-2.5 text-xs text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Patient Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={formPatient.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="e.g. Elena Rostova" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Medical Record No. (MRN) *</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input type="text" value={formPatient.patientId}
                        onChange={(e) => handleFormChange('patientId', e.target.value)}
                        disabled={formMode === 'edit'}
                        className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
                        placeholder="PT-2026-XXXX" />
                    </div>
                    {formMode === 'add' && (
                      <Button onClick={generateMRN} variant="outline" size="sm" className="rounded-xl text-xs whitespace-nowrap">
                        Auto
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Age (years)</label>
                  <input type="number" value={formPatient.age || ''}
                    onChange={(e) => handleFormChange('age', parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                    placeholder="e.g. 29" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Obstetric History (Gravida/Para)</label>
                  <input type="text" value={formPatient.gravidaPara}
                    onChange={(e) => handleFormChange('gravidaPara', e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                    placeholder="e.g. G2P1" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Last Menstrual Period (LMP)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="date" value={formPatient.lmp}
                      onChange={(e) => handleFormChange('lmp', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Scan Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="date" value={formPatient.scanDate}
                      onChange={(e) => handleFormChange('scanDate', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Clinical Indication & Notes</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input type="text" value={formPatient.clinicalIndication}
                      onChange={(e) => handleFormChange('clinicalIndication', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                      placeholder="e.g. Routine 2nd Trimester Biometry & Anomaly Scan" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <p className="text-[11px] text-muted-foreground">* Required fields.</p>
                <div className="flex gap-2">
                  <Button onClick={() => { setFormMode('view'); setError(null) }} variant="outline" size="sm" className="rounded-full text-xs">
                    Cancel
                  </Button>
                  <Button onClick={handleSavePatient} disabled={isSaving} size="sm" className="rounded-full gap-1.5 text-xs font-semibold">
                    {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    {formMode === 'add' ? 'Add Patient' : 'Update Patient'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Scan History Timeline Tab ─── */}
          {tab === 'history' && (
            <div className="p-5">
              <PatientHistoryTimeline patient={patient} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
