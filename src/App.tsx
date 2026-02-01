import { useState } from 'react';
import { Home } from './components/Home/Home';
import { Timer } from './components/Timer/Timer';
import { useAudio } from './hooks/useAudio';
import { TABATA_CONFIG, DEBUG_CONFIG } from './constants/tabata';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const { initAudio, playBeep } = useAudio();

  const config = isDebugMode ? DEBUG_CONFIG : TABATA_CONFIG;

  const handleStart = () => {
    // Initialize audio context on user interaction (required for iOS)
    initAudio();
    setIsDebugMode(false);
    setHasStarted(true);
  };

  const handleStartDebug = () => {
    // Initialize audio context on user interaction (required for iOS)
    initAudio();
    setIsDebugMode(true);
    setHasStarted(true);
  };

  if (hasStarted) {
    return <Timer playBeep={playBeep} config={config} isDebugMode={isDebugMode} />;
  }

  return (
    <Home
      onStart={handleStart}
      onStartDebug={handleStartDebug}
    />
  );
}

export default App;
