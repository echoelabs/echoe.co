import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { trackNavClick, trackButtonClick } from '../services/analytics';

// Helper component for animated nav items
const NavItem: React.FC<{
  isActive: boolean;
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}> = ({ isActive, onClick, href, children }) => {
  const baseClass = 'hover:text-black origin-center inline-block';
  const style = {
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    color: isActive ? '#000' : undefined,
    fontWeight: isActive ? 600 : 500,
    transition: 'transform 0.3s ease-out, color 0.3s ease-out, font-weight 0.3s ease-out',
    willChange: 'transform, color, font-weight',
  };

  if (href) {
    return (
      <a href={href} className={baseClass} style={style} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClass} style={style}>
      {children}
    </button>
  );
};

interface HeaderProps {
  currentPath?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath }) => {
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Get current path from props or window
  const pathname = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const isHomePage = pathname === '/';

  // Sync activePath
  useEffect(() => {
    setActivePath(pathname);
    setHidden(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Track active section on home page
  useEffect(() => {
    if (!isHomePage) {
      setActiveSection(null);
      return;
    }

    const sections = ['demo', 'features', 'pricing'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrolledToBottom = window.scrollY + windowHeight >= docHeight - 100;

      if (scrolledToBottom) {
        setActiveSection('contact');
        return;
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      if (window.scrollY < 100) {
        setActiveSection(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!isHomePage) {
      setHidden(false);
      return;
    }

    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;
    const distanceFromBottom = maxScroll - latest;

    // Dynamic thresholds based on EarlyAccess.tsx responsive heights
    // Mobile (<640px): h-[200vh]
    // SM (>=640px): h-[350vh]
    // MD (>=768px): h-[500vh]
    // LG (>=1024px): h-[800vh]

    let sectionMult = 8;
    let footerMult = 2.5;

    if (window.innerWidth < 640) {
      sectionMult = 1.5; // Delayed hide: only hide when very deep into section
      footerMult = 0.6; // Show earlier on mobile scroller
    } else if (window.innerWidth < 768) {
      sectionMult = 3.5;
      footerMult = 1.2;
    } else if (window.innerWidth < 1024) {
      sectionMult = 5;
      footerMult = 1.8;
    }

    const parallaxZoneThreshold = winHeight * sectionMult;
    const footerVisibleThreshold = winHeight * footerMult;

    if (distanceFromBottom < parallaxZoneThreshold && distanceFromBottom > footerVisibleThreshold) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const scrollToSection = (id: string) => {
    trackNavClick(id);
    setActiveSection(id);

    window.disableAutoScroll = true;
    setTimeout(() => {
      window.disableAutoScroll = false;
    }, 5000);

    const headerOffset = 80;
    const lenis = window.lenis;
    if (id === 'contact') {
      if (lenis) {
        lenis.scrollTo(document.documentElement.scrollHeight, { immediate: false });
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    if (lenis) {
      lenis.scrollTo(element, { offset: -headerOffset });
    } else {
      element.style.scrollMarginTop = `${headerOffset}px`;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      initial="visible"
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b px-4 py-3 shadow-none transition-[background-color,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-5 md:px-8 lg:px-16 ${mobileMenuOpen ? 'border-gray-100 bg-white' : 'border-transparent bg-white'}`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="touch-target -ml-3 p-3 text-gray-600 transition-colors hover:text-black md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {isHomePage ? (
          <div
            className="relative z-10 flex cursor-pointer items-center gap-2"
            onClick={() => {
              const lenis = window.lenis;
              if (lenis) {
                lenis.scrollTo(0);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span className="font-display text-lg font-semibold tracking-tight text-black">
              echoe
            </span>
          </div>
        ) : (
          <a href="/" className="relative z-10 flex items-center gap-2">
            <span className="font-display text-lg font-semibold tracking-tight text-black">
              echoe
            </span>
          </a>
        )}
      </div>

      <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-xs font-medium text-gray-600 md:flex">
        {isHomePage ? (
          <div className="flex items-center gap-8">
            <NavItem isActive={activeSection === 'demo'} onClick={() => scrollToSection('demo')}>
              Simulation
            </NavItem>
            <NavItem
              isActive={activeSection === 'features'}
              onClick={() => scrollToSection('features')}
            >
              Features
            </NavItem>
            <NavItem
              isActive={activeSection === 'pricing'}
              onClick={() => scrollToSection('pricing')}
            >
              Pricing
            </NavItem>
            <NavItem
              isActive={activeSection === 'contact'}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </NavItem>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <NavItem isActive={activePath === '/'} href="/">
              Home
            </NavItem>
            <NavItem isActive={activePath === '/terms'} href="/terms">
              Terms
            </NavItem>
            <NavItem isActive={activePath === '/privacy'} href="/privacy">
              Privacy
            </NavItem>
            <NavItem isActive={activePath === '/cookie'} href="/cookie">
              Cookies
            </NavItem>
            <NavItem isActive={activePath === '/refund'} href="/refund">
              Refund
            </NavItem>
            <NavItem isActive={activePath === '/disclaimer'} href="/disclaimer">
              Disclaimer
            </NavItem>
          </div>
        )}
      </nav>

      <div className="relative z-10 flex items-center gap-3">
        <button
          onClick={() => {
            trackButtonClick('get_started', 'header');
            if (isHomePage) {
              scrollToSection('pricing');
            } else {
              window.location.href = '/pricing';
            }
          }}
          className="touch-target rounded-full bg-black px-4 py-2.5 text-xs font-medium text-white shadow-md shadow-black/20 transition-all hover:scale-105 hover:bg-gray-800 active:scale-95"
        >
          Get Started
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full right-0 left-0 overflow-hidden border-b border-gray-100 bg-white shadow-lg md:hidden"
          >
            <nav className="flex flex-col px-4 py-4">
              {isHomePage ? (
                <>
                  <button
                    onClick={() => {
                      scrollToSection('demo');
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-lg px-4 py-3.5 text-left text-sm font-medium transition-colors ${activeSection === 'demo' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Simulation
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('features');
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-lg px-4 py-3.5 text-left text-sm font-medium transition-colors ${activeSection === 'features' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Features
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('pricing');
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-lg px-4 py-3.5 text-left text-sm font-medium transition-colors ${activeSection === 'pricing' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('contact');
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-lg px-4 py-3.5 text-left text-sm font-medium transition-colors ${activeSection === 'contact' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Contact
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/"
                    className={`rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${activePath === '/' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Home
                  </a>
                  <a
                    href="/terms"
                    className={`rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${activePath === '/terms' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Terms
                  </a>
                  <a
                    href="/privacy"
                    className={`rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${activePath === '/privacy' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Privacy
                  </a>
                  <a
                    href="/cookie"
                    className={`rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${activePath === '/cookie' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Cookies
                  </a>
                  <a
                    href="/refund"
                    className={`rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${activePath === '/refund' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Refund
                  </a>
                  <a
                    href="/disclaimer"
                    className={`rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${activePath === '/disclaimer' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Disclaimer
                  </a>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
