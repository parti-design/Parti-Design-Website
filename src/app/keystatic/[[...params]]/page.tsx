/**
 * Catch-all page route for the Keystatic admin UI.
 * All /keystatic/* paths are handled by the Keystatic React app.
 */
import { KeystaticApp } from '../keystatic'

export default function Page() {
  return <KeystaticApp />
}
