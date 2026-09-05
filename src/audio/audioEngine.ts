/**
 * Cinematic Audio Engine
 * Supports external audio files (assets/audio/*) with high-fidelity Web Audio API procedural synthesis fallback.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private hasInteracted: boolean = false;

  // External audio caches
  private audioFiles: Record<string, HTMLAudioElement> = {};
  private loadedFiles: Set<string> = new Set();

  // Active oscillators/nodes for procedural ambience
  private ambienceDroneGain: GainNode | null = null;
  private musicThemeGain: GainNode | null = null;

  constructor() {
    this.preCheckAudioFiles();
  }

  private preCheckAudioFiles() {
    const files = {
      theme: '/halloween_ang.mp3',
      ambience: '/halloween_ang.mp3',
      crack: '/assets/audio/seal-crack.wav',
      impact: '/assets/audio/impact.wav',
      bell: '/assets/audio/bell.wav',
    };

    Object.entries(files).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', () => {
        this.loadedFiles.add(key);
      }, { once: true });
      audio.addEventListener('error', () => {
        // Try fallback path if needed
        if (key === 'theme' || key === 'ambience') {
          audio.src = '/assets/audio/theme.mp3';
        }
      });
      this.audioFiles[key] = audio;
    });
  }

  /**
   * Play the uploaded Halloween song immediately or unlock on the very first touch/click
   */
  public playMusicNow() {
    if (this.isMuted) return;
    this.init();

    const audio = this.audioFiles.theme || new Audio('/halloween_ang.mp3');
    audio.loop = true;
    audio.volume = 0.75;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.loadedFiles.add('theme');
        })
        .catch(() => {
          // Autoplay restricted by browser: unlock on very first touch/click
          const unlock = () => {
            if (!this.isMuted) {
              this.init();
              audio.play().catch(() => {});
            }
          };
          window.addEventListener('pointerdown', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
          window.addEventListener('click', unlock, { once: true });
        });
    }
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.hasInteracted = true;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.ctx) {
        this.ctx.suspend();
      }
      if (this.ambienceDroneGain && this.ctx) {
        this.ambienceDroneGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      Object.values(this.audioFiles).forEach(a => a.pause());
    } else {
      if (this.ctx) {
        this.ctx.resume();
      }
      if (this.ambienceDroneGain && this.ctx) {
        this.ambienceDroneGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getHasInteracted(): boolean {
    return this.hasInteracted;
  }

  // --- AMBIENCE & THEME SONG ---
  public startAmbience() {
    if (this.isMuted) return;
    this.playMusicNow();

    // Procedural Fallback if Web Audio needed
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.25, now + 3);
      masterGain.connect(this.ctx.destination);
      this.ambienceDroneGain = masterGain;

      // Deep Sub Drone (43.65 Hz - F1 note)
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(43.65, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, now);
      filter.Q.setValueAtTime(4, now);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(40, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(65.41, now);

      subOsc.connect(filter);
      filter.connect(masterGain);
      osc2.connect(masterGain);

      subOsc.start(now);
      osc2.start(now);
      lfo.start(now);
    } catch {
      // Ignored
    }
  }

  // --- TENSION RISER (when holding or pressing seal) ---
  public playTensionRiser() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 1.2);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // Ignore
    }
  }

  // --- WAX CRACK & CLAW FRACTURE ---
  public playSealCrack() {
    if (this.isMuted) return;
    this.init();

    if (this.loadedFiles.has('crack')) {
      const audio = this.audioFiles.crack.cloneNode() as HTMLAudioElement;
      audio.volume = 0.9;
      audio.play().catch(() => {});
      return;
    }

    // Procedural Fallback: Visceral physical wax fracture & bone snap
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Transient burst (noise crack)
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2200, now);
      noiseFilter.Q.setValueAtTime(2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 2. Heavy crunch / crackle cluster
      [180, 320, 750].forEach((freq, idx) => {
        if (!this.ctx) return;
        const snapOsc = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(freq, now + idx * 0.03);
        snapOsc.frequency.exponentialRampToValueAtTime(40, now + idx * 0.03 + 0.12);

        snapGain.gain.setValueAtTime(0.5, now + idx * 0.03);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.15);

        snapOsc.connect(snapGain);
        snapGain.connect(this.ctx.destination);
        snapOsc.start(now + idx * 0.03);
        snapOsc.stop(now + idx * 0.03 + 0.15);
      });
    } catch {
      // Ignore
    }
  }

  // --- HEAVY IMPACT & SUB DROP (Seal break climax) ---
  public playImpact() {
    if (this.isMuted) return;
    this.init();

    if (this.loadedFiles.has('impact')) {
      const audio = this.audioFiles.impact.cloneNode() as HTMLAudioElement;
      audio.volume = 1.0;
      audio.play().catch(() => {});
      return;
    }

    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.6);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Ignore
    }
  }

  // --- CHURCH BELL TOLL ---
  public playBell() {
    if (this.isMuted) return;
    this.init();

    if (this.loadedFiles.has('bell')) {
      const audio = this.audioFiles.bell.cloneNode() as HTMLAudioElement;
      audio.volume = 0.8;
      audio.play().catch(() => {});
      return;
    }

    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Bell physical overtones: base, minor third, octave, etc.
      const partials = [
        { ratio: 1.0, gain: 0.5, decay: 4.5 },
        { ratio: 1.2, gain: 0.35, decay: 3.8 },
        { ratio: 1.5, gain: 0.25, decay: 3.2 },
        { ratio: 2.0, gain: 0.2, decay: 2.5 },
        { ratio: 2.76, gain: 0.15, decay: 1.8 }
      ];

      const fundamental = 220; // A3

      partials.forEach(p => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * p.ratio, now);

        gain.gain.setValueAtTime(p.gain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + p.decay);
      });
    } catch {
      // Ignore
    }
  }

  // --- ENVELOPE WHOOSH (Transition into sanctum) ---
  public playWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.7);
      filter.frequency.exponentialRampToValueAtTime(200, now + 1.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch {
      // Ignore
    }
  }

  // --- HALLOWEEN MAIN THEME (Starts when entering parchment scene) ---
  public startMainTheme() {
    if (this.isMuted) return;
    this.init();

    const audio = this.audioFiles.theme;
    if (audio) {
      if (!audio.paused) {
        return; // Already playing seamlessly!
      }
      audio.loop = true;
      audio.volume = 0.75;
      audio.play().catch(() => {});
      return;
    }

    // Procedural Fallback: Atmospheric gothic dark organ / choir arpeggio chords
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const themeGain = this.ctx.createGain();
      themeGain.gain.setValueAtTime(0.01, now);
      themeGain.gain.linearRampToValueAtTime(0.2, now + 2.0);
      themeGain.connect(this.ctx.destination);
      this.musicThemeGain = themeGain;

      // Haunting gothic progression (D minor, Bb major, G minor, A major)
      const chordNotes = [
        [146.83, 174.61, 220.0], // D3, F3, A3
        [116.54, 174.61, 233.08], // Bb2, F3, Bb3
        [98.0, 146.83, 196.0],   // G2, D3, G3
        [110.0, 164.81, 220.0]   // A2, C#3, A3
      ];

      let step = 0;
      const playNextChord = () => {
        if (!this.ctx || !this.musicThemeGain) return;
        const chord = chordNotes[step % chordNotes.length];
        step++;
        const cTime = this.ctx.currentTime;

        chord.forEach((f) => {
          if (!this.ctx || !this.musicThemeGain) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, cTime);

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, cTime);

          g.gain.setValueAtTime(0.001, cTime);
          g.gain.linearRampToValueAtTime(0.12, cTime + 0.8);
          g.gain.exponentialRampToValueAtTime(0.001, cTime + 3.8);

          osc.connect(filter);
          filter.connect(g);
          g.connect(this.musicThemeGain);
          osc.start(cTime);
          osc.stop(cTime + 4.0);
        });
      };

      playNextChord();
      const interval = setInterval(() => {
        if (!this.musicThemeGain) {
          clearInterval(interval);
          return;
        }
        playNextChord();
      }, 4000);
    } catch {
      // Ignore
    }
  }

  // --- CONFIRMATION CHIME (ACCEPT) ---
  public playAcceptChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [220, 277.18, 329.63, 440].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.25, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 1.8);
      });
    } catch {
      // Ignore
    }
  }

  // --- DECLINE GONG ---
  public playDeclineGong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 2.0);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.5);
    } catch {
      // Ignore
    }
  }
}

export const audioEngine = new AudioEngine();
