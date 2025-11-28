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
      className={`${bgClass} px-3 pt-8 transition-colors duration-500 sm:px-4 md:px-8 lg:px-16`}
    >
      <div className="mx-auto max-w-[90vw] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2200px]">
        <div className="mb-8 flex flex-col gap-12 md:flex-row md:justify-between md:gap-8">
          {/* Brand Column */}
          <div className="md:max-w-sm">
            <span
              className={`font-display mb-4 block text-base font-semibold tracking-tight ${titleColor}`}
            >
              echoe
            </span>
            <p className={`${textColor} mb-6 text-xs leading-relaxed`}>
              Building the operating system for the next generation of commerce. Simple, unified,
              and infinitely scalable.
            </p>
          </div>
          {/* Links Container */}
          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-6 md:flex md:w-auto md:flex-nowrap md:gap-12 lg:gap-20 xl:gap-32">
            {/* Product Links */}
            <div>
              <p className={`mb-2 text-[11px] font-medium sm:mb-3 sm:text-xs ${titleColor}`}>
                Product
              </p>
              <ul className={`space-y-1.5 text-[11px] sm:space-y-2 sm:text-xs ${textColor}`}>
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
                    className={`${hoverColor} transition-colors`}
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
                    className={`${hoverColor} transition-colors`}
                  >
                    Features
                  </button>
                </li>
                <li>
                  <a href="/pricing" className={`${hoverColor} transition-colors`}>
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
              <ul className={`space-y-1.5 text-[11px] sm:space-y-2 sm:text-xs ${textColor}`}>
                <li>
                  <a href="mailto:hello@echoe.co" className={`${hoverColor} transition-colors`}>
                    Contact
                  </a>
                </li>
                <li>
                  <span className={disabledColor}>Newsroom</span>
                </li>
                <li>
                  <span className={disabledColor}>Press Kit</span>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <p className={`mb-2 text-[11px] font-medium sm:mb-3 sm:text-xs ${titleColor}`}>
                Resources
              </p>
              <ul className={`space-y-1.5 text-[11px] sm:space-y-2 sm:text-xs ${textColor}`}>
                <li>
                  <span className={disabledColor}>Help Center</span>
                </li>
                <li>
                  <span className={disabledColor}>API Docs</span>
                </li>
                <li>
                  <span className={disabledColor}>Status</span>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <p className={`mb-2 text-[11px] font-medium sm:mb-3 sm:text-xs ${titleColor}`}>
                Legal
              </p>
              <ul className={`space-y-1.5 text-[11px] sm:space-y-2 sm:text-xs ${textColor}`}>
                <li>
                  <a href="/terms" className={`${hoverColor} transition-colors`}>
                    Terms
                  </a>
                </li>
                <li>
                  <a href="/privacy" className={`${hoverColor} transition-colors`}>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/cookie" className={`${hoverColor} transition-colors`}>
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="/refund" className={`${hoverColor} transition-colors`}>
                    Refunds
                  </a>
                </li>
              </ul>
            </div>
          </div>{' '}
          {/* End Links Container */}
        </div>

        {/* Bottom Bar */}
        <div className={`flex flex-col items-center justify-between gap-4 pt-4 pb-6 md:flex-row`}>
          <div className={`text-[10px] ${textColor}`}>
            © 2026 ECHO HQ CO., LTD. All rights reserved.
          </div>

          <div className="flex gap-6">
            <a
              href="mailto:hello@echoe.co"
              className={`text-[10px] ${textColor} ${hoverColor} transition-colors`}
            >
              hello@echoe.co
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterReact;
