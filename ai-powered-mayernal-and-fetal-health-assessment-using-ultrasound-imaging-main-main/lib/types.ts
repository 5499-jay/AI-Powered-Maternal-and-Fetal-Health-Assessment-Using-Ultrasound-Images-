export type Severity = 'low' | 'moderate' | 'high'

export interface PatientInfo {
  name: string
  patientId: string
  age: number
  lmp: string
  gravidaPara: string
  clinicalIndication: string
  scanDate?: string
}

export interface ModelArchitectureInfo {
  architectureName: string
  cnnFeatureExtractor: string
  transformerEncoder: string
  fusionMechanism: string
  spatialResolution: string
  attentionHeads: number
}

export interface FeatureAttribution {
  feature: string
  importance: number
  description: string
}

export interface AnatomicalLandmark {
  name: string
  xPct: number
  yPct: number
  confidence: number
}

export interface XAIData {
  heatmapOverlayUrl?: string
  attentionHeatmapUrl?: string
  featureAttributions: FeatureAttribution[]
  anatomicalLandmarks: AnatomicalLandmark[]
  clinicalRationale: string
  primaryFocusRegion: string
}

export interface BiometryItem {
  name: string
  label: string
  valueMm: number
  percentile: number
}

export interface RiskFlag {
  label: string
  severity: Severity
  detail: string
}

export interface Analysis {
  isUltrasound: boolean
  planeType: string
  imageQuality: {
    rating: 'poor' | 'adequate' | 'good' | 'excellent'
    note: string
  }
  gestationalAge: {
    weeks: number
    days: number
    method: string
  }
  biometry: BiometryItem[]
  estimatedFetalWeight: {
    grams: number
    percentile: number
  }
  observations: string[]
  riskFlags: RiskFlag[]
  overallAssessment: string
  confidence: number
  patientInfo?: PatientInfo
  modelArchitecture?: ModelArchitectureInfo
  xai?: XAIData
}
