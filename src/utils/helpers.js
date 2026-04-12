// ─── FORMAT UTILITIES ───────────────────────────────────────────────────────
export const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export const formatDate = (d) => {
  if (!d) return 'Mới đây';
  const date = new Date(d);
  if (isNaN(date.getTime())) return 'Mới đây';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  return imagePath;
};

// ─── SAFE LOCALSTORAGE ──────────────────────────────────────────────────────
export const safeStorage = {
  get: (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
};

// ─── STABLE SEEDED RANDOM ───────────────────────────────────────────────────
export const seededPercent = (id) => {
  if (!id) return 50;
  // Convert id to string and hash it
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return (hash % 70) + 15;
};
