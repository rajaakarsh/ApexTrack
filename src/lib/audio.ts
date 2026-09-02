// Web Audio API procedural sound engine for ambient focus sounds and timer chimes

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentSource: { stop: () => void } | null = null;
  private currentMode: string | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play gentle bell chime when timer ends
  playTimerChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Polyphonic bell sound (Fundamental + Harmonics)
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C Major chord (C5, E5, G5, C6)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 2.6);
      });
    } catch {
      // Ignore audio autoplay prevention on initial load
    }
  }

  // Start ambient focus audio
  playAmbient(soundType: 'binaural' | 'rain' | 'brown' | 'lofi' | 'none', volume: number = 0.5) {
    this.stopAmbient();
    if (soundType === 'none') return;

    try {
      const ctx = this.getContext();
      this.currentMode = soundType;

      if (soundType === 'binaural') {
        // 40Hz Gamma Focus: Left ear 200Hz, Right ear 240Hz
        const leftOsc = ctx.createOscillator();
        const rightOsc = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();

        leftOsc.type = 'sine';
        leftOsc.frequency.setValueAtTime(196, ctx.currentTime);

        rightOsc.type = 'sine';
        rightOsc.frequency.setValueAtTime(236, ctx.currentTime);

        const leftGain = ctx.createGain();
        const rightGain = ctx.createGain();
        leftGain.gain.setValueAtTime(0.15 * volume, ctx.currentTime);
        rightGain.gain.setValueAtTime(0.15 * volume, ctx.currentTime);

        leftOsc.connect(leftGain);
        rightOsc.connect(rightGain);
        leftGain.connect(merger, 0, 0); // left channel
        rightGain.connect(merger, 0, 1); // right channel

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        merger.connect(gain);
        gain.connect(ctx.destination);

        leftOsc.start();
        rightOsc.start();

        this.currentSource = {
          stop: () => {
            try {
              leftOsc.stop();
              rightOsc.stop();
            } catch {}
          }
        };
      } else if (soundType === 'rain' || soundType === 'brown') {
        // Procedural noise buffer (Rain / Brown Noise)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (soundType === 'brown') {
            // Brown noise: Integrate white noise
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            // Pink/Rain filter
            output[i] = (lastOut + 0.05 * white) / 1.05;
            lastOut = output[i];
            output[i] *= 1.8;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = soundType === 'rain' ? 'bandpass' : 'lowpass';
        filter.frequency.setValueAtTime(soundType === 'rain' ? 800 : 350, ctx.currentTime);
        filter.Q.setValueAtTime(soundType === 'rain' ? 0.7 : 1.0, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12 * volume, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();
        this.currentSource = {
          stop: () => {
            try {
              whiteNoise.stop();
            } catch {}
          }
        };
      } else if (soundType === 'lofi') {
        // Warm Lo-Fi drone chord
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        gain.gain.setValueAtTime(0.1 * volume, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        this.currentSource = {
          stop: () => {
            try {
              osc1.stop();
              osc2.stop();
            } catch {}
          }
        };
      }
    } catch (e) {
      console.warn('Ambient audio could not start:', e);
    }
  }

  stopAmbient() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
    this.currentMode = null;
  }

  getCurrentSound(): string | null {
    return this.currentMode;
  }
}

export const soundEngine = new AudioSynthesizer();
