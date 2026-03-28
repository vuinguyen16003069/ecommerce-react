import { useState, useEffect } from 'react'
import { safeStorage } from '../utils/helpers'

export function useStickyState(key, defaultValue) {
  const [value, setValue] = useState(() => safeStorage.get(key, defaultValue))

  useEffect(() => {
    safeStorage.set(key, value)
  }, [key, value])

  return [value, setValue]
}
