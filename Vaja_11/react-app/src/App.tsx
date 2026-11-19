
import { useEffect, useRef, useState } from 'react';
import './App.css';

type TimerMode = 'focus' | 'break';

function App() {
    const [petName, setPetName] = useState(
    () => localStorage.getItem('petName') || 'Mochi'
  );
    useEffect(() => {
    localStorage.setItem('petName', petName);
  }, [petName]);
  const [selectedTime, setSelectedTime] = useState(() => {
  const saved = localStorage.getItem('selectedTime');
  return saved !== null ? Number(saved) : 30;
});

useEffect(() => {
  localStorage.setItem('selectedTime', String(selectedTime));
}, [selectedTime]);
  const [timeLeft, setTimeLeft] = useState(() => {
  const saved = localStorage.getItem('selectedTime');
  const minutes = saved !== null ? Number(saved) : 30;
  return minutes * 60;
});
  const [breakDuration, setBreakDuration] = useState(
  () => {
    const saved = localStorage.getItem('breakDuration');
    return saved !== null ? Number(saved) : 5;
  }
);
    useEffect(() => {
    localStorage.setItem('breakDuration', String(breakDuration));
  }, [breakDuration]);
    const [coins, setCoins] = useState(
    () => Number(localStorage.getItem('coins')) || 0
  );
    useEffect(() => {
    localStorage.setItem('coins', String(coins));
  }, [coins]);
      const [happiness, setHappiness] = useState(
    () => {
      const saved = localStorage.getItem('happiness');
      return saved !== null ? Number(saved) : 80;
    }
  );
  useEffect(() => {
    localStorage.setItem('happiness', String(happiness));
  }, [happiness]);
    const [health, setHealth] = useState(
    () => {
      const saved = localStorage.getItem('health');
      return saved !== null ? Number(saved) : 100;
    }
  );

  useEffect(() => {
    localStorage.setItem('health', String(health));
  }, [health]);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [message, setMessage] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const rewards: Record<number, number> = {
    30: 5,
    45: 7,
    60: 10,
  };

  const breaks: Record<number, number> = {
    30: 5,
    45: 10,
    60: 15,
  };

  const playBell = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(
      880,
      audioContext.currentTime
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      660,
      audioContext.currentTime + 0.5
    );

    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.6
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.6);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || timeLeft !== 0) return;

    playBell();

    if (mode === 'focus') {
      const reward = rewards[selectedTime] ?? Math.max(1, Math.round(selectedTime / 6));

      setCoins((previous) => previous + reward);
      setHappiness((previous) => Math.min(previous + 10, 100));
      setHealth((previous) => Math.min(previous + 5, 100));
      setMessage(`Amazing! ${petName} earned ${reward} coins! 🐶`);

      setMode('break');
      setTimeLeft(
  breakDuration * 60
);
    } else {
      setIsRunning(false);
      setMode('focus');
      setTimeLeft(selectedTime * 60);
      setMessage('Break completed! Ready for another focus session? 💗');
    }
  }, [timeLeft, isRunning, mode, selectedTime, petName]);

  const startTimer = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    void audioContextRef.current.resume();

    if (timeLeft === 0) {
      setTimeLeft(
  mode === 'focus'
    ? selectedTime * 60
    : breakDuration * 60
);
    }

    setMessage('');
    setIsRunning(true);
  };

  const giveUp = () => {
    if (mode !== 'focus') return;

    setIsRunning(false);
    setTimeLeft(selectedTime * 60);
    setHappiness((previous) => Math.max(previous - 15, 0));
    setHealth((previous) => Math.max(previous - 5, 0));
    setMessage('Oh no! Your little friend is sad. No coins this time. 💗');
  };

  const chooseTime = (time: number) => {
    if (isRunning || mode === 'break') return;

    setSelectedTime(time);
    setBreakDuration(breaks[time]);
    setTimeLeft(time * 60);
    setMessage('');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <main className="app">
      <header className="header">
        <div className="logo">♡ little paws</div>
        <button
  className="settings-button"
  onClick={() => setSettingsOpen(!settingsOpen)}
>
  ☰
</button>
      </header>
      {settingsOpen && (
        <section className="settings-menu">
          <h3>Settings ⚙️</h3>
          <p>Make your little paws feel at home! 🐾</p>
                    <label htmlFor="custom-time">Focus duration (minutes)</label>
          <input
            id="custom-time"
            type="number"
            min="1"
            max="180"
            value={selectedTime}
            disabled={isRunning}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= 1 && value <= 180) {
                setSelectedTime(value);
                setTimeLeft(value * 60);
              }
            }}
          />
                    <label htmlFor="custom-break">Break duration (minutes)</label>
          <input
            id="custom-break"
            type="number"
            min="1"
            max="60"
            value={breakDuration}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= 1 && value <= 60) {
                setBreakDuration(value);
              }
            }}
          />
          <button onClick={() => setSettingsOpen(false)}>
            Close
          </button>
        </section>
      )}
      <section className="welcome">
        <p className="subtitle">A little focus, a little love</p>
        <h1>Time to focus!</h1>
        <p>Take a deep breath and let's get things done.</p>
      </section>

      <section className={`timer-card ${mode === 'break' ? 'break-card' : ''}`}>
        <div className={`mode-label ${mode === 'break' ? 'break-label' : ''}`}>
          {mode === 'focus' ? 'FOCUS TIME' : 'BREAK TIME'}
        </div>

        <div className="timer">
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </div>

        {mode === 'focus' ? (
          <div className="presets">
            {[30, 45, 60].map((time) => (
              <button
                key={time}
                className={selectedTime === time ? 'preset active' : 'preset'}
                onClick={() => chooseTime(time)}
                disabled={isRunning}
              >
                {time} min
              </button>
            ))}
          </div>
        ) : (
          <p className="break-info">
            Time to relax and recharge! 🌸
          </p>
        )}

        <button className="start-button" onClick={isRunning ? () => setIsRunning(false) : startTimer}>
          {isRunning
            ? 'Ⅱ Pause'
            : mode === 'break'
              ? '♡ Start break'
              : timeLeft < selectedTime * 60
                ? '♡ Resume'
                : '♡ Start focusing'}
        </button>

        {mode === 'focus' && (
          <button className="give-up-button" onClick={giveUp}>
            Give up
          </button>
        )}

        {message && <p className="message">{message}</p>}
      </section>

      <section className="pet-card">
        <div className="pet-illustration">
           {happiness >= 70 ? '🐶' : happiness >= 35 ? '🐕' : '🥺'}
        </div>
        <h2>Meet your study buddy!</h2>
                <p>
          {happiness >= 70
            ? `${petName} is happy to be with you! 💗`
            : happiness >= 35
              ? `${petName} needs a little love! 🌸`
              : `${petName} is feeling sad. Give her some love! 🥺`}
        </p>

        <label htmlFor="pet-name">Your pet's name</label>
        <input
          id="pet-name"
          value={petName}
          onChange={(event) => setPetName(event.target.value)}
        />

        <div className="coins">🪙 {coins} coins</div>

        <div className="pet-stats">
          <div className="stat">
            <span>Happiness 💗</span>
            <div className="stat-bar">
              <div
                className="stat-fill happiness-fill"
                style={{ width: `${happiness}%` }}
              />
            </div>
            <small>{happiness}/100</small>
          </div>

          <div className="stat">
            <span>Health 🌿</span>
            <div className="stat-bar">
              <div
                className="stat-fill health-fill"
                style={{ width: `${health}%` }}
              />
            </div>
            <small>{health}/100</small>
          </div>
        </div>
      </section>

      <footer>Made with ♡ for your little goals</footer>
    </main>
  );
}

export default App;
