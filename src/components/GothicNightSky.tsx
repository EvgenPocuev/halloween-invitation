import React from 'react';

interface GothicNightSkyProps {
  intensity?: number;
}

export const GothicNightSky: React.FC<GothicNightSkyProps> = () => {
  return (
    <div className="gothic-night-sky">
      {/* Deep Midnight Gradient & Vignette */}
      <div className="sky-deep-backdrop" />

      {/* Giant Luminous Harvest Full Moon */}
      <div className="luminous-moon-container">
        <div className="luminous-moon-halo" />
        <div className="luminous-moon-sphere">
          {/* Moon Surface Craters & Maria Texture (SVG Filter / Shading) */}
          <svg viewBox="0 0 200 200" className="moon-craters-svg">
            <defs>
              <radialGradient id="lunarGlow" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#fff7d6" />
                <stop offset="35%" stopColor="#ffd875" />
                <stop offset="70%" stopColor="#e5a83b" />
                <stop offset="100%" stopColor="#ab6c1a" />
              </radialGradient>
              <filter id="craterTexture" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.25  0 0 0 0 0.1  0 0 0 0.35 0" />
              </filter>
            </defs>
            <circle cx="100" cy="100" r="98" fill="url(#lunarGlow)" />
            {/* Crater shadows */}
            <circle cx="65" cy="70" r="22" fill="#d4942c" opacity="0.35" />
            <circle cx="130" cy="115" r="30" fill="#b87818" opacity="0.3" />
            <circle cx="140" cy="60" r="16" fill="#c98720" opacity="0.25" />
            <circle cx="75" cy="135" r="18" fill="#a86915" opacity="0.3" />
            <ellipse cx="105" cy="90" rx="35" ry="18" fill="#ba7a1b" opacity="0.2" />
          </svg>
        </div>

        {/* Silhouetted Bat Gliding Across the Face of the Moon */}
        <div className="flying-bat-wrapper">
          <svg viewBox="0 0 120 70" className="flying-bat-svg">
            <path
              d="M 60,35 
                 C 55,20 40,8 25,12 
                 C 15,14 8,24 2,34 
                 C 14,35 24,42 32,50 
                 C 38,45 46,42 54,44 
                 L 58,40 L 60,42 L 62,40 L 66,44 
                 C 74,42 82,45 88,50 
                 C 96,42 106,35 118,34 
                 C 112,24 105,14 95,12 
                 C 80,8 65,20 60,35 Z"
              fill="#060207"
              className="bat-wings"
            />
            {/* Bat Ears & Head */}
            <path
              d="M 57,35 L 56,28 L 59,32 L 61,32 L 64,28 L 63,35 Z"
              fill="#060207"
            />
          </svg>
        </div>
      </div>

      {/* Floating Drifting Night Clouds across the Moon */}
      <div className="night-clouds-layer" />

      {/* Gothic Spiral Hill Silhouette (The Iconic Winding Hill from Reference) */}
      <div className="gothic-landscape-horizon">
        <svg
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          className="spiral-hill-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hillDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15051a" />
              <stop offset="40%" stopColor="#0b020c" />
              <stop offset="100%" stopColor="#030004" />
            </linearGradient>
          </defs>

          {/* Background misty hills */}
          <path
            d="M 0,260 Q 300,180 600,240 T 1200,220 L 1200,400 L 0,400 Z"
            fill="#100314"
            opacity="0.75"
          />

          {/* Iconic Curled Spiral Hill Rising on the Left/Center */}
          <path
            d="M 0,380 
               C 150,370 280,330 380,270 
               C 440,230 480,170 470,120 
               C 460,80 415,70 385,95 
               C 360,115 365,150 395,160 
               C 415,165 435,150 430,135 
               C 425,125 410,125 405,135
               C 420,180 380,240 300,290 
               C 180,360 0,380 0,380 Z"
            fill="url(#hillDarkGrad)"
          />

          {/* Right Slope Horizon */}
          <path
            d="M 450,400 C 650,330 850,290 1200,310 L 1200,400 Z"
            fill="url(#hillDarkGrad)"
          />

          {/* Gnarled Gothic Barren Tree Silhouette on the hill */}
          <path
            d="M 180,340 
               L 184,280 L 175,250 L 180,230 
               M 175,250 L 155,235 L 145,238 
               M 180,230 L 195,210 L 210,215 
               M 180,230 L 170,210 L 160,205"
            stroke="#070108"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Solitary glowing jack-o'-lantern on the hill slope */}
          <g transform="translate(140, 345) scale(0.65)">
            <ellipse cx="20" cy="20" rx="16" ry="14" fill="#380802" stroke="#120101" strokeWidth="1.5" />
            {/* Glowing eyes & jagged mouth */}
            <polygon points="12,16 15,19 9,19" fill="#ffaa22" />
            <polygon points="28,16 31,19 25,19" fill="#ffaa22" />
            <polygon points="12,24 16,22 20,25 24,22 28,24 20,27" fill="#ffaa22" />
            <ellipse cx="20" cy="22" rx="4" ry="2" fill="#ffee88" />
          </g>
        </svg>
      </div>
    </div>
  );
};
