import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'natalis_ai_jwt_secret_key_2026_maternal_fetal_screening_secure',
)

export interface ClinicJwtPayload {
  clinicId: string
  clinicName: string
  doctorName: string
  email: string
  role: string
  licenseNumber: string
  [key: string]: unknown
}

export async function signToken(payload: ClinicJwtPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  return token
}

export async function verifyToken(token: string): Promise<ClinicJwtPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as ClinicJwtPayload
  } catch (err) {
    return null
  }
}
