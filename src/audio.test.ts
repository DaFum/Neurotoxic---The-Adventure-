import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { audio } from './audio';

// --- Mocks ---

class MockAudioParam {
  value = 0;
  setValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
}

class MockAudioNode {
  connect = vi.fn();
  disconnect = vi.fn();
}

class MockOscillatorNode extends MockAudioNode {
  type = 'sine';
  frequency = new MockAudioParam();
  start = vi.fn();
  stop = vi.fn();
}

class MockGainNode extends MockAudioNode {
  gain = new MockAudioParam();
}

class MockBiquadFilterNode extends MockAudioNode {
  type = 'lowpass';
  frequency = new MockAudioParam();
  Q = new MockAudioParam();
}

class MockAudioContext {
  state = 'suspended';
  currentTime = 0;
  destination = {};

  createOscillator = vi.fn(() => new MockOscillatorNode());
  createGain = vi.fn(() => new MockGainNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());

  resume = vi.fn().mockResolvedValue(undefined);
  suspend = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockResolvedValue(undefined);
}

describe('AudioEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('AudioContext', MockAudioContext);
    vi.stubGlobal('window', globalThis);
    audio.ctx = null;
    audio.isPlayingMusic = false;
    audio.currentAmbient = null;
    audio.tempo = 250;
    if (audio.musicInterval) clearInterval(audio.musicInterval);
    if (audio.ambientInterval) clearInterval(audio.ambientInterval);
    audio.musicInterval = null;
    audio.ambientInterval = null;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('init()', () => {
    it('should create an AudioContext if one does not exist', () => {
      expect(audio.ctx).toBeNull();
      audio.init();
      expect(audio.ctx).toBeInstanceOf(MockAudioContext);
    });

    it('should resume the AudioContext if it is suspended', async () => {
      audio.init();
      const ctx = audio.ctx as unknown as MockAudioContext;
      ctx.state = 'suspended';
      audio.init();
      expect(ctx.resume).toHaveBeenCalled();
    });

    it('should handle errors during resume gracefully', async () => {
      audio.init();
      const ctx = audio.ctx as unknown as MockAudioContext;
      ctx.state = 'suspended';
      ctx.resume.mockRejectedValueOnce(new Error('Resume failed'));

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      audio.init();

      // Wait for the promise rejection to be caught
      await Promise.resolve();

      expect(consoleWarnSpy).toHaveBeenCalledWith('AudioContext resume failed:', expect.any(Error));
    });

    it('should handle initialization errors gracefully', () => {
      vi.stubGlobal('AudioContext', vi.fn().mockImplementation(() => {
        throw new Error('Init failed');
      }));

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      audio.init();

      expect(consoleWarnSpy).toHaveBeenCalledWith('AudioContext initialization failed:', expect.any(Error));
    });
  });

  describe('setTempo()', () => {
    it('should update the tempo', () => {
      audio.setTempo(120);
      expect(audio.tempo).toBe(120);
    });

    it('should restart music if it is currently playing', () => {
      audio.init();
      audio.startMusic();
      const stopMusicSpy = vi.spyOn(audio, 'stopMusic');
      const startMusicSpy = vi.spyOn(audio, 'startMusic');

      audio.setTempo(150);

      expect(stopMusicSpy).toHaveBeenCalled();
      expect(startMusicSpy).toHaveBeenCalled();
    });
  });

  describe('playTone()', () => {
    it('should play a tone correctly', () => {
      audio.init();
      const ctx = audio.ctx as unknown as MockAudioContext;

      audio.playTone(440, 'sine', 1, 0.5);

      expect(ctx.createOscillator).toHaveBeenCalled();
      expect(ctx.createGain).toHaveBeenCalled();

      const osc = ctx.createOscillator.mock.results[0].value;
      const gain = ctx.createGain.mock.results[0].value;

      expect(osc.type).toBe('sine');
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(440, 0);
      expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.5, 0);
      expect(osc.connect).toHaveBeenCalledWith(gain);
      expect(gain.connect).toHaveBeenCalledWith(ctx.destination);
      expect(osc.start).toHaveBeenCalled();
      expect(osc.stop).toHaveBeenCalledWith(1);
    });

    it('should handle errors when playing a tone gracefully', () => {
      audio.init();
      const ctx = audio.ctx as unknown as MockAudioContext;
      ctx.createOscillator.mockImplementationOnce(() => {
        throw new Error('Oscillator failed');
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      audio.playTone(440, 'sine', 1);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Error playing tone:', expect.any(Error));
    });

    it('should do nothing if ctx is null', () => {
      audio.ctx = null;
      expect(() => audio.playTone(440, 'sine', 1)).not.toThrow();
    });
  });

  describe('Sound Effects', () => {
    beforeEach(() => {
      vi.spyOn(audio, 'playTone').mockImplementation(() => {});
    });

    it('should play interaction sound', () => {
      audio.playInteract();
      expect(audio.playTone).toHaveBeenCalledWith(440, 'square', 0.1, 0.05);
      vi.advanceTimersByTime(50);
      expect(audio.playTone).toHaveBeenCalledWith(880, 'square', 0.1, 0.05);
    });

    it('should play pickup sound', () => {
      audio.playPickup();
      expect(audio.playTone).toHaveBeenCalledWith(300, 'sawtooth', 0.1, 0.1);
      vi.advanceTimersByTime(100);
      expect(audio.playTone).toHaveBeenCalledWith(400, 'sawtooth', 0.1, 0.1);
      vi.advanceTimersByTime(100);
      expect(audio.playTone).toHaveBeenCalledWith(500, 'sawtooth', 0.2, 0.1);
      vi.advanceTimersByTime(100);
      expect(audio.playTone).toHaveBeenCalledWith(800, 'sawtooth', 0.3, 0.1);
    });

    it('should play footstep sound', () => {
      audio.playFootstep();
      expect(audio.playTone).toHaveBeenCalledWith(expect.any(Number), 'sine', 0.05, 0.02);
    });

    it('should play interaction (terminal) sound', () => {
      audio.playInteraction();
      expect(audio.playTone).toHaveBeenCalledWith(1200, 'sine', 0.05, 0.05);
      vi.advanceTimersByTime(50);
      expect(audio.playTone).toHaveBeenCalledWith(1600, 'sine', 0.05, 0.05);
    });

    it('should play typewriter sound', () => {
      audio.playTypewriter();
      expect(audio.playTone).toHaveBeenCalledWith(expect.any(Number), 'sine', 0.02, 0.02);
    });
  });

  describe('Ambient Music', () => {
    beforeEach(() => {
      vi.spyOn(audio, 'playTone').mockImplementation(() => {});
    });

    it('should start ambient track and clear previous one', () => {
      audio.startAmbient('proberaum');
      expect(audio.currentAmbient).toBe('proberaum');
      expect(audio.ambientInterval).not.toBeNull();
      const previousInterval = audio.ambientInterval;

      audio.startAmbient('tourbus');
      expect(audio.currentAmbient).toBe('tourbus');
      expect(audio.ambientInterval).not.toBe(previousInterval);
    });

    it('should not restart if the same ambient type is requested', () => {
      audio.startAmbient('proberaum');
      const interval = audio.ambientInterval;
      audio.startAmbient('proberaum');
      expect(audio.ambientInterval).toBe(interval);
    });

    it('should stop ambient track', () => {
      audio.startAmbient('proberaum');
      audio.stopAmbient();
      expect(audio.currentAmbient).toBeNull();
      expect(audio.ambientInterval).toBeNull();
    });

    it('should handle kaminstube filter creation error gracefully', () => {
        audio.init();
        const ctx = audio.ctx as unknown as MockAudioContext;
        ctx.state = 'running';
        ctx.createBiquadFilter.mockImplementationOnce(() => {
            throw new Error('Filter failed');
        });

        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        audio.startAmbient('kaminstube');
        vi.advanceTimersByTime(100);

        expect(consoleWarnSpy).toHaveBeenCalledWith('Error playing kaminstube ambient:', expect.any(Error));
    });

    it('should not play ambient if context is suspended', () => {
      audio.init();
      const ctx = audio.ctx as unknown as MockAudioContext;
      ctx.state = 'suspended';
      audio.startAmbient('proberaum');
      vi.advanceTimersByTime(1000);
      expect(audio.playTone).not.toHaveBeenCalled();
    });

    it('should play ambient sounds based on type', () => {
        audio.init();
        const ctx = audio.ctx as unknown as MockAudioContext;
        ctx.state = 'running';

        // test each type
        audio.startAmbient('proberaum');
        vi.advanceTimersByTime(1000);
        expect(audio.playTone).toHaveBeenCalledWith(expect.any(Number), 'sine', 0.5, 0.02);

        audio.startAmbient('tourbus');
        vi.advanceTimersByTime(1000);
        expect(audio.playTone).toHaveBeenCalledWith(50, 'sine', 1.0, 0.01);

        audio.startAmbient('backstage');
        vi.advanceTimersByTime(1000);
        expect(audio.playTone).toHaveBeenCalledWith(expect.any(Number), 'sine', 0.1, 0.005);

        audio.startAmbient('void_station');
        vi.advanceTimersByTime(1000);
        expect(audio.playTone).toHaveBeenCalledWith(expect.any(Number), 'sawtooth', 0.05, 0.005);

        audio.startAmbient('kaminstube');
        vi.advanceTimersByTime(100);
        expect(ctx.createBiquadFilter).toHaveBeenCalled();

        audio.startAmbient('salzgitter');
        vi.advanceTimersByTime(1000);
        expect(audio.playTone).toHaveBeenCalledWith(60, 'sine', 1.0, 0.01);
    });
  });

  describe('Music', () => {
    beforeEach(() => {
      vi.spyOn(audio, 'playTone').mockImplementation(() => {});
    });

    it('should start music track', () => {
      audio.startMusic();
      expect(audio.isPlayingMusic).toBe(true);
      expect(audio.musicInterval).not.toBeNull();
    });

    it('should stop music track', () => {
      audio.startMusic();
      audio.stopMusic();
      expect(audio.isPlayingMusic).toBe(false);
      expect(audio.musicInterval).toBeNull();
    });

    it('should not restart music if already playing', () => {
      audio.startMusic();
      const interval = audio.musicInterval;
      audio.startMusic();
      expect(audio.musicInterval).toBe(interval);
    });

    it('should play notes when context is running', () => {
        audio.init();
        const ctx = audio.ctx as unknown as MockAudioContext;
        ctx.state = 'running';

        audio.startMusic();

        // step 0: kick drum and bass
        vi.advanceTimersByTime(audio.tempo);
        expect(audio.playTone).toHaveBeenCalledWith(55.00, 'sawtooth', 0.2, 0.15);
        expect(ctx.createOscillator).toHaveBeenCalled(); // kick drum

        // step 1: bass
        vi.advanceTimersByTime(audio.tempo);
        expect(audio.playTone).toHaveBeenCalledWith(55.00, 'sawtooth', 0.2, 0.15);

        // step 2: kick drum, snare and bass
        vi.advanceTimersByTime(audio.tempo);
        expect(audio.playTone).toHaveBeenCalledWith(65.41, 'sawtooth', 0.2, 0.15);
        expect(audio.playTone).toHaveBeenCalledWith(800, 'square', 0.1, 0.05); // snare
    });

    it('should not play notes when context is suspended', () => {
        audio.init();
        const ctx = audio.ctx as unknown as MockAudioContext;
        ctx.state = 'suspended';

        audio.startMusic();
        vi.advanceTimersByTime(audio.tempo);
        expect(audio.playTone).not.toHaveBeenCalled();
    });

    it('should handle kick drum error gracefully', () => {
        audio.init();
        const ctx = audio.ctx as unknown as MockAudioContext;
        ctx.state = 'running';
        ctx.createGain.mockImplementationOnce(() => {
            throw new Error('Kick drum failed');
        });

        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        audio.startMusic();
        vi.advanceTimersByTime(audio.tempo);

        expect(consoleWarnSpy).toHaveBeenCalledWith('Error playing kick drum:', expect.any(Error));
    });
  });
});
