import React, { useState, useRef, useEffect } from 'react';
import { JackSkullSeal } from '../components/JackSkullSeal';
import { ShatterPhysics } from '../animations/shatterPhysics';
import { ParchmentCard } from './ParchmentCard';
import { audioEngine } from '../audio/audioEngine';
import type { InvitationData } from '../types/invitation';

interface UnifiedInvitationSceneProps {
  invitation: InvitationData;
}

export const UnifiedInvitationScene: React.FC<UnifiedInvitationSceneProps> = ({ invitation }) => {
  const [phase, setPhase] = useState<'closed' | 'breaking' | 'opening' | 'revealed'>('closed');
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
    if (phase !== 'closed') return;

    setPhase('breaking');
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    physicsRef.current?.explode(centerX, centerY);

    // T+400ms: Flap opens
    setTimeout(() => {
      setPhase('opening');
      audioEngine.playWhoosh();
    }, 450);

    // T+1000ms: Scroll unfurls in the center
    setTimeout(() => {
      setPhase('revealed');
      audioEngine.startMainTheme();
    }, 1000);
  };

  return (
    <div className={`unified-stage-container stage-${phase}`}>
      {/* Dynamic Physics Shard Canvas */}
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

      {/* Main Composition Camera Rig */}
      <div className="unified-camera-rig">
        {/* Sally's Patchwork Stitched Envelope Chassis */}
        <div className={`envelope-3d-chassis ${phase !== 'closed' ? 'chassis-opened' : ''}`}>
          {/* Volumetric Internal Amber Light */}
          <div className="envelope-inner-radiance" />

          {/* SVG Sally Stitched Patchwork Envelope Body */}
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

              <filter id="patchShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="18" stdDeviation="24" floodColor="#000000" floodOpacity="0.95" />
              </filter>
            </defs>

            {/* A. Outer Envelope Base */}
            <rect
              x="20"
              y="20"
              width="500"
              height="320"
              rx="8"
              fill="#18181b"
              stroke="#09090b"
              strokeWidth="4"
              filter="url(#patchShadow)"
            />

            {/* B. Asymmetrical Patchwork Panels (Sally's Pattern) */}
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

            {/* Hand-Drawn Cross Stitches along Seams */}
            <g stroke="#09090b" strokeWidth="3" strokeLinecap="round">
              {[40, 75, 110, 145, 180, 215, 250, 285, 320].map((y, idx) => (
                <g key={`s1-${idx}`}>
                  <line x1={175 - idx * 2.5} y1={y - 6} x2={169 - idx * 2.5} y2={y + 6} />
                  <line x1={166 - idx * 2.5} y1={y - 3} x2={178 - idx * 2.5} y2={y + 3} />
                </g>
              ))}
              {[40, 75, 110, 145, 180, 215, 250, 285, 320].map((y, idx) => (
                <g key={`s2-${idx}`}>
                  <line x1={365 + idx * 2} y1={y - 6} x2={371 + idx * 2} y2={y + 6} />
                  <line x1={360 + idx * 2} y1={y - 3} x2={376 + idx * 2} y2={y + 3} />
                </g>
              ))}
              {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
                <g key={`b-top-${x}`}>
                  <line x1={x - 6} y1={20} x2={x + 6} y2={20} />
                  <line x1={x} y1={14} x2={x} y2={26} />
                </g>
              ))}
              {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
                <g key={`b-bot-${x}`}>
                  <line x1={x - 6} y1={340} x2={x + 6} y2={340} />
                  <line x1={x} y1={334} x2={x} y2={346} />
                </g>
              ))}
            </g>

            {/* Top Flap (Purple with Spirals) */}
            <g className={`envelope-top-flap ${phase !== 'closed' ? 'unfolded' : ''}`}>
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
                    <g key={`flap-l-${idx}`}>
                      <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
                      <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
                    </g>
                  );
                })}
                {[490, 455, 420, 385, 350, 315, 285].map((x, idx) => {
                  const y = 20 + idx * 26;
                  return (
                    <g key={`flap-r-${idx}`}>
                      <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
                      <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          {/* Whimsical Text below Envelope */}
          <div className={`envelope-tag ${phase !== 'closed' ? 'faded' : ''}`}>
            <span className="burton-script-tag">ти запрошений!</span>
            <span className="burton-recipient-tag">{invitation.guestName}</span>
          </div>

          {/* Jack Skellington Stitched Seal */}
          <div className={`seal-anchor ${phase !== 'closed' ? 'seal-disintegrated' : ''}`}>
            <JackSkullSeal
              onBreak={handleSealBreak}
              disabled={phase !== 'closed'}
            />
          </div>
        </div>

        {/* Unfurling Ancient Parchment Scroll Section (Appears cleanly centered!) */}
        {phase !== 'closed' && (
          <div className={`parchment-unfurl-container ${phase === 'revealed' ? 'unfurled' : 'unrolling'}`}>
            {/* Flanking Characters: Jack on Left, Tombstone on Right (Properly placed outside the scroll!) */}
            <div className="scroll-flanking-characters">
              {/* Jack Skellington on Left */}
              <div className="jack-skellington-side">
                <svg viewBox="0 0 130 360" className="jack-side-svg">
                  <ellipse cx="65" cy="40" rx="26" ry="30" fill="#ffffff" stroke="#121215" strokeWidth="3" />
                  <path d="M 50,34 C 48,25 58,23 60,32 C 62,38 55,42 52,40 Z" fill="#121215" />
                  <path d="M 70,32 C 72,23 82,25 80,34 C 78,42 72,38 70,32 Z" fill="#121215" />
                  <path d="M 45,50 Q 65,65 85,50" fill="none" stroke="#121215" strokeWidth="2.2" />
                  <line x1="50" y1="49" x2="52" y2="55" stroke="#121215" strokeWidth="1.8" />
                  <line x1="60" y1="53" x2="62" y2="59" stroke="#121215" strokeWidth="1.8" />
                  <line x1="70" y1="53" x2="68" y2="59" stroke="#121215" strokeWidth="1.8" />
                  <line x1="80" y1="49" x2="78" y2="55" stroke="#121215" strokeWidth="1.8" />

                  {/* Bat bowtie */}
                  <path d="M 65,85 C 45,70 20,70 10,80 C 25,92 45,92 60,94 C 45,98 30,105 20,115 C 38,110 52,102 65,98 C 78,102 92,110 110,115 C 100,105 85,98 70,94 C 85,92 105,92 120,80 C 110,70 85,70 65,85 Z" fill="#121215" stroke="#fff" strokeWidth="1.2" />
                  <circle cx="65" cy="88" r="5" fill="#fff" stroke="#121215" strokeWidth="1.5" />

                  {/* Slender suit */}
                  <path d="M 48,98 L 82,98 L 76,190 L 54,190 Z" fill="#15151b" stroke="#000" strokeWidth="2.5" />
                  <line x1="54" y1="100" x2="58" y2="188" stroke="#fff" strokeWidth="1.5" strokeDasharray="5 3" />
                  <line x1="62" y1="100" x2="64" y2="188" stroke="#fff" strokeWidth="1.5" strokeDasharray="5 3" />
                  <line x1="70" y1="100" x2="68" y2="188" stroke="#fff" strokeWidth="1.5" strokeDasharray="5 3" />
                  <line x1="76" y1="100" x2="74" y2="188" stroke="#fff" strokeWidth="1.5" strokeDasharray="5 3" />

                  {/* Legs */}
                  <line x1="58" y1="190" x2="52" y2="350" stroke="#15151b" strokeWidth="6" />
                  <line x1="72" y1="190" x2="78" y2="350" stroke="#15151b" strokeWidth="6" />
                  <line x1="52" y1="190" x2="46" y2="350" stroke="#fff" strokeWidth="1.4" strokeDasharray="6 3" />
                  <line x1="78" y1="190" x2="84" y2="350" stroke="#fff" strokeWidth="1.4" strokeDasharray="6 3" />

                  {/* Arm gesturing to scroll */}
                  <path d="M 80,105 L 110,140 L 118,200 L 125,230" fill="none" stroke="#15151b" strokeWidth="4" />
                  <path d="M 125,230 L 132,245 M 125,230 L 128,252 M 125,230 L 120,250" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Tombstone Accent on Right */}
              <div className="burton-tombstone-side">
                <svg viewBox="0 0 110 180" className="tombstone-side-svg">
                  <path d="M 10,170 L 10,50 C 10,15 100,15 100,50 L 100,170 Z" fill="#7c3aed" stroke="#2e1065" strokeWidth="3" />
                  <path d="M 16,165 L 16,50 C 16,22 94,22 94,50 L 94,165" fill="none" stroke="#000" strokeWidth="1.8" strokeDasharray="5 3" />
                  <text x="55" y="55" textAnchor="middle" fill="#f5d0fe" fontSize="8" fontWeight="700">A LITTLE</text>
                  <text x="55" y="72" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">NIGHTMARE</text>
                  <circle cx="55" cy="120" r="18" fill="#38bdf8" stroke="#0369a1" strokeWidth="2" />
                  <ellipse cx="48" cy="118" rx="3" ry="4" fill="#082f49" />
                  <ellipse cx="62" cy="118" rx="3" ry="4" fill="#082f49" />
                  <path d="M 46,128 Q 55,134 64,128" fill="none" stroke="#082f49" strokeWidth="1.8" />
                </svg>
              </div>
            </div>

            {/* The Ancient Parchment Scroll Component */}
            <div className="scroll-paper-body">
              <ParchmentCard
                invitation={invitation}
                isRevealed={phase === 'revealed'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
