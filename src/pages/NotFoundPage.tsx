import React from 'react';

/**
 * Standalone custom 404 Error Page for Montessori Pod.
 * Rendered without the site navbar, footer, or interactive navigation buttons.
 */
export const NotFoundPage: React.FC = () => {
  return (
    <main
      aria-labelledby="not-found-title"
      className="relative min-h-[100dvh] w-full flex items-center justify-center bg-cream dark:bg-forest-950 px-4 sm:px-6 py-12 overflow-hidden"
    >
      {/* Subtle organic botanical ambient accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sage-200/40 dark:bg-forest-800/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-beige-300/45 dark:bg-forest-900/40 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-xl mx-auto text-center">
        {/* Minimal Montessori Sprout & Wooden Blocks Illustration */}
        <div className="mx-auto mb-7 flex items-center justify-center">
          <div className="inline-flex items-center justify-center px-6 py-5 rounded-3xl bg-white/90 dark:bg-forest-900/80 border border-beige-300/80 dark:border-forest-700/80 shadow-soft">
            <svg
              viewBox="0 0 220 120"
              className="w-44 sm:w-52 h-auto"
              role="img"
              aria-label="Montessori wooden blocks and sprout illustration"
            >
              {/* Soft ground shelf line */}
              <line
                x1="22"
                y1="104"
                x2="198"
                y2="104"
                stroke="#C5D5C6"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Left Wooden Block: A */}
              <g transform="translate(36 52) rotate(-6 22 22)">
                <rect
                  x="0"
                  y="0"
                  width="44"
                  height="44"
                  rx="8"
                  fill="#FBF5F2"
                  stroke="#C98263"
                  strokeWidth="2.5"
                />
                <text
                  x="22"
                  y="30"
                  textAnchor="middle"
                  fill="#944E31"
                  fontFamily="Playfair Display, Georgia, serif"
                  fontWeight="700"
                  fontSize="23"
                >
                  A
                </text>
              </g>

              {/* Center Forest-Green Sprout Emblem */}
              <g transform="translate(88 46)">
                <rect
                  x="0"
                  y="0"
                  width="44"
                  height="52"
                  rx="10"
                  fill="#273829"
                  stroke="#435B45"
                  strokeWidth="2"
                />
                <g
                  transform="translate(10 14)"
                  fill="none"
                  stroke="#FAF7F0"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 20h10" />
                  <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                  <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                  <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
                </g>
              </g>

              {/* Right Wooden Block: B */}
              <g transform="translate(140 52) rotate(6 22 22)">
                <rect
                  x="0"
                  y="0"
                  width="44"
                  height="44"
                  rx="8"
                  fill="#F4F7F2"
                  stroke="#627750"
                  strokeWidth="2.5"
                />
                <text
                  x="22"
                  y="30"
                  textAnchor="middle"
                  fill="#344936"
                  fontFamily="Playfair Display, Georgia, serif"
                  fontWeight="700"
                  fontSize="23"
                >
                  B
                </text>
              </g>

              {/* Decorative gentle dotted trail */}
              <path
                d="M28 32 Q110 8 190 30"
                fill="none"
                stroke="#9CAF88"
                strokeWidth="2"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />
              <circle cx="192" cy="30" r="3.5" fill="#7E9568" />
            </svg>
          </div>
        </div>

        {/* Large Serif 404 Display */}
        <p className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-forest-700 dark:text-sage-300 leading-none mb-4">
          404
        </p>

        {/* Main Heading */}
        <h1
          id="not-found-title"
          className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 dark:text-cream tracking-tight mb-3"
        >
          Oops! Page Not Found
        </h1>

        {/* Playful Montessori Subtitle */}
        <p className="text-base sm:text-lg font-semibold text-forest-700 dark:text-sage-200 mb-2.5">
          The little explorers couldn&apos;t find this page!
        </p>

        {/* Supporting Explanation */}
        <p className="text-sm sm:text-base text-forest-700/80 dark:text-sage-300/90 max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for may have been moved, removed, or doesn&apos;t exist.
        </p>
      </div>
    </main>
  );
};
