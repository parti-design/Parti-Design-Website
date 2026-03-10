/**
 * getMeUser — previously used Payload JWT authentication.
 * With Keystatic, user management is handled by GitHub OAuth in production.
 * This stub is kept to avoid breaking any remaining references.
 * TODO: Remove if no longer needed.
 */

export const getMeUser = async (_args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}) => {
  // Stub — Payload auth no longer exists
  return null
}
