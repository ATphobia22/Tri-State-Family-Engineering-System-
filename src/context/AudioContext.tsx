import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (v: number) => void;
  isSystemOn: boolean;
  setSystemOn: (on: boolean) => void;
  currentSoundscape: 'hydraulic' | 'family' | 'off';
  setSoundscape: (s: 'hydraulic' | 'family' | 'off') => void;
}

const AudioSystemContext = createContext<AudioContextType | undefined>(undefined);

export function AudioSystemProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState<boolean>(true); // default muted to satisfy browser autoplay policies
  const [volume, setVolumeState] = useState<number>(0.3);
  const [isSystemOn, setSystemOn] = useState<boolean>(true);
  const [currentSoundscape, setSoundscapeState] = useState<'hydraulic' | 'family' | 'off'>('hydraulic');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const lfoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // ScriptProcessor is deprecated but still the most portable path in sandboxed iframes.
  // AudioWorklet migration is intentional backlog (needs separate worklet URL + CSP).
  const noiseNodeRef = useRef<ScriptProcessorNode | null>(null);

  // Initialize Audio Context lazily
  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.Q.setValueAtTime(1.0, ctx.currentTime);
      filter.connect(masterGain);
      filterRef.current = filter;

      startSoundscape();
    } catch (err) {
      console.error('Failed to initialize synthesized audio engine:', err);
    }
  };

  const startSoundscape = () => {
    const ctx = audioCtxRef.current;
    const filter = filterRef.current;
    if (!ctx || !filter) return;

    stopSoundSources();

    if (currentSoundscape === 'off') return;

    const freqs = currentSoundscape === 'hydraulic'
      ? [65.41, 130.81, 196.00, 261.63]
      : [110.00, 164.81, 220.00, 293.66, 329.63];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = currentSoundscape === 'hydraulic' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime((idx - 2) * 5, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(filter);
      osc.start();

      oscillatorsRef.current.push({ osc, gain });
    });

    try {
      const bufferSize = 4096;
      // eslint-disable-next-line deprecation/deprecation -- portable fallback; AudioWorklet TBD
      const scriptNode = ctx.createScriptProcessor(bufferSize, 1, 1);

      scriptNode.onaudioprocess = (e) => {
        const channelData = e.outputBuffer.getChannelData(0);
        for (let sample = 0; sample < bufferSize; sample++) {
          channelData[sample] = Math.random() * 2.0 - 1.0;
        }
      };

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(250, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.2, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.015, ctx.currentTime);

      scriptNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(filter);

      noiseNodeRef.current = scriptNode;

      let theta = 0;
      const modulationInterval = setInterval(() => {
        if (!ctx) return;
        theta += 0.05;
        const noiseFreq = 250 + Math.sin(theta) * 70;
        noiseFilter.frequency.setTargetAtTime(noiseFreq, ctx.currentTime, 0.2);
        const primaryFilterFreq = 350 + Math.cos(theta * 0.4) * 80;
        filter.frequency.setTargetAtTime(primaryFilterFreq, ctx.currentTime, 0.4);
      }, 100);

      lfoIntervalRef.current = modulationInterval;
    } catch (e) {
      console.warn('Procedural water audio generation skipped or not supported:', e);
    }
  };

  const stopSoundSources = () => {
    if (lfoIntervalRef.current) {
      clearInterval(lfoIntervalRef.current);
      lfoIntervalRef.current = null;
    }

    oscillatorsRef.current.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch {
        /* already stopped */
      }
    });
    oscillatorsRef.current = [];

    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.disconnect();
      } catch {
        /* already disconnected */
      }
      noiseNodeRef.current = null;
    }
  };

  const toggleMute = () => {
    initAudio();
    setIsMuted(prev => {
      const nextMuted = !prev;
      if (audioCtxRef.current && masterGainRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
          void audioCtxRef.current.resume();
        }
        masterGainRef.current.gain.setTargetAtTime(
          nextMuted ? 0 : volume * 0.25,
          audioCtxRef.current.currentTime,
          0.1
        );
      }
      return nextMuted;
    });
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioCtxRef.current && masterGainRef.current && !isMuted) {
      masterGainRef.current.gain.setTargetAtTime(
        val * 0.25,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  };

  const setSoundscape = (s: 'hydraulic' | 'family' | 'off') => {
    initAudio();
    setSoundscapeState(s);
  };

  useEffect(() => {
    if (audioCtxRef.current) {
      startSoundscape();
    }
  }, [currentSoundscape]);

  useEffect(() => {
    return () => {
      stopSoundSources();
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <AudioSystemContext.Provider
      value={{
        isMuted,
        toggleMute,
        volume,
        setVolume,
        isSystemOn,
        setSystemOn,
        currentSoundscape,
        setSoundscape,
      }}
    >
      {children}
    </AudioSystemContext.Provider>
  );
}

export function useAudioSystem() {
  const context = useContext(AudioSystemContext);
  if (context === undefined) {
    throw new Error('useAudioSystem must be used within an AudioSystemProvider');
  }
  return context;
}
