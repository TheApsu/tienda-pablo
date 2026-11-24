type ErrorLike = {
  message?: string
  code?: string
}

const POSTGRES_ERRORS: Record<string, string> = {
  '23505': 'Ya existe un registro con ese nombre.',
  '23503': 'No se puede completar: el registro está relacionado con otros datos.',
  '23514': 'Algún valor no cumple las reglas permitidas.',
  '42501': 'No tienes permisos para realizar esta acción.',
  PGRST116: 'No se encontró el registro.',
  PGRST202: 'Falta una función en la base de datos. ¿Ejecutaste la migración de Supabase?',
  PGRST205: 'Faltan tablas en la base de datos. ¿Ejecutaste la migración de Supabase?',
}

const AUTH_ERRORS: Record<string, string> = {
  invalid_credentials: 'Correo o contraseña incorrectos.',
  email_not_confirmed: 'Debes confirmar tu correo antes de iniciar sesión.',
  over_request_rate_limit: 'Demasiados intentos. Espera un momento.',
}

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Ocurrió un error inesperado.'
  if (typeof error === 'string') return error

  const { code, message } = error as ErrorLike

  if (code && POSTGRES_ERRORS[code]) return POSTGRES_ERRORS[code]
  if (code && AUTH_ERRORS[code]) return AUTH_ERRORS[code]
  if (message?.includes('row-level security')) return POSTGRES_ERRORS['42501']
  if (message && /failed to fetch|load failed|networkerror/i.test(message)) return 'No hay conexión con el servidor.'

  return message || 'Ocurrió un error inesperado.'
}
