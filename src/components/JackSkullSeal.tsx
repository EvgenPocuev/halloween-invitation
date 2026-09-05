import React, { useState, useRef } from 'react';
import { audioEngine } from '../audio/audioEngine';
import { useTelegram } from '../hooks/useTelegram';

interface JackSkullSealProps {
  onBreak: (rect: DOMRect) => void;
  disabled?: boolean;
}

export const JackSkullSeal: React.FC<JackSkullSealProps> = ({ onBreak, disabled }) => {
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
    const targetRect = rect || new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 160, 160);

    audioEngine.playSealCrack();
    setTimeout(() => {
      audioEngine.playImpact();
      audioEngine.playBell();
    }, 180);
    triggerHaptic('heavy');

    onBreak(targetRect);
  };

  return (
    <div
      ref={sealRef}
      className={`jack-seal-container ${isHovered ? 'hovered' : ''} ${isPressing ? 'pressing' : ''} ${
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
      aria-label="Open Jack Skellington Seal"
    >
      {/* Outer Eerie Halo */}
      <div className="jack-seal-halo" />

      {/* SVG Jack Skellington Stitched Skull Button Seal */}
      <svg
        viewBox="0 0 160 160"
        className="jack-skull-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Black Outer Button Base */}
          <radialGradient id="buttonGrad" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#25252b" />
            <stop offset="70%" stopColor="#121215" />
            <stop offset="100%" stopColor="#050507" />
          </radialGradient>

          {/* Bone White Jack Face */}
          <radialGradient id="jackBoneGrad" cx="42%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#e8e8ed" />
            <stop offset="90%" stopColor="#cfcfd8" />
            <stop offset="100%" stopColor="#a5a5b2" />
          </radialGradient>

          <filter id="buttonDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.9" />
          </filter>

          <filter id="stitchedGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Stitched Black Rim Button Disk */}
        <g filter="url(#buttonDropShadow)">
          <circle cx="80" cy="80" r="74" fill="url(#buttonGrad)" stroke="#09090b" strokeWidth="4" />

          {/* Stitched Seam Running along Rim (Tim Burton Stitches) */}
          <circle
            cx="80"
            cy="80"
            r="66"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.85"
          />

          {/* 2. White Jack Skellington Round Skull Face */}
          <circle
            cx="80"
            cy="80"
            r="54"
            fill="url(#jackBoneGrad)"
            stroke="#1a1a1f"
            strokeWidth="3"
          />

          {/* 3. Jack's Iconic Sunken Black Eyes (Slightly Angled & Menacingly Cheerful) */}
          <g fill="#0c0c10">
            {/* Left Eye */}
            <path d="M 52,65 C 50,54 62,48 68,54 C 74,60 70,72 63,73 C 56,74 52,70 52,65 Z" />
            {/* Right Eye */}
            <path d="M 92,54 C 98,48 110,54 108,65 C 108,70 104,74 97,73 C 90,72 86,60 92,54 Z" />
            {/* Nostrils */}
            <ellipse cx="76" cy="80" rx="1.8" ry="3.5" transform="rotate(-15 76 80)" />
            <ellipse cx="84" cy="80" rx="1.8" ry="3.5" transform="rotate(15 84 80)" />
          </g>

          {/* 4. Jack's Iconic Wide Stitched Smile */}
          <g stroke="#0c0c10" strokeWidth="2.5" strokeLinecap="round">
            {/* Main Mouth Arc Curve */}
            <path
              d="M 44,92 Q 80,122 116,92"
              fill="none"
            />
            {/* Individual Stitches Across Smile */}
            <line x1="50" y1="91" x2="52" y2="99" />
            <line x1="58" y1="95" x2="60" y2="103" />
            <line x1="66" y1="98" x2="68" y2="106" />
            <line x1="75" y1="100" x2="75" y2="108" />
            <line x1="85" y1="100" x2="85" y2="108" />
            <line x1="94" y1="98" x2="92" y2="106" />
            <line x1="102" y1="95" x2="100" y2="103" />
            <line x1="110" y1="91" x2="108" y2="99" />
          </g>
        </g>
      </svg>

      {/* Action Prompt */}
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
