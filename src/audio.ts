/**
 * #1: UPDATES
 * - Initialized audio engine for sound effects and ambient music.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more complex music tracks.
 * - Implement volume control settings.
 * - Add sound effects for dialogue typing.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
class AudioEngine {
  ctx: AudioContext | null = null;
  musicInterval: number | null = null;
  ambientInterval: number | null = null;
  isPlayingMusic = false;
  currentAmbient: string | null = null;
  tempo = 250;

  init() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setTempo(newTempo: number) {
    this.tempo = newTempo;
    if (this.isPlayingMusic) {
      this.stopMusic();
      this.startMusic();
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playInteract() {
    this.init();
    this.playTone(440, 'square', 0.1, 0.05);
    setTimeout(() => this.playTone(880, 'square', 0.1, 0.05), 50);
  }

  playPickup() {
    this.init();
    this.playTone(300, 'sawtooth', 0.1, 0.1);
    setTimeout(() => this.playTone(400, 'sawtooth', 0.1, 0.1), 100);
    setTimeout(() => this.playTone(500, 'sawtooth', 0.2, 0.1), 200);
    setTimeout(() => this.playTone(800, 'sawtooth', 0.3, 0.1), 300);
  }

  playFootstep() {
    this.init();
    // Low noise burst for footstep
    this.playTone(60 + Math.random() * 20, 'sine', 0.05, 0.02);
  }

  playInteraction() {
    this.init();
    // High-tech beep
    this.playTone(1200, 'sine', 0.05, 0.05);
    setTimeout(() => this.playTone(1600, 'sine', 0.05, 0.05), 50);
  }

  playTypewriter() {
    this.init();
    this.playTone(600 + Math.random() * 200, 'sine', 0.02, 0.02);
  }

  startAmbient(type: 'proberaum' | 'tourbus' | 'backstage' | 'void_station' | 'kaminstube' | 'salzgitter') {
    this.init();
    if (this.currentAmbient === type) return;
    this.stopAmbient();
    this.currentAmbient = type;

    this.ambientInterval = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running') return;

      if (type === 'proberaum') {
        // Muffled thumping
        this.playTone(40 + Math.random() * 10, 'sine', 0.5, 0.02);
      } else if (type === 'tourbus') {
        // Engine hum
        this.playTone(50, 'sine', 1.0, 0.01);
      } else if (type === 'backstage') {
        // Muffled crowd chatter
        this.playTone(200 + Math.random() * 50, 'sine', 0.1, 0.005);
      } else if (type === 'void_station') {
        // Cosmic glitches
        this.playTone(800 + Math.random() * 2000, 'sawtooth', 0.05, 0.005);
        this.playTone(20 + Math.random() * 30, 'square', 0.2, 0.05);
      } else if (type === 'kaminstube') {
        // Fire crackling (noise bursts)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        filter.type = 'bandpass';
        filter.frequency.value = 1000 + Math.random() * 2000;
        filter.Q.value = 10;

        osc.type = 'sawtooth';
        osc.frequency.value = 100;
        
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } else if (type === 'salzgitter') {
        // Distant city hum
        this.playTone(60, 'sine', 1.0, 0.01);
        if (Math.random() > 0.9) this.playTone(200 + Math.random() * 100, 'sine', 2.0, 0.005);
      }
    }, type === 'kaminstube' ? 100 : 1000);
  }

  stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.currentAmbient = null;
  }

  startMusic() {
    this.init();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    let step = 0;
    const bassline = [
      55.00, // A1
      55.00,
      65.41, // C2
      55.00,
      73.42, // D2
      55.00,
      82.41, // E2
      65.41,
    ];

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running') return;
      
      // Play bass note
      const freq = bassline[step % bassline.length];
      this.playTone(freq, 'sawtooth', 0.2, 0.15);
      
      // Play kick drum (low sine sweep)
      if (step % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
      }

      // Play snare (noise burst)
      if (step % 4 === 2) {
        this.playTone(800, 'square', 0.1, 0.05); // Fake snare with high square
      }

      step++;
    }, this.tempo); // Dynamic BPM
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audio = new AudioEngine();
