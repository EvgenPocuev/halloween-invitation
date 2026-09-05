import { useState, useMemo, useEffect } from 'react';
import { EnvelopeScene } from './scenes/EnvelopeScene';
import { ParchmentScene } from './scenes/ParchmentScene';
import { GothicNightSky } from './components/GothicNightSky';
import { AtmosphericCanvas } from './components/AtmosphericCanvas';
import { AudioToggle } from './components/AudioToggle';
import { audioEngine } from './audio/audioEngine';
import { useTelegram } from './hooks/useTelegram';
import { getTrackedInvitation } from './data/invitations';
import './styles/main.css';

export function App() {
  const { tgUser, startParam } = useTelegram();
  const [currentScene, setCurrentScene] = useState<'envelope' | 'parchment'>('envelope');
  const [transitionFlash, setTransitionFlash] = useState(false);

  // Trigger song playback immediately upon load or on first user touch
  useEffect(() => {
    audioEngine.playMusicNow();
  }, []);

  const handleSceneTransition = () => {
    setTransitionFlash(true);
    setTimeout(() => {
      setCurrentScene('parchment');
      // Fade out flash smoothly to reveal the ancient scroll
      setTimeout(() => {
        setTransitionFlash(false);
      }, 500);
    }, 150);
  };

  // Extract invitation ID from URL path (/invite/001), query param (?id=001), or Telegram start_param
  const invitationId = useMemo(() => {
    if (startParam) {
      const match = startParam.match(/(?:invite_)?([a-zA-Z0-9_-]+)/);
      if (match) return match[1];
    }

    const pathname = window.location.pathname;
    const pathMatch = pathname.match(/\/(?:invite\/)?([0-9a-zA-Z_-]+)$/);
    if (pathMatch && pathMatch[1] && pathMatch[1] !== 'index.html' && pathMatch[1] !== '') {
      return pathMatch[1];
    }

    const searchParams = new URLSearchParams(window.location.search);
    const idParam = searchParams.get('id') || searchParams.get('invite');
    if (idParam) return idParam;

    if (window.location.hash) {
      return window.location.hash.replace(/^#\/?/, '');
    }

    return '001';
  }, [startParam]);

  // Resolve invitation data with tracked NFT number, Telegram user name and Ukrainian copywriting
  const invitation = useMemo(() => {
    return getTrackedInvitation(invitationId, tgUser || undefined);
  }, [invitationId, tgUser]);

  return (
    <main className="app-container">
      {/* Seamless cinematic flash transition overlay */}
      <div className={`global-scene-flash ${transitionFlash ? 'active' : ''}`} />

      {/* 1. Giant Harvest Moon, Bat Silhouette & Spiral Hill Backdrop */}
      <GothicNightSky />

      {/* 2. Atmospheric Embers & Mist */}
      <AtmosphericCanvas intensity={currentScene === 'envelope' ? 0.9 : 0.6} />

      {/* 3. Top HUD Bar */}
      <header className="hud-top-bar">
        <div className="hud-event-badge">
          <span className="badge-dot" />
          <span className="badge-label">ХЕЛЛОВІН MMXXVI</span>
        </div>
        <AudioToggle />
      </header>

      {/* 4. Interactive Scene Flow with Cinematic Flash Transition */}
      <section className="scene-stage">
        {currentScene === 'envelope' && (
          <EnvelopeScene
            guestPreviewName={invitation.guestName}
            onTransitionComplete={handleSceneTransition}
          />
        )}

        {currentScene === 'parchment' && (
          <ParchmentScene invitation={invitation} />
        )}
      </section>

      {/* 5. Testing & Guest NFT Switcher */}
      <footer className="dev-footer">
        <div className="dev-id-chips">
          <span className="chip-label">ПРОПУСК:</span>
          {['001', '002', '003'].map((id) => (
            <button
              key={id}
              type="button"
              className={`chip-btn ${invitationId === id ? 'active' : ''}`}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('id', id);
                window.history.pushState({}, '', url.toString());
                window.location.reload();
              }}
            >
              #{id}
            </button>
          ))}
        </div>

        {currentScene === 'parchment' ? (
          <button
            type="button"
            className="replay-btn"
            onClick={() => setCurrentScene('envelope')}
          >
            ↺ Запечатати конверт
          </button>
        ) : (
          <div className="token-id-tag">
            {invitation.tokenId}
          </div>
        )}
      </footer>
    </main>
  );
}

export default App;
