import { useState, useEffect } from 'react'

export function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value)

  useEffect(() => {
    const h = setTimeout(() => setDeb(value), delay)
    return () => clearTimeout(h)
  }, [value, delay])

  return deb
}
