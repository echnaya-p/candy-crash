import Board from "./Board/Board";
import {useState, useEffect, useRef} from "react";
import {ICON_PACKS} from "./helpers/constants";
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [isMuted, setIsMuted] = useState(false);
  const [iconPack, setIconPack] = useState('berries');
  const [showIconMenu, setShowIconMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowIconMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="App">
      <div className="top-controls">
        <button className="control-btn" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? '🔇' : '🔊'}
        </button>
        <div className="icon-picker" ref={menuRef}>
          <button className="control-btn" onClick={() => setShowIconMenu(!showIconMenu)}>
            {ICON_PACKS[iconPack].label}
          </button>
          {showIconMenu && (
            <div className="icon-menu">
              {Object.entries(ICON_PACKS).map(([key, pack]) => (
                <button
                  key={key}
                  className={`icon-option${iconPack === key ? ' active' : ''}`}
                  onClick={() => { setIconPack(key); setShowIconMenu(false); }}
                >
                  {pack.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="control-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <Board isMuted={isMuted} iconPack={iconPack}/>
    </div>
  );
}

export default App;
