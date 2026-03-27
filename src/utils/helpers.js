// ─── FORMAT UTILITIES ───────────────────────────────────────────────────────
export const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

// ─── SAFE LOCALSTORAGE ──────────────────────────────────────────────────────
export const safeStorage = {
  get: (key, fallback) => {
    try {
      const v = localStorage.getItem(key)
      return v !== null ? JSON.parse(v) : fallback
    } catch {
      return fallback
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  },
}

// ─── STABLE SEEDED RANDOM ───────────────────────────────────────────────────
export const seededPercent = (id) => ((id * 37 + 13) % 70) + 15
