import { useState, useEffect } from 'react'
import { safeStorage } from '../utils/helpers'

// ─── PERSISTENT STATE (localStorage) ────────────────────────────────────────
export function useStickyState(key, defaultValue) {
  const [value, setValue] = useState(() => safeStorage.get(key, defaultValue))

  useEffect(() => {
    safeStorage.set(key, value)
  }, [key, value])

  return [value, setValue]
}

// ─── DEBOUNCE HOOK ──────────────────────────────────────────────────────────
export function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value)

  useEffect(() => {
    const h = setTimeout(() => setDeb(value), delay)
    return () => clearTimeout(h)
  }, [value, delay])

  return deb
}
