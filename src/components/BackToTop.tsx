import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check initial scroll position
    setIsVisible(window.scrollY > 300);

    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    // Use Lenis if available - force interrupts current scroll
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        duration: 0.8,
        force: true,
        lock: true,
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`touch-target fixed right-4 bottom-20 z-50 rounded-full bg-black p-3.5 text-white shadow-lg shadow-black/20 transition-all duration-150 hover:scale-110 hover:bg-gray-800 active:scale-95 sm:right-6 sm:bottom-6 sm:p-3 ${
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
};

export default BackToTop;
