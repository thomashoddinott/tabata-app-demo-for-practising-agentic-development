import { useState } from 'react';
import { Home } from './components/Home/Home';
import { Timer } from './components/Timer/Timer';

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  if (hasStarted) {
    return <Timer />;
  }

  return <Home onStart={() => setHasStarted(true)} />;
}

export default App;
