'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { PatientInfo } from '@/lib/types'

export interface User {
  clinicId?: string
  name: string
  email: string
  role: string
  hospital: string
  licenseNumber?: string
  token?: string
}

const DEFAULT_USER: User = {
  clinicId: 'CLN-2026-001',
  name: 'Dr. Sarah Jenkins',
  email: 's.jenkins@stjude-maternity.org',
  role: 'Lead Perinatal Sonographer',
  hospital: 'St. Jude Women & Children Hospital',
  licenseNumber: 'MD-8841-OBGYN',
}

export const DEFAULT_PATIENT: PatientInfo = {
  name: 'Elena Rostova',
  patientId: 'PT-2026-8841',
  age: 29,
  lmp: '2026-01-15',
  gravidaPara: 'G2P1',
  clinicalIndication: 'Routine 2nd Trimester Anomaly Scan & Biometry',
  scanDate: '2026-08-05',
}

interface RegisterParams {
  clinicName: string
  doctorName: string
  email: string
  password: string
  licenseNumber?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  activePatient: PatientInfo
  setActivePatient: (patient: PatientInfo) => void
  login: (email?: string, password?: string) => Promise<{ success: boolean; error?: string }>
  register: (params: RegisterParams) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [activePatient, setActivePatient] = useState<PatientInfo>(DEFAULT_PATIENT)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('natalis_jwt')
      const savedPatient = localStorage.getItem('natalis_patient')

      if (savedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          })
          if (res.ok) {
            const data = await res.json()
            if (data.user) {
              const u: User = {
                clinicId: data.user.clinicId,
                name: data.user.doctorName || data.user.name,
                email: data.user.email,
                role: data.user.role,
                hospital: data.user.clinicName || data.user.hospital,
                licenseNumber: data.user.licenseNumber,
                token: savedToken,
              }
              setUser(u)
              setToken(savedToken)
            }
          } else {
            // Token expired or invalid, clear
            localStorage.removeItem('natalis_jwt')
            setUser(DEFAULT_USER)
          }
        } catch {
          setUser(DEFAULT_USER)
        }
      } else {
        // Fallback default user for smooth initial experience
        setUser(DEFAULT_USER)
      }

      if (savedPatient) {
        try {
          setActivePatient(JSON.parse(savedPatient))
        } catch {
          setActivePatient(DEFAULT_PATIENT)
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email?: string, password?: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || DEFAULT_USER.email,
          password: password || 'demo123456',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setIsLoading(false)
        return { success: false, error: data.error || 'Login failed.' }
      }

      const loggedInUser: User = {
        clinicId: data.user.clinicId,
        name: data.user.doctorName,
        email: data.user.email,
        role: data.user.role,
        hospital: data.user.clinicName,
        licenseNumber: data.user.licenseNumber,
        token: data.token,
      }

      setUser(loggedInUser)
      setToken(data.token)
      localStorage.setItem('natalis_jwt', data.token)
      localStorage.setItem('natalis_user', JSON.stringify(loggedInUser))
      setIsLoading(false)
      return { success: true }
    } catch {
      setIsLoading(false)
      return { success: false, error: 'Network error during login.' }
    }
  }

  const register = async (params: RegisterParams) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const data = await res.json()

      if (!res.ok) {
        setIsLoading(false)
        return { success: false, error: data.error || 'Registration failed.' }
      }

      const newUser: User = {
        clinicId: data.user.clinicId,
        name: data.user.doctorName,
        email: data.user.email,
        role: data.user.role,
        hospital: data.user.clinicName,
        licenseNumber: data.user.licenseNumber,
        token: data.token,
      }

      setUser(newUser)
      setToken(data.token)
      localStorage.setItem('natalis_jwt', data.token)
      localStorage.setItem('natalis_user', JSON.stringify(newUser))
      setIsLoading(false)
      return { success: true }
    } catch {
      setIsLoading(false)
      return { success: false, error: 'Network error during registration.' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('natalis_jwt')
    localStorage.removeItem('natalis_user')
  }

  const handleSetActivePatient = (patient: PatientInfo) => {
    setActivePatient(patient)
    localStorage.setItem('natalis_patient', JSON.stringify(patient))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activePatient,
        setActivePatient: handleSetActivePatient,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
