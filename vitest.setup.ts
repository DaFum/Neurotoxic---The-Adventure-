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
      type: 'sine',
    };
  }
  createGain() {
    return {
      connect: vi.fn(),
      gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
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
    },
  };
})();

const g: any = global as any;
if (!g.window) {
  g.window = {};
}
Object.defineProperty(g.window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

// Mock console.error to silence react-three-fiber and jsdom warnings about custom elements
const originalError = console.error;
vi.spyOn(console, 'error').mockImplementation((...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('is using incorrect casing') ||
      args[0].includes('is unrecognized in this browser') ||
      args[0].includes('React does not recognize the') ||
      args[0].includes('Not implemented: HTMLCanvasElement') ||
      args[0].includes('Received `true` for a non-boolean attribute'))
  ) {
    return;
  }
  originalError.apply(console, args);
});
