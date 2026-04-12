import { useState, useEffect } from 'react';
import { ChevronUp } from './Icons';

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-3 rounded-full shadow-xl hover:bg-orange-700 transition hover:-translate-y-1 active:translate-y-0 cursor-pointer"
    >
      <ChevronUp size={20} />
    </button>
  );
};
