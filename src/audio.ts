export type AmbientScene = 'proberaum' | 'tourbus' | 'backstage' | 'void_station' | 'kaminstube' | 'salzgitter';

export const isAmbientScene = (scene: string): scene is AmbientScene => {
  return ['proberaum', 'tourbus', 'backstage', 'void_station', 'kaminstube', 'salzgitter'].includes(scene);
};

/**
 * A simple audio engine class for managing sound effects and ambient music
 * in the game using the Web Audio API. It supports synthesized sounds,
 * footsteps, interactions, ambient tracks, and basic music.
 */
class AudioEngine {
  ctx: AudioContext | null = null;
  musicInterval: number | null = null;
  ambientInterval: number | null = null;
  isPlayingMusic = false;
  currentAmbient: string | null = null;
  tempo = 250;

  /**
   * Initializes the AudioContext if it hasn't been created yet.
   * Resumes the context if it is in a suspended state.
   */
  init() {
    try {
      if (!this.ctx) {
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch((e) => {
          console.warn('AudioContext resume failed:', e);
        });
      }
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
    }
  }

  /**
   * Updates the global tempo for the music track.
   * Restarts the music if it's currently playing to apply the new tempo immediately.
   * @param newTempo - The new tempo in milliseconds per beat.
   */
  setTempo(newTempo: number) {
    this.tempo = newTempo;
    if (this.isPlayingMusic) {
      this.stopMusic();
      this.startMusic();
    }
  }

  /**
   * Synthesizes and plays a basic tone using the Web Audio API.
   * @param freq - The frequency of the tone in Hertz.
   * @param type - The waveform shape of the oscillator (e.g., 'sine', 'square').
   * @param duration - How long the tone should play in seconds.
   * @param vol - The peak volume level of the tone.
   */
  playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.ctx) return;
    try {
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
    } catch (e) {
      console.warn('Error playing tone:', e);
    }
  }

  /**
   * Plays a two-tone confirmation sound used for successful UI or world interactions.
   */
  playInteract() {
    this.init();
    this.playTone(440, 'square', 0.1, 0.05);
    setTimeout(() => this.playTone(880, 'square', 0.1, 0.05), 50);
  }

  /**
   * Plays an ascending arpeggio sound effect used when the player picks up an item.
   */
  playPickup() {
    this.init();
    this.playTone(300, 'sawtooth', 0.1, 0.1);
    setTimeout(() => this.playTone(400, 'sawtooth', 0.1, 0.1), 100);
    setTimeout(() => this.playTone(500, 'sawtooth', 0.2, 0.1), 200);
    setTimeout(() => this.playTone(800, 'sawtooth', 0.3, 0.1), 300);
  }

  /**
   * Plays a randomized low-frequency burst simulating a footstep sound.
   */
  playFootstep() {
    this.init();
    // Low noise burst for footstep
    this.playTone(60 + Math.random() * 20, 'sine', 0.05, 0.02);
  }

  /**
   * Plays a high-tech double beep sound used for terminal or machine interactions.
   */
  playInteraction() {
    this.init();
    // High-tech beep
    this.playTone(1200, 'sine', 0.05, 0.05);
    setTimeout(() => this.playTone(1600, 'sine', 0.05, 0.05), 50);
  }

  /**
   * Plays a short, randomized click sound simulating a typewriter keystroke for dialogue.
   */
  playTypewriter() {
    this.init();
    this.playTone(600 + Math.random() * 200, 'sine', 0.02, 0.02);
  }

  /**
   * Starts a looping ambient background track specific to the given scene.
   * @param type - The identifier of the scene to load ambient audio for.
   */
  startAmbient(type: AmbientScene) {
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
        try {
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
        } catch (e) {
          console.warn('Error playing kaminstube ambient:', e);
        }
      } else if (type === 'salzgitter') {
        // Distant city hum
        this.playTone(60, 'sine', 1.0, 0.01);
        if (Math.random() > 0.9) this.playTone(200 + Math.random() * 100, 'sine', 2.0, 0.005);
      }
    }, type === 'kaminstube' ? 100 : 1000);
  }

  /**
   * Stops the currently playing ambient background loop and clears the interval.
   */
  stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.currentAmbient = null;
  }

  /**
   * Starts playing the main dynamic music track consisting of a bassline, kick drum, and snare.
   */
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
        try {
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
        } catch (e) {
          console.warn('Error playing kick drum:', e);
        }
      }

      // Play snare (noise burst)
      if (step % 4 === 2) {
        this.playTone(800, 'square', 0.1, 0.05); // Fake snare with high square
      }

      step++;
    }, this.tempo); // Dynamic BPM
  }

  /**
   * Stops the currently playing music track and clears the interval.
   */
  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

/**
 * A singleton instance of the AudioEngine used throughout the application
 * to trigger sound effects and control ambient noise or music.
 */
export const audio = new AudioEngine();
