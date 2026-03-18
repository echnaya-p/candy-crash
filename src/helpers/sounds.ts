declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext!)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

export function playClick(): void {
    playTone(600, 0.08, 'sine', 0.2);
}

export function playCombo(): void {
    playTone(523, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.25), 80);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.3), 160);
}

export function playError(): void {
    playTone(200, 0.15, 'square', 0.15);
    setTimeout(() => playTone(150, 0.2, 'square', 0.12), 120);
}
