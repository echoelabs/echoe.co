import React from 'react';

interface FooterProps {
  darkMode?: boolean;
}

const FooterReact: React.FC<FooterProps> = ({ darkMode = false }) => {
  const textColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const titleColor = darkMode ? 'text-white' : 'text-gray-900';
  const hoverColor = darkMode ? 'hover:text-white' : 'hover:text-black';
  const disabledColor = darkMode
    ? 'text-gray-600 cursor-not-allowed'
    : 'text-gray-300 cursor-not-allowed';
  const bgClass = darkMode ? 'bg-transparent border-none' : 'bg-white border-t border-gray-100';

  return (
    <footer
      id="contact"
      className={`${bgClass} px-6 pt-6 transition-colors duration-500 sm:pt-8 md:px-8 lg:px-16`}
    >
      <div className="mx-auto max-w-[90vw] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2200px]">
        <div className="mb-6 flex flex-col gap-6 sm:mb-8 sm:gap-8 md:flex-row md:justify-between md:gap-12">
          {/* Brand Column */}
          <div className="md:max-w-sm">
            <span
              className={`font-display mb-4 block text-base font-semibold tracking-tight ${titleColor}`}
            >
              echoe
            </span>
            <p className={`${textColor} mb-4 text-xs leading-relaxed sm:mb-6`}>
              Building the operating system for the next generation of commerce. Simple, unified,
              and infinitely scalable.
            </p>
            {/* Mobile-only inline links */}
            <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:hidden">
              <a href="/terms" className={`${hoverColor} ${textColor} transition-colors`}>
                Terms
              </a>
              <a href="/privacy" className={`${hoverColor} ${textColor} transition-colors`}>
                Privacy
              </a>
              <a href="/cookie" className={`${hoverColor} ${textColor} transition-colors`}>
                Cookies
              </a>
              <a href="/refund" className={`${hoverColor} ${textColor} transition-colors`}>
                Refunds
              </a>
            </div>
          </div>
          {/* Links Container - Hidden on mobile */}
          <div className="hidden w-full sm:grid sm:grid-cols-4 sm:gap-6 md:flex md:w-auto md:flex-nowrap md:gap-12 lg:gap-20 xl:gap-32">
            {/* Product Links */}
            <div>
              <p className={`mb-2 text-[11px] font-medium sm:mb-3 sm:text-xs ${titleColor}`}>
                Product
              </p>
              <ul className={`space-y-0.5 text-xs sm:space-y-1 ${textColor}`}>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('simulation-window');
                      if (el) {
                        const headerOffset = 80;
                        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({
                          top: elementPosition - headerOffset,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    className={`${hoverColor} -mx-1 block px-1 py-1.5 transition-colors`}
                  >
                    Simulation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('features');
                      if (el) {
                        const headerOffset = 40;
                        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({
                          top: elementPosition - headerOffset,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    className={`${hoverColor} -mx-1 block px-1 py-1.5 transition-colors`}
                  >
                    Features
                  </button>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className={`${hoverColor} -mx-1 block px-1 py-1.5 transition-colors`}
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <p className={`mb-2 text-[11px] font-medium sm:mb-3 sm:text-xs ${titleColor}`}>
                Company
              </p>
              <ul className={`space-y-0.5 text-xs sm:space-y-1 ${textColor}`}>
                <li>
                  <button
                    onClick={() => (window.location.href = 'mailto:hello@echoe.co')}
                    className={`${hoverColor} -mx-1 block px-1 py-1.5 text-left transition-colors`}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <span className={`${disabledColor} -mx-1 block px-1 py-1.5`}>Newsroom</span>
                </li>
                <li>
                  <span className={`${disabledColor} -mx-1 block px-1 py-1.5`}>Press Kit</span>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <p className={`mb-2 text-[11px] font-medium sm:mb-3 sm:text-xs ${titleColor}`}>
                Resources
              </p>
              <ul className={`space-y-0.5 text-xs sm:space-y-1 ${textColor}`}>
                <li>
                  <span className={`${disabledColor} -mx-1 block px-1 py-1.5`}>Help Center</span>
                </li>
                <li>
                  <span className={`${disabledColor} -mx-1 block px-1 py-1.5`}>API Docs</span>
                </li>
                <li>
                  <span className={`${disabledColor} -mx-1 block px-1 py-1.5`}>Status</span>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <p className={`mb-2 text-[11px] font-medium sm:mb-3 sm:text-xs ${titleColor}`}>
                Legal
              </p>
              <ul className={`space-y-0.5 text-xs sm:space-y-1 ${textColor}`}>
                <li>
                  <a
                    href="/terms"
                    className={`${hoverColor} -mx-1 block px-1 py-1.5 transition-colors`}
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className={`${hoverColor} -mx-1 block px-1 py-1.5 transition-colors`}
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/cookie"
                    className={`${hoverColor} -mx-1 block px-1 py-1.5 transition-colors`}
                  >
                    Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="/refund"
                    className={`${hoverColor} -mx-1 block px-1 py-1.5 transition-colors`}
                  >
                    Refunds
                  </a>
                </li>
              </ul>
            </div>
          </div>{' '}
          {/* End Links Container */}
        </div>

        {/* Bottom Bar */}
        <div
          className={`flex items-center justify-between gap-2 pt-3 pb-4 sm:pt-4 sm:pb-6`}
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className={`text-[10px] ${textColor}`}>© 2026 ECHO HQ CO., LTD.</div>
          <button
            onClick={() => (window.location.href = 'mailto:hello@echoe.co')}
            className={`text-[10px] ${textColor} ${hoverColor} transition-colors`}
          >
            hello@echoe.co
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterReact;
