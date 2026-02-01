import { useState } from 'react';
import { Home } from './components/Home/Home';
import { Timer } from './components/Timer/Timer';
import { useAudio } from './hooks/useAudio';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const { initAudio, playBeep } = useAudio();

  const handleStart = () => {
    // Initialize audio context on user interaction (required for iOS)
    initAudio();
    setHasStarted(true);
  };

  if (hasStarted) {
    return <Timer playBeep={playBeep} />;
  }

  return <Home onStart={handleStart} />;
}

export default App;
