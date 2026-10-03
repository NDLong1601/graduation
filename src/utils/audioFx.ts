// Web Audio API Synthesizer for High-Tech Sound FX
class SoundFX {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Sci-fi click beep
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio not permitted yet
    }
  }

  // Futuristic Hologram unlock chord
  public playUnlock() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major 9th
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch {
      // Audio fallback
    }
  }

  // Cap toss celebratory fanfare & whoosh
  public playCapToss() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // 1. Whoosh sound
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2500, this.ctx.currentTime + 0.3);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.4);

      // 2. Victory Arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C major high
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + 0.15 + idx * 0.07);

        const startTime = this.ctx.currentTime + 0.15 + idx * 0.07;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.95);
      });
    } catch {
      // Audio fallback
    }
  }

  // Success chime for RSVP
  public playSuccess() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [587.33, 880, 1174.66]; // D-A-D
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

        const startTime = this.ctx.currentTime + idx * 0.1;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.75);
      });
    } catch {
      // Audio fallback
    }
  }

  // Realistic Wax Seal Breaking & Envelope Opening sound
  public playWaxSealBreak() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // 1. Crack / Snap
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.08);

      // 2. Chime sequence as envelope unfolds
      setTimeout(() => {
        this.playUnlock();
      }, 90);
    } catch {
      // Audio fallback
    }
  }

  // Diploma parchment unroll rustle and chime
  public playDiplomaUnroll() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [659.25, 830.61, 987.77, 1318.51]; // E major chord
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        const startTime = this.ctx.currentTime + idx * 0.07;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch {
      // Audio fallback
    }
  }

  // Paper airplane swoosh
  public playPaperPlaneWhoosh() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch {
      // Audio fallback
    }
  }

  // Royal Fireworks grand fanfare
  public playRoyalFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const fanfare = [
        { f: 523.25, t: 0.0 },   // C5
        { f: 659.25, t: 0.1 },   // E5
        { f: 783.99, t: 0.2 },   // G5
        { f: 1046.50, t: 0.32 }, // C6
        { f: 1318.51, t: 0.44 }, // E6
        { f: 1567.98, t: 0.56 }, // G6
        { f: 2093.00, t: 0.70 }, // C7 grand bell
      ];

      fanfare.forEach(({ f, t }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + t);

        const startTime = this.ctx.currentTime + t;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.25);
      });
    } catch {
      // Audio fallback
    }
  }
  // 3D Golden Warp Speed cosmic riser
  public playWarpSpeed() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Filtered pink noise acceleration
      const bufferSize = this.ctx.sampleRate * 2.0;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 4.0;
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, this.ctx.currentTime + 1.8);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 2.0);

      // Shimmering harmonic tones rising
      [220, 329.63, 440, 554.37, 659.25, 880].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.8, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 1.6);

        const startTime = this.ctx.currentTime + idx * 0.12;
        oscGain.gain.setValueAtTime(0.001, startTime);
        oscGain.gain.linearRampToValueAtTime(0.04, startTime + 0.3);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.5);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.5);
      });
    } catch {
      // Audio fallback
    }
  }

  // Supernova flash & transition chord
  public playSupernova() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const startTime = this.ctx.currentTime + idx * 0.04;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.85);
      });
    } catch {
      // Audio fallback
    }
  }

  // Grand Royal Gates opening sound
  public playGateOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // 1. Heavy iron bolt unlock clink
      const boltOsc = this.ctx.createOscillator();
      const boltGain = this.ctx.createGain();
      boltOsc.type = 'square';
      boltOsc.frequency.setValueAtTime(440, this.ctx.currentTime);
      boltOsc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.12);
      boltGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      boltGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      boltOsc.connect(boltGain);
      boltGain.connect(this.ctx.destination);
      boltOsc.start();
      boltOsc.stop(this.ctx.currentTime + 0.12);

      // 2. Heavy door resonance whoosh (filtered low-frequency sweep)
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, this.ctx.currentTime + 0.1);
      filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.2);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(this.ctx.currentTime + 0.08);
      noise.stop(this.ctx.currentTime + 1.5);

      // 3. Welcoming Royal Chimes
      const chimeNotes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G - C - E - G - C
      chimeNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + 0.25 + idx * 0.12);
        const startTime = this.ctx.currentTime + 0.25 + idx * 0.12;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.15);
      });
    } catch {
      // Audio fallback
    }
  }

  // Particle Morphing crystalline arpeggio
  public playParticleMorph() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      pentatonic.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
        const startTime = this.ctx.currentTime + idx * 0.09;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch {
      // Audio fallback
    }
  }

  // Particle burst & scatter whoosh
  public playParticleExplosion() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);

      // High shimmering sparkles
      [1567.98, 2093.00, 2637.02].forEach((f, i) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.06);
        const st = this.ctx.currentTime + i * 0.06;
        g.gain.setValueAtTime(0.1, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.6);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(st);
        o.stop(st + 0.65);
      });
    } catch {
      // Audio fallback
    }
  }

  // Cyber compile glitch beeps
  public playCyberGlitch() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [587.33, 880.00, 1174.66, 1760.00];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
        const startTime = this.ctx.currentTime + idx * 0.05;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.06);
      });
    } catch {
      // Audio fallback
    }
  }

  // Gold Alchemy Wave transformation resonance
  public playGoldAlchemyWave() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Deep sub transformation whoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);

      // Radiant Gold bells arpeggio
      const goldChord = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      goldChord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const bell = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bell.type = 'triangle';
        bell.frequency.setValueAtTime(freq, this.ctx.currentTime + 0.2 + idx * 0.08);
        const st = this.ctx.currentTime + 0.2 + idx * 0.08;
        bellGain.gain.setValueAtTime(0, st);
        bellGain.gain.linearRampToValueAtTime(0.18, st + 0.03);
        bellGain.gain.exponentialRampToValueAtTime(0.001, st + 1.4);
        bell.connect(bellGain);
        bellGain.connect(this.ctx.destination);
        bell.start(st);
        bell.stop(st + 1.45);
      });
    } catch {
      // Audio fallback
    }
  }

  // Realistic 3D Book page turn rustle sound
  public playBookPageTurn() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  }

  // Crystal glass singing bowl resonance
  public playCrystalResonance() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const glassNotes = [880, 1320, 1760]; // Pure octave and fifth
      glassNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.25);
      });
    } catch {
      // Audio fallback
    }
  }

  // Crystal sphere shatter sparkle
  public playCrystalShatter() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Deep sub release
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(160, this.ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.6);
      subGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start();
      sub.stop(this.ctx.currentTime + 0.6);

      // Crystalline glass shards (random high chimes)
      const shards = [1760, 2093, 2349, 2793, 3135, 3520];
      shards.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.04);
        const st = this.ctx.currentTime + i * 0.04;
        gain.gain.setValueAtTime(0.12, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.7);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(st);
        osc.stop(st + 0.75);
      });
    } catch {
      // Audio fallback
    }
  }

  // Firework launch whistle & whoosh
  public playFireworkLaunch() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const st = this.ctx.currentTime;
      osc.frequency.setValueAtTime(350, st);
      osc.frequency.exponentialRampToValueAtTime(1400, st + 0.5);

      gain.gain.setValueAtTime(0.04, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.55);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, st);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(st);
      osc.stop(st + 0.55);
    } catch {
      // Audio fallback
    }
  }

  // Firework explosion boom & crackles
  public playFireworkBurst() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const st = this.ctx.currentTime;

      // 1. Bass thud
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(130, st);
      sub.frequency.exponentialRampToValueAtTime(30, st + 0.7);

      subGain.gain.setValueAtTime(0.28, st);
      subGain.gain.exponentialRampToValueAtTime(0.001, st + 0.7);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(st);
      sub.stop(st + 0.72);

      // 2. Sparkle crackles
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, st);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, st);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, st + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(st);
    } catch {
      // Audio fallback
    }
  }

  // Grand finale fanfare & thunderous fireworks barrage
  public playGrandCelebrationBurst() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const st = this.ctx.currentTime;

      // Triad chords: C5, E5, G5, C6 (Triumphant brass chime)
      const fanfare = [523.25, 659.25, 783.99, 1046.5];
      fanfare.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, st + idx * 0.08);

        const t = st + idx * 0.08;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.14, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 1.25);
      });

      // Rolling thunder
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(95, st);
      sub.frequency.exponentialRampToValueAtTime(25, st + 1.5);
      subGain.gain.setValueAtTime(0.35, st);
      subGain.gain.exponentialRampToValueAtTime(0.001, st + 1.5);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(st);
      sub.stop(st + 1.55);
    } catch {
      // Audio fallback
    }
  }

  // Velvet curtain sweep & stage reveal
  public playCurtainOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const st = this.ctx.currentTime;

      // 1. Soft velvet whoosh
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.2);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, st);
      filter.frequency.linearRampToValueAtTime(950, st + 0.6);
      filter.frequency.linearRampToValueAtTime(300, st + 1.2);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0, st);
      noiseGain.gain.linearRampToValueAtTime(0.12, st + 0.3);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, st + 1.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(st);

      // 2. Harp glissando arpeggio
      const notes = [349.23, 440.0, 523.25, 698.46, 880.0, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, st + idx * 0.08);

        const t = st + idx * 0.08;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.09, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.95);
      });
    } catch {
      // Audio fallback
    }
  }

  // Grand theatre fanfare
  public playStageFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const st = this.ctx.currentTime;
      // Majestic F major trumpet fanfare
      const brassNotes = [349.23, 440.0, 523.25, 698.46, 880.0];
      brassNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, st + idx * 0.07);

        const t = st + idx * 0.07;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 1.45);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sound = new SoundFX();
