// Web Audio procedural royal raga synthesizer + background ambient wedding music

class RoyalWeddingAudio {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private volumeNode: GainNode | null = null;
  private currentVolume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft, resonant royal bell / temple chime
  public playRoyalChime(freq = 523.25, duration = 2.5) {
    try {
      this.initContext();
      if (!this.ctx || !this.volumeNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Warm chime tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Envelope
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.4, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.volumeNode);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Play wax seal crack & open fanfare
  public playWaxSealFanfare() {
    const notes = [440, 554.37, 659.25, 880]; // A major royal chord
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playRoyalChime(freq, 2.0);
      }, idx * 120);
    });
  }

  // Soft Indian classical melodic sequence (Shehnai/Flute scale - Raag Yaman notes)
  // E, F#, G#, B, C#, E
  public toggleAmbientMusic(onStateChange?: (playing: boolean) => void): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stopAmbientMusic();
      onStateChange?.(false);
      return false;
    } else {
      this.startAmbientMusic();
      onStateChange?.(true);
      return true;
    }
  }

  public startAmbientMusic() {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;

    // Raag Yaman notes (frequencies in Hz)
    // Meditative, celebratory, timeless Indian wedding raga
    const scale = [
      329.63, // E4
      370.00, // F#4
      415.30, // G#4
      493.88, // B4
      554.37, // C#5
      659.25, // E5
      739.99, // F#5
      830.61  // G#5
    ];

    let step = 0;
    const melody = [
      0, 1, 2, 3, 2, 1, 0,
      2, 3, 4, 5, 4, 3, 2,
      4, 5, 6, 7, 6, 5, 4,
      3, 2, 1, 0
    ];

    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx) return;

      const noteIdx = melody[step % melody.length];
      const freq = scale[noteIdx];

      // Soft tanpura drone effect + shehnai flute simulation
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = step % 4 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const noteDuration = step % 4 === 0 ? 1.6 : 0.9;
      noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 0.15);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + noteDuration);

      osc.connect(noteGain);
      if (this.volumeNode) {
        noteGain.connect(this.volumeNode);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + noteDuration);

      step++;
      const nextDelay = (step % 2 === 0 ? 550 : 750);
      this.timerId = window.setTimeout(playNextNote, nextDelay);
    };

    playNextNote();
  }

  public stopAmbientMusic() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const royalAudio = new RoyalWeddingAudio();
