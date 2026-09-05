/**
 * Wax Seal & Claw Fracture Physics Simulation
 * Spawns dynamic polygon shards of wax and ember sparks with velocity, rotation, and gravity.
 */

export interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  points: { x: number; y: number }[];
  color: string;
  edgeColor: string;
  size: number;
  opacity: number;
  decay: number;
}

export interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export class ShatterPhysics {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private shards: Shard[] = [];
  private sparks: Spark[] = [];
  private isRunning: boolean = false;
  private animId: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get 2d context');
    this.ctx = context;
    this.resize();
  }

  public resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  public explode(centerX: number, centerY: number) {
    this.shards = [];
    this.sparks = [];

    const shardCount = 45;
    const colors = [
      '#7b0615', '#57040e', '#3f0209', '#960c1d', '#b31528', '#2b0106'
    ];

    // Create realistic fractured polygon shards
    for (let i = 0; i < shardCount; i++) {
      const angle = (Math.PI * 2 * i) / shardCount + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 9 + 4;
      const size = Math.random() * 22 + 8;

      // Random polygon vertices around (0,0)
      const vertexCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 vertices
      const points: { x: number; y: number }[] = [];
      for (let v = 0; v < vertexCount; v++) {
        const vAngle = (Math.PI * 2 * v) / vertexCount;
        const radius = size * (0.6 + Math.random() * 0.8);
        points.push({
          x: Math.cos(vAngle) * radius,
          y: Math.sin(vAngle) * radius
        });
      }

      this.shards.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 4 + 2), // upward initial burst
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
        points,
        color: colors[Math.floor(Math.random() * colors.length)],
        edgeColor: Math.random() > 0.5 ? '#d9384e' : '#220004',
        size,
        opacity: 1,
        decay: Math.random() * 0.008 + 0.004
      });
    }

    // Fiery spark particles and hot wax droplets
    const sparkCount = 70;
    const sparkColors = ['#ffaa44', '#ff4400', '#ff2255', '#ffeebb', '#ff0033'];

    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 2;
      const maxLife = Math.random() * 40 + 30;

      this.sparks.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 5,
        size: Math.random() * 3.5 + 1.5,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        opacity: 1,
        life: maxLife,
        maxLife
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Update & draw shards
    for (let i = this.shards.length - 1; i >= 0; i--) {
      const s = this.shards[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.35; // gravity
      s.vx *= 0.98; // air drag
      s.rotation += s.vRot;
      s.opacity -= s.decay;

      if (s.opacity <= 0 || s.y > window.innerHeight + 100) {
        this.shards.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(s.x, s.y);
      this.ctx.rotate(s.rotation);
      this.ctx.globalAlpha = Math.max(0, s.opacity);

      // Draw shard polygon
      this.ctx.beginPath();
      s.points.forEach((pt, idx) => {
        if (idx === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.closePath();

      this.ctx.fillStyle = s.color;
      this.ctx.fill();
      this.ctx.strokeStyle = s.edgeColor;
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      this.ctx.restore();
    }

    // Update & draw sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += 0.15;
      sp.vx *= 0.96;
      sp.life--;
      sp.opacity = sp.life / sp.maxLife;

      if (sp.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, sp.opacity);
      this.ctx.fillStyle = sp.color;
      this.ctx.shadowColor = sp.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.shards.length > 0 || this.sparks.length > 0) {
      this.animId = requestAnimationFrame(this.animate);
    } else {
      this.isRunning = false;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };

  public destroy() {
    cancelAnimationFrame(this.animId);
    this.isRunning = false;
  }
}
