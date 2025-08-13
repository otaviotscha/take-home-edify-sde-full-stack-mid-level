export const isAdmin = (userRole: string) => {
  const isAdmin = userRole.toLowerCase() === 'teacher'
  if (!isAdmin) {
    return false
  }
  return true
}
