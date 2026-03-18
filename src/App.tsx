import Board from "./Board/Board";
import { useState, useEffect, useRef } from "react";
import { ICON_PACKS } from "./helpers/constants";
import { LANGUAGES, t } from "./helpers/i18n";
import { IconPackKey, LangKey, GameMode } from "./types";
import './App.css';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMuted, setIsMuted] = useState(false);
  const [iconPack, setIconPack] = useState<IconPackKey>('berries');
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [lang, setLang] = useState<LangKey>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowIconMenu(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const topControls = (
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
            {(Object.entries(ICON_PACKS) as [IconPackKey, typeof ICON_PACKS[IconPackKey]][]).map(([key, pack]) => (
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
      <div className="icon-picker" ref={langRef}>
        <button className="control-btn" onClick={() => setShowLangMenu(!showLangMenu)}>
          {LANGUAGES[lang].flag}
        </button>
        {showLangMenu && (
          <div className="icon-menu">
            {(Object.entries(LANGUAGES) as [LangKey, typeof LANGUAGES[LangKey]][]).map(([key, cfg]) => (
              <button
                key={key}
                className={`icon-option${lang === key ? ' active' : ''}`}
                onClick={() => { setLang(key); setShowLangMenu(false); }}
              >
                {cfg.flag}
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="control-btn" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );

  if (!gameMode) {
    return (
      <div className="App">
        {topControls}
        <div className="mode-select">
          <div className="board-title">{t(lang, 'title')}</div>
          <div className="mode-subtitle">{t(lang, 'chooseMode')}</div>
          <div className="mode-buttons">
            <button className="mode-btn" onClick={() => setGameMode('lite')}>
              <span className="mode-icon">✨</span>
              <span className="mode-name">{t(lang, 'lite')}</span>
              <span className="mode-desc">{t(lang, 'liteDesc')}</span>
            </button>
            <button className="mode-btn" onClick={() => setGameMode('timed')}>
              <span className="mode-icon">⏱️</span>
              <span className="mode-name">{t(lang, 'timed')}</span>
              <span className="mode-desc">{t(lang, 'timedDesc')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {topControls}
      <Board
        isMuted={isMuted}
        iconPack={iconPack}
        gameMode={gameMode}
        lang={lang}
        onExit={() => setGameMode(null)}
      />
    </div>
  );
}

export default App;
