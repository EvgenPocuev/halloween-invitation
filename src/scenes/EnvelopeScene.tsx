import React, { useState, useRef, useEffect } from 'react';
import { JackSkullSeal } from '../components/JackSkullSeal';
import { ShatterPhysics } from '../animations/shatterPhysics';
import { audioEngine } from '../audio/audioEngine';

interface EnvelopeSceneProps {
  onTransitionComplete: () => void;
  guestPreviewName?: string;
}

export const EnvelopeScene: React.FC<EnvelopeSceneProps> = ({
  onTransitionComplete,
  guestPreviewName
}) => {
  const [phase, setPhase] = useState<'idle' | 'breaking' | 'opening' | 'zooming' | 'flash' | 'done'>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const physicsRef = useRef<ShatterPhysics | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      physicsRef.current = new ShatterPhysics(canvasRef.current);
    }
    return () => {
      physicsRef.current?.destroy();
    };
  }, []);

  const handleSealBreak = (rect: DOMRect) => {
    if (phase !== 'idle') return;

    setPhase('breaking');
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    physicsRef.current?.explode(centerX, centerY);

    // T+450ms: Envelope Flap begins unfolding open, warm light leaks out
    setTimeout(() => {
      setPhase('opening');
      audioEngine.playWhoosh();
    }, 450);

    // T+1100ms: Camera rushes deeply INTO the envelope center
    setTimeout(() => {
      setPhase('zooming');
    }, 1100);

    // T+1800ms: Screen is completely filled with blinding warm light flash
    setTimeout(() => {
      setPhase('flash');
    }, 1800);

    // T+2300ms: Transition to Parchment Scene inside the sanctum
    setTimeout(() => {
      setPhase('done');
      onTransitionComplete();
    }, 2300);
  };

  return (
    <div className={`envelope-scene-wrapper phase-${phase}`}>
      {/* Physics Shatter Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="shatter-physics-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 60
        }}
      />

      {/* Cinematic Flash Overlay */}
      <div className={`cinematic-flash-overlay ${phase === 'flash' || phase === 'done' ? 'active' : ''}`} />

      {/* 3D Camera Rig that rushes into the envelope */}
      <div className={`envelope-stage ${phase}`}>
        {/* Floating Sally Patchwork Envelope */}
        <div className="envelope-3d-box">
          {/* Volumetric Internal Amber Core Light */}
          <div className="envelope-inner-radiance" />

          {/* Sally Stitched Patchwork Envelope SVG Body */}
          <svg
            viewBox="0 0 540 360"
            className="envelope-svg-body"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sallyPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="60%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>

              <linearGradient id="sallyTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>

              <linearGradient id="sallyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>

              <filter id="envShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="25" stdDeviation="28" floodColor="#000000" floodOpacity="0.95" />
              </filter>
            </defs>

            {/* A. Base Rectangular Envelope */}
            <rect
              x="20"
              y="20"
              width="500"
              height="320"
              rx="8"
              fill="#18181b"
              stroke="#09090b"
              strokeWidth="4"
              filter="url(#envShadow)"
            />

            {/* B. Sally's Stitched Patchwork Panels */}
            {/* Left Cyan Patch with Polka Dots */}
            <path
              d="M 20,20 L 180,20 L 150,340 L 20,340 Z"
              fill="url(#sallyTeal)"
              stroke="#0c4a6e"
              strokeWidth="2.5"
            />
            <g fill="#09090b">
              <circle cx="65" cy="80" r="16" />
              <circle cx="120" cy="140" r="18" />
              <circle cx="60" cy="210" r="17" />
              <circle cx="115" cy="275" r="16" />
            </g>

            {/* Center Yellow Patch with Vertical Pinstripes */}
            <path
              d="M 180,20 L 360,20 L 380,340 L 150,340 Z"
              fill="url(#sallyYellow)"
              stroke="#854d0e"
              strokeWidth="2.5"
            />
            <g stroke="#09090b" strokeWidth="2.2" strokeLinecap="round">
              <line x1="200" y1="20" x2="175" y2="340" />
              <line x1="225" y1="20" x2="205" y2="340" />
              <line x1="250" y1="20" x2="235" y2="340" />
              <line x1="275" y1="20" x2="265" y2="340" />
              <line x1="300" y1="20" x2="295" y2="340" />
              <line x1="325" y1="20" x2="325" y2="340" />
              <line x1="350" y1="20" x2="355" y2="340" />
            </g>

            {/* Right Cyan Patch with Polka Dots */}
            <path
              d="M 360,20 L 520,20 L 520,340 L 380,340 Z"
              fill="url(#sallyTeal)"
              stroke="#0c4a6e"
              strokeWidth="2.5"
            />
            <g fill="#09090b">
              <circle cx="430" cy="90" r="17" />
              <circle cx="480" cy="160" r="18" />
              <circle cx="440" cy="235" r="16" />
              <circle cx="475" cy="295" r="17" />
            </g>

            {/* Hand-Sewn Cross Stitches along Seams */}
            <g stroke="#09090b" strokeWidth="3" strokeLinecap="round">
              {[40, 75, 110, 145, 180, 215, 250, 285, 320].map((y, idx) => (
                <g key={`es1-${idx}`}>
                  <line x1={175 - idx * 2.5} y1={y - 6} x2={169 - idx * 2.5} y2={y + 6} />
                  <line x1={166 - idx * 2.5} y1={y - 3} x2={178 - idx * 2.5} y2={y + 3} />
                </g>
              ))}
              {[40, 75, 110, 145, 180, 215, 250, 285, 320].map((y, idx) => (
                <g key={`es2-${idx}`}>
                  <line x1={365 + idx * 2} y1={y - 6} x2={371 + idx * 2} y2={y + 6} />
                  <line x1={360 + idx * 2} y1={y - 3} x2={376 + idx * 2} y2={y + 3} />
                </g>
              ))}
              {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
                <g key={`eb-top-${x}`}>
                  <line x1={x - 6} y1={20} x2={x + 6} y2={20} />
                  <line x1={x} y1={14} x2={x} y2={26} />
                </g>
              ))}
              {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
                <g key={`eb-bot-${x}`}>
                  <line x1={x - 6} y1={340} x2={x + 6} y2={340} />
                  <line x1={x} y1={334} x2={x} y2={346} />
                </g>
              ))}
            </g>

            {/* C. Top Flap (Purple with Spirals & Stitches) */}
            <g className={`envelope-top-flap ${phase !== 'idle' ? 'unfolded' : ''}`}>
              <path
                d="M 20,20 L 270,205 L 520,20 Z"
                fill="url(#sallyPurple)"
                stroke="#4c1d95"
                strokeWidth="3.5"
              />
              <g fill="none" stroke="#581c87" strokeWidth="2.5" opacity="0.75">
                <path d="M 120,70 C 130,55 155,55 160,75 C 165,95 140,110 120,95 C 105,80 115,55 140,55 C 170,55 180,95 150,115" />
                <path d="M 380,85 C 390,70 415,70 420,90 C 425,110 400,125 380,110 C 365,95 375,70 400,70 C 430,70 440,110 410,130" />
              </g>
              <g stroke="#09090b" strokeWidth="2.8" strokeLinecap="round">
                {[50, 85, 120, 155, 190, 225, 255].map((x, idx) => {
                  const y = 20 + idx * 26;
                  return (
                    <g key={`eflap-l-${idx}`}>
                      <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
                      <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
                    </g>
                  );
                })}
                {[490, 455, 420, 385, 350, 315, 285].map((x, idx) => {
                  const y = 20 + idx * 26;
                  return (
                    <g key={`eflap-r-${idx}`}>
                      <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
                      <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          {/* Whimsical Text below Envelope */}
          <div className={`envelope-tag ${phase !== 'idle' ? 'faded' : ''}`}>
            <span className="burton-script-tag">ти запрошений!</span>
            <span className="burton-recipient-tag">{guestPreviewName || 'ШАНОВНИЙ ГІСТЬ'}</span>
          </div>

          {/* Center Jack Skellington Stitched Seal */}
          <div className={`seal-anchor ${phase !== 'idle' ? 'seal-disintegrated' : ''}`}>
            <JackSkullSeal
              onBreak={handleSealBreak}
              disabled={phase !== 'idle'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
