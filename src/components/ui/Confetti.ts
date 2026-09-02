import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7, x: 0.2 },
      colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24', '#a855f7'],
    });

    // Right burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7, x: 0.8 },
      colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24', '#a855f7'],
    });
  } catch (e) {
    console.log('Confetti triggered', e);
  }
}
