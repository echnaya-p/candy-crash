import Board from "./Board/Board";
import {useState, useEffect} from "react";
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="App">
      <div className="top-controls">
        <button className="control-btn" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? '🔇' : '🔊'}
        </button>
        <button className="control-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <Board isMuted={isMuted}/>
    </div>
  );
}

export default App;
