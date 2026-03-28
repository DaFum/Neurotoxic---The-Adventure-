import { vi } from 'vitest';

// Mock AudioContext for Node.js environment
class AudioContextMock {
  state = 'running';
  createOscillator() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      type: 'sine'
    };
  }
  createGain() {
    return {
      connect: vi.fn(),
      gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
    };
  }
  resume = vi.fn();
  destination = {};
  currentTime = 0;
}

global.AudioContext = AudioContextMock as any;

// Mock window.localStorage to silence persist middleware warnings
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function (key: string) {
      delete store[key];
    },
    clear: function () {
      store = {};
    }
  };
})();

Object.defineProperty(global, 'window', {
  value: { localStorage: localStorageMock }
});
