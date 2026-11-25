// Returns null if the file is OK, or an error message.
export function validatePhoto(file: File): string | null {
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') return 'Only JPG or PNG photos are allowed'
  if (file.size > 1024 * 1024) return 'Photo is larger than 1 MB'
  return null
}
