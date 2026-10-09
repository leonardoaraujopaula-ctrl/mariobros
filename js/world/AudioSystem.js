export class AudioSystem {
    constructor() {
        this.ctx = null;
        this.bgmTimeout = null;
        this.isPlayingBGM = false;
        this.noteIndex = 0;
        this.currentLevel = 1;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playNote(freq, duration, type = 'square', gainValue = 0.15) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // Melodia Extendida e Longa do Tema Overworld
    playThemeOverworld() {
        if (!this.isPlayingBGM) return;

        const notes = [
            // --- INTRODUÇÃO ---
            { f: 659.25, d: 0.15 }, { f: 659.25, d: 0.15 }, { f: 0, d: 0.15 }, { f: 659.25, d: 0.15 },
            { f: 0, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 659.25, d: 0.3 }, { f: 783.99, d: 0.3 },
            { f: 0, d: 0.3 }, { f: 392.00, d: 0.3 }, { f: 0, d: 0.3 },

            // --- SEÇÃO PRINCIPAL A1 ---
            { f: 523.25, d: 0.25 }, { f: 0, d: 0.15 }, { f: 392.00, d: 0.25 }, { f: 0, d: 0.15 },
            { f: 329.63, d: 0.25 }, { f: 0, d: 0.15 }, { f: 440.00, d: 0.2 }, { f: 493.88, d: 0.2 },
            { f: 466.16, d: 0.15 }, { f: 440.00, d: 0.25 }, { f: 392.00, d: 0.2 }, { f: 659.25, d: 0.2 },
            { f: 783.99, d: 0.2 }, { f: 880.00, d: 0.2 }, { f: 698.46, d: 0.15 }, { f: 783.99, d: 0.15 },
            { f: 0, d: 0.1 }, { f: 659.25, d: 0.2 }, { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.15 },
            { f: 493.88, d: 0.25 },

            // --- SEÇÃO PRINCIPAL A2 ---
            { f: 523.25, d: 0.25 }, { f: 0, d: 0.15 }, { f: 392.00, d: 0.25 }, { f: 0, d: 0.15 },
            { f: 329.63, d: 0.25 }, { f: 0, d: 0.15 }, { f: 440.00, d: 0.2 }, { f: 493.88, d: 0.2 },
            { f: 466.16, d: 0.15 }, { f: 440.00, d: 0.25 }, { f: 392.00, d: 0.2 }, { f: 659.25, d: 0.2 },
            { f: 783.99, d: 0.2 }, { f: 880.00, d: 0.2 }, { f: 698.46, d: 0.15 }, { f: 783.99, d: 0.15 },
            { f: 0, d: 0.1 }, { f: 659.25, d: 0.2 }, { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.15 },
            { f: 493.88, d: 0.25 },

            // --- PONTE PRIMÁRIA B1 ---
            { f: 0, d: 0.15 }, { f: 783.99, d: 0.15 }, { f: 739.99, d: 0.15 }, { f: 698.46, d: 0.15 },
            { f: 622.25, d: 0.2 }, { f: 659.25, d: 0.2 }, { f: 0, d: 0.15 }, { f: 415.30, d: 0.15 },
            { f: 440.00, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 0, d: 0.15 }, { f: 440.00, d: 0.15 },
            { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.2 },

            { f: 0, d: 0.15 }, { f: 783.99, d: 0.15 }, { f: 739.99, d: 0.15 }, { f: 698.46, d: 0.15 },
            { f: 622.25, d: 0.2 }, { f: 659.25, d: 0.2 }, { f: 0, d: 0.15 }, { f: 1046.50, d: 0.2 },
            { f: 1046.50, d: 0.15 }, { f: 1046.50, d: 0.25 },

            // --- PONTE PRIMÁRIA B2 ---
            { f: 0, d: 0.15 }, { f: 783.99, d: 0.15 }, { f: 739.99, d: 0.15 }, { f: 698.46, d: 0.15 },
            { f: 622.25, d: 0.2 }, { f: 659.25, d: 0.2 }, { f: 0, d: 0.15 }, { f: 415.30, d: 0.15 },
            { f: 440.00, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 0, d: 0.15 }, { f: 440.00, d: 0.15 },
            { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.2 },

            { f: 0, d: 0.15 }, { f: 622.25, d: 0.25 }, { f: 0, d: 0.15 }, { f: 587.33, d: 0.25 },
            { f: 0, d: 0.15 }, { f: 523.25, d: 0.3 }, { f: 0, d: 0.3 },

            // --- SEÇÃO SECUNDÁRIA C (ESTROFE GRAVE / JAZZ) ---
            { f: 523.25, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 0, d: 0.15 }, { f: 523.25, d: 0.15 },
            { f: 0, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.2 }, { f: 659.25, d: 0.2 },
            { f: 523.25, d: 0.15 }, { f: 440.00, d: 0.15 }, { f: 392.00, d: 0.3 },

            { f: 523.25, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 0, d: 0.15 }, { f: 523.25, d: 0.15 },
            { f: 0, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.15 }, { f: 659.25, d: 0.15 },
            { f: 0, d: 0.3 },

            { f: 523.25, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 0, d: 0.15 }, { f: 523.25, d: 0.15 },
            { f: 0, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.2 }, { f: 659.25, d: 0.2 },
            { f: 523.25, d: 0.15 }, { f: 440.00, d: 0.15 }, { f: 392.00, d: 0.3 },

            // --- TRANSIÇÃO DE VOLTA AO INÍCIO ---
            { f: 659.25, d: 0.15 }, { f: 659.25, d: 0.15 }, { f: 0, d: 0.15 }, { f: 659.25, d: 0.15 },
            { f: 0, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 659.25, d: 0.3 }, { f: 783.99, d: 0.3 },
            { f: 0, d: 0.4 }
        ];

        const note = notes[this.noteIndex];
        if (note && note.f > 0) {
            this.playNote(note.f, note.d, 'square', 0.15);
        }

        this.noteIndex = (this.noteIndex + 1) % notes.length;
        const delay = (note ? note.d : 0.2) * 1000;
        this.bgmTimeout = setTimeout(() => this.playThemeOverworld(), delay);
    }

    // Melodia Longa do Subterrâneo (Nível 2)
    playThemeUnderworld() {
        if (!this.isPlayingBGM) return;

        const notes = [
            { f: 261.63, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 220.00, d: 0.15 }, { f: 440.00, d: 0.15 },
            { f: 233.08, d: 0.15 }, { f: 466.16, d: 0.15 }, { f: 0, d: 0.3 },
            { f: 196.00, d: 0.15 }, { f: 392.00, d: 0.15 }, { f: 174.61, d: 0.15 }, { f: 349.23, d: 0.15 },
            { f: 185.00, d: 0.15 }, { f: 369.99, d: 0.15 }, { f: 0, d: 0.3 },

            { f: 261.63, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 220.00, d: 0.15 }, { f: 440.00, d: 0.15 },
            { f: 233.08, d: 0.15 }, { f: 466.16, d: 0.15 }, { f: 0, d: 0.3 },
            { f: 196.00, d: 0.15 }, { f: 392.00, d: 0.15 }, { f: 174.61, d: 0.15 }, { f: 349.23, d: 0.15 },
            { f: 185.00, d: 0.15 }, { f: 369.99, d: 0.15 }, { f: 0, d: 0.5 }
        ];

        const note = notes[this.noteIndex];
        if (note && note.f > 0) {
            this.playNote(note.f, note.d, 'triangle', 0.15);
        }

        this.noteIndex = (this.noteIndex + 1) % notes.length;
        const delay = (note ? note.d : 0.2) * 1000;
        this.bgmTimeout = setTimeout(() => this.playThemeUnderworld(), delay);
    }

    startBGM(level = 1) {
        this.init();
        this.stopBGM();
        this.isPlayingBGM = true;
        this.currentLevel = level;
        this.noteIndex = 0;

        if (level === 2) {
            this.playThemeUnderworld();
        } else {
            this.playThemeOverworld();
        }
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
    }

    // --- EFEITOS SONOROS ---

    playJump() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playCoin() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playStomp() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    playPowerUp() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.1);
        osc.frequency.linearRampToValueAtTime(900, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    playDie() {
        this.stopBGM();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
    }

    playFlag() {
        this.stopBGM();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(660, now + 0.1);
        osc.frequency.setValueAtTime(780, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    }

    playBreak() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }
}