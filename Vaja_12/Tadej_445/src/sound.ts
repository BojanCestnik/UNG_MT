let audioContext: AudioContext | null = null;
let beepTimer: number | null = null;

// Call this from a click handler: browsers block audio before the user interacts.
export function unlockAudio(): void {
  if (audioContext === null) audioContext = new AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume();
}

function playBeep(): void {
  if (audioContext === null) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const start = audioContext.currentTime;

  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
  gain.gain.linearRampToValueAtTime(0, start + 0.25);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.3);
}

export function startBeeping(): void {
  stopBeeping();
  playBeep();
  beepTimer = window.setInterval(playBeep, 900);
}

export function stopBeeping(): void {
  if (beepTimer !== null) {
    window.clearInterval(beepTimer);
    beepTimer = null;
  }
}
