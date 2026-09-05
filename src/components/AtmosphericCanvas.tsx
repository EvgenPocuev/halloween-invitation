import React, { useEffect, useRef } from 'react';

interface AtmosphericCanvasProps {
  intensity?: number; // 0 to 1
  candlePos?: { x: number; y: number } | null;
}

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

export const AtmosphericCanvas: React.FC<AtmosphericCanvasProps> = ({ intensity = 1, candlePos }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize floating embers and dust motes
    const motesCount = Math.floor(Math.min(width, height) * 0.08);
    const motes: Mote[] = [];
    const colors = ['#ff6622', '#ffaa33', '#dd2244', '#a855f7', '#ffd277'];

    for (let i = 0; i < motesCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.8 + 0.3), // gentle upward drift
        size: Math.random() * 2.4 + 1.0,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Dynamic volumetric background vignette & rolling fog simulation
      const flicker = 0.95 + Math.sin(time * 8) * 0.03 + Math.sin(time * 19) * 0.02;
      const cX = candlePos ? candlePos.x : width / 2;
      const cY = candlePos ? candlePos.y : height * 0.45;

      const radial = ctx.createRadialGradient(cX, cY, 20, cX, cY, Math.max(width, height) * 0.85);
      radial.addColorStop(0, `rgba(55, 12, 35, ${0.45 * intensity * flicker})`);
      radial.addColorStop(0.35, `rgba(26, 6, 26, ${0.35 * intensity})`);
      radial.addColorStop(0.7, 'rgba(10, 3, 12, 0.65)');
      radial.addColorStop(1, 'rgba(4, 1, 6, 0.95)');

      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // 2. Soft rolling mist patches (dual sin layers)
      const fogBands = 3;
      for (let b = 0; b < fogBands; b++) {
        ctx.save();
        const yOffset = (height * 0.3) * b + Math.sin(time * 0.5 + b) * 30;
        const fogGrad = ctx.createLinearGradient(0, yOffset - 80, 0, yOffset + 140);
        fogGrad.addColorStop(0, 'transparent');
        fogGrad.addColorStop(0.5, b % 2 === 0 ? 'rgba(88, 28, 135, 0.07)' : 'rgba(127, 29, 29, 0.08)');
        fogGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = fogGrad;
        ctx.beginPath();
        ctx.moveTo(0, yOffset);
        for (let x = 0; x <= width; x += 50) {
          const wave = Math.sin(x * 0.003 + time * (0.4 + b * 0.2)) * 35;
          ctx.lineTo(x, yOffset + wave);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 3. Floating embers and motes
      motes.forEach(m => {
        m.x += m.vx + Math.sin(time + m.pulsePhase) * 0.25;
        m.y += m.vy;
        m.pulsePhase += m.pulseSpeed;

        if (m.y < -20) {
          m.y = height + 20;
          m.x = Math.random() * width;
        }
        if (m.x < -20) m.x = width + 20;
        if (m.x > width + 20) m.x = -20;

        const currentAlpha = m.alpha * (0.6 + Math.sin(m.pulsePhase) * 0.4) * intensity;

        ctx.save();
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fillStyle = m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [intensity, candlePos]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};
