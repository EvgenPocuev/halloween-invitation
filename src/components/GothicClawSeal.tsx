import React, { useState, useRef } from 'react';
import { audioEngine } from '../audio/audioEngine';
import { useTelegram } from '../hooks/useTelegram';

interface GothicClawSealProps {
  onBreak: (rect: DOMRect) => void;
  disabled?: boolean;
}

export const GothicClawSeal: React.FC<GothicClawSealProps> = ({ onBreak, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const { triggerHaptic } = useTelegram();

  const handlePointerDown = () => {
    if (disabled || isBreaking) return;
    setIsPressing(true);
    audioEngine.playTensionRiser();
    triggerHaptic('medium');
  };

  const handlePointerUp = () => {
    if (disabled || isBreaking) return;
    setIsPressing(false);
  };

  const handleClick = () => {
    if (disabled || isBreaking) return;
    setIsBreaking(true);

    const rect = sealRef.current?.getBoundingClientRect();
    const targetRect = rect || new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 180, 180);

    // Audio & Haptic orchestration
    audioEngine.playSealCrack();
    setTimeout(() => {
      audioEngine.playImpact();
      audioEngine.playBell();
    }, 180);
    triggerHaptic('heavy');

    // Notify parent to start physics explosion and scene transition
    onBreak(targetRect);
  };

  return (
    <div
      ref={sealRef}
      className={`claw-seal-container ${isHovered ? 'hovered' : ''} ${isPressing ? 'pressing' : ''} ${
        isBreaking ? 'breaking' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressing(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Break Gothic Wax Seal"
    >
      {/* Outer Crimson Wax Glow Halo */}
      <div className="seal-glow-halo" />

      {/* Primary SVG: Monstrous Physical Skeletal Demonic Claw Gripping Wax Seal */}
      <svg
        viewBox="0 0 320 320"
        className="claw-seal-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wax Surface Shading Gradients */}
          <radialGradient id="waxBase" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#9a1122" />
            <stop offset="45%" stopColor="#630713" />
            <stop offset="78%" stopColor="#3d030a" />
            <stop offset="100%" stopColor="#1e0104" />
          </radialGradient>

          <radialGradient id="waxRimHighlight" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ff4d64" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#ba1a2e" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#45040b" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="innerStampGrad" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#48050e" />
            <stop offset="85%" stopColor="#220105" />
            <stop offset="100%" stopColor="#150003" />
          </radialGradient>

          {/* Skeletal Bone & Obsidian Claw Gradients */}
          <linearGradient id="boneLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8dcc4" />
            <stop offset="25%" stopColor="#b59f7d" />
            <stop offset="60%" stopColor="#5c4d3c" />
            <stop offset="100%" stopColor="#2b2219" />
          </linearGradient>

          <linearGradient id="boneDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#695744" />
            <stop offset="50%" stopColor="#36291e" />
            <stop offset="100%" stopColor="#150f0a" />
          </linearGradient>

          <linearGradient id="talonShine" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="20%" stopColor="#d4c3aa" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#3a2e22" />
            <stop offset="85%" stopColor="#0d0906" />
            <stop offset="100%" stopColor="#ff2244" />
          </linearGradient>

          <linearGradient id="crackGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ff7733" />
            <stop offset="100%" stopColor="#ff0044" />
          </linearGradient>

          {/* Shadows and lighting filters */}
          <filter id="sealShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ff0033" floodOpacity="0.3" />
          </filter>

          <filter id="clawCastShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="8" stdDeviation="5" floodColor="#0d0103" floodOpacity="0.85" />
          </filter>

          <filter id="fissureGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- 1. WAX POOL BASE & REALISTIC UNEVEN DRIPPING MARGINS --- */}
        <g filter="url(#sealShadow)">
          {/* Organic, cooled puddle contours */}
          <path
            d="M 160,25 
               C 210,24 255,42 278,80 
               C 298,114 308,160 292,205 
               C 278,245 250,278 210,292 
               C 175,304 135,302 98,284 
               C 62,266 32,232 26,190 
               C 20,150 32,108 65,72 
               C 95,38 128,26 160,25 Z"
            fill="url(#waxBase)"
          />

          {/* Dripping wax lobules and droplets */}
          <path
            d="M 270,185 C 295,195 305,225 292,245 C 280,260 260,250 255,235 Z
               M 45,175 C 25,190 18,220 30,235 C 42,245 60,235 62,215 Z
               M 125,290 C 135,312 150,316 160,305 C 168,295 158,285 145,285 Z"
            fill="url(#waxBase)"
          />

          {/* Specular wax rim highlight (glossy edge) */}
          <path
            d="M 160,32 
               C 205,31 245,47 268,82 
               C 285,112 292,152 280,192 
               C 268,140 230,65 160,42 
               C 115,42 85,62 65,85 
               C 92,48 125,33 160,32 Z"
            fill="url(#waxRimHighlight)"
          />

          {/* Sunken inner stamp well */}
          <circle cx="160" cy="160" r="105" fill="url(#innerStampGrad)" stroke="#2d0207" strokeWidth="4" />

          {/* Occult inner seal engravings */}
          <circle cx="160" cy="160" r="95" fill="none" stroke="#7a0d1a" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.65" />
          <circle cx="160" cy="160" r="82" fill="none" stroke="#520710" strokeWidth="2" opacity="0.8" />
          
          {/* Gothic pentagram / heptagram inscribed lines */}
          <path
            d="M 160,78 L 183,148 L 257,148 L 197,191 L 220,261 L 160,218 L 100,261 L 123,191 L 63,148 L 137,148 Z"
            fill="none"
            stroke="#45040b"
            strokeWidth="1.8"
            opacity="0.5"
          />

          {/* Raised displaced wax ridges where talons will sink */}
          <ellipse cx="110" cy="225" rx="14" ry="9" fill="#1b0104" opacity="0.8" />
          <ellipse cx="160" cy="245" rx="16" ry="10" fill="#1b0104" opacity="0.8" />
          <ellipse cx="215" cy="228" rx="14" ry="9" fill="#1b0104" opacity="0.8" />
          <ellipse cx="245" cy="165" rx="12" ry="14" fill="#1b0104" opacity="0.8" />
        </g>

        {/* --- 2. THE MONSTROUS SKELETAL CLAW (Visual Centerpiece) --- */}
        <g className="demonic-claw-assembly" filter="url(#clawCastShadow)">
          {/* A. Massive Carpus / Wrist Root descending from above */}
          <g className="wrist-root">
            {/* Dark back sinew & tendons */}
            <path
              d="M 125,-10 L 132,60 C 135,75 142,88 152,94 L 168,94 C 178,88 185,75 188,60 L 195,-10 Z"
              fill="url(#boneDark)"
            />
            {/* Central calcified forearm ridge */}
            <path
              d="M 140,-10 L 145,55 C 147,70 152,82 160,86 C 168,82 173,70 175,55 L 180,-10 Z"
              fill="url(#boneLight)"
            />
            {/* Spinal dorsal vertebrae bumps */}
            <ellipse cx="160" cy="18" rx="14" ry="7" fill="url(#boneLight)" stroke="#1a120b" strokeWidth="2" />
            <ellipse cx="160" cy="42" rx="16" ry="8" fill="url(#boneLight)" stroke="#1a120b" strokeWidth="2" />
            <ellipse cx="160" cy="70" rx="18" ry="9" fill="url(#boneLight)" stroke="#1a120b" strokeWidth="2.5" />
            {/* Metallic / horn rivets along the bone */}
            <circle cx="160" cy="18" r="2.5" fill="#f8e7b9" />
            <circle cx="160" cy="42" r="3" fill="#f8e7b9" />
            <circle cx="160" cy="70" r="3.5" fill="#f8e7b9" />
          </g>

          {/* B. Articulated Knuckle Cluster (Central Metacarpus) */}
          <g className="metacarpal-plate">
            <path
              d="M 120,68 C 110,85 100,105 92,125 C 135,115 185,115 228,125 C 220,105 210,85 200,68 C 185,82 135,82 120,68 Z"
              fill="url(#boneDark)"
              stroke="#110b06"
              strokeWidth="2"
            />
            {/* Specular crest on metacarpal */}
            <path
              d="M 130,82 C 145,95 175,95 190,82"
              fill="none"
              stroke="#e2cfb4"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>

          {/* C. DIGIT 1: Left Index Talon (Articulated 3 Phalanges) */}
          <g className="claw-digit digit-left">
            {/* Phalanx 1 (Proximal) */}
            <path
              d="M 108,118 C 96,135 88,155 86,170 C 93,172 101,168 107,155 C 113,142 119,128 122,118 Z"
              fill="url(#boneDark)"
            />
            {/* Knuckle 1 */}
            <ellipse cx="94" cy="165" rx="7" ry="6" fill="url(#boneLight)" stroke="#221810" strokeWidth="1.5" />

            {/* Phalanx 2 (Intermediate) */}
            <path
              d="M 90,168 C 84,185 86,202 96,216 C 101,212 104,200 102,185 C 100,175 96,168 90,168 Z"
              fill="url(#boneLight)"
            />
            {/* Knuckle 2 */}
            <circle cx="98" cy="212" r="6" fill="url(#boneDark)" stroke="#1a110a" strokeWidth="1.5" />

            {/* Phalanx 3 & Deadly Curved Talon (Biting into wax) */}
            <path
              d="M 96,214 C 94,228 98,240 110,248 C 114,244 116,234 112,225 C 109,218 104,213 96,214 Z"
              fill="url(#talonShine)"
            />
            {/* Talon Razor Tip piercing the seal */}
            <path
              d="M 102,230 Q 112,242 114,250 Q 111,238 106,228 Z"
              fill="#ffffff"
            />
          </g>

          {/* D. DIGIT 2: Center-Left Middle Claw (Longest, Most Menacing) */}
          <g className="claw-digit digit-mid-left">
            {/* Phalanx 1 */}
            <path
              d="M 140,118 C 136,140 134,165 136,182 C 144,182 148,172 150,158 C 151,142 150,126 148,118 Z"
              fill="url(#boneDark)"
            />
            {/* Knuckle 1 */}
            <ellipse cx="140" cy="180" rx="8" ry="7" fill="url(#boneLight)" stroke="#221810" strokeWidth="2" />
            <circle cx="140" cy="180" r="3" fill="#f8e7b9" />

            {/* Phalanx 2 */}
            <path
              d="M 136,184 C 135,204 140,224 150,238 C 156,236 158,222 156,206 C 154,194 148,184 136,184 Z"
              fill="url(#boneLight)"
            />
            {/* Knuckle 2 */}
            <circle cx="150" cy="235" r="7" fill="url(#boneDark)" stroke="#1a110a" strokeWidth="2" />

            {/* Talon 2: Deep penetration into wax */}
            <path
              d="M 148,238 C 148,252 154,266 163,272 C 168,266 169,254 165,244 C 160,236 153,235 148,238 Z"
              fill="url(#talonShine)"
            />
            {/* Talon Highlight Edge */}
            <path
              d="M 153,248 Q 163,264 165,273 Q 161,258 156,245 Z"
              fill="#ffffff"
            />
          </g>

          {/* E. DIGIT 3: Center-Right Ring Claw */}
          <g className="claw-digit digit-mid-right">
            {/* Phalanx 1 */}
            <path
              d="M 172,118 C 174,138 180,160 186,176 C 193,172 196,160 193,146 C 190,132 184,122 178,118 Z"
              fill="url(#boneDark)"
            />
            {/* Knuckle 1 */}
            <ellipse cx="184" cy="174" rx="7.5" ry="6.5" fill="url(#boneLight)" stroke="#221810" strokeWidth="2" />

            {/* Phalanx 2 */}
            <path
              d="M 183,178 C 188,198 196,216 208,228 C 213,224 214,210 210,196 C 205,184 196,176 183,178 Z"
              fill="url(#boneLight)"
            />
            {/* Knuckle 2 */}
            <circle cx="206" cy="225" r="6.5" fill="url(#boneDark)" stroke="#1a110a" strokeWidth="1.5" />

            {/* Talon 3 */}
            <path
              d="M 205,227 C 208,240 214,254 222,260 C 226,254 227,242 222,234 C 218,228 211,225 205,227 Z"
              fill="url(#talonShine)"
            />
            <path
              d="M 210,235 Q 221,250 223,261 Q 219,248 214,235 Z"
              fill="#ffffff"
            />
          </g>

          {/* F. DIGIT 4: Opposing Thumb Talon (Grips sideways from right) */}
          <g className="claw-digit digit-thumb">
            {/* Proximal segment branching right */}
            <path
              d="M 195,115 C 215,120 238,130 248,144 C 252,138 248,126 235,116 C 222,106 205,108 195,115 Z"
              fill="url(#boneDark)"
            />
            <ellipse cx="244" cy="142" rx="7" ry="8" fill="url(#boneLight)" stroke="#221810" strokeWidth="2" />

            {/* Distal Talon hooking inwards */}
            <path
              d="M 246,145 C 255,160 254,178 244,192 C 238,188 238,175 240,162 C 242,152 245,146 246,145 Z"
              fill="url(#talonShine)"
            />
            <path
              d="M 248,155 Q 252,175 244,194 Q 244,178 243,162 Z"
              fill="#ffffff"
            />
          </g>
        </g>

        {/* --- 3. DYNAMIC FISSURE & VOLCANIC CRACKS (Visible on press/break) --- */}
        <g
          className={`fissure-network ${isPressing || isBreaking ? 'active' : ''} ${
            isBreaking ? 'shattering' : ''
          }`}
          filter="url(#fissureGlow)"
        >
          {/* Deep glowing fracture lines shooting from center to margins */}
          <path
            d="M 160,160 L 135,125 L 110,95 L 85,55
               M 160,160 L 195,130 L 235,105 L 275,85
               M 160,160 L 140,200 L 120,240 L 95,280
               M 160,160 L 180,195 L 210,235 L 235,275
               M 160,160 L 205,165 L 255,170 L 290,175
               M 160,160 L 115,160 L 75,165 L 35,170"
            fill="none"
            stroke="url(#crackGlow)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Micro-capillaries */}
          <path
            d="M 135,125 L 115,135 M 195,130 L 210,115 M 140,200 L 155,220 M 180,195 L 170,225"
            fill="none"
            stroke="#ffddaa"
            strokeWidth="1.8"
          />
        </g>
      </svg>

      {/* Action Indicator / Subtle Pulsing Prompt */}
      {!isBreaking && (
        <div className="seal-prompt">
          <span className="prompt-text">
            {isPressing ? 'РОЗЛАМУЄТЬСЯ...' : 'ТОРКНІТЬСЯ, ЩОБ ВІДКРИТИ'}
          </span>
          <div className="prompt-glow-line" />
        </div>
      )}
    </div>
  );
};
