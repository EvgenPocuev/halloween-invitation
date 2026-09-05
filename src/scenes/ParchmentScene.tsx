import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { InvitationData } from '../types/invitation';
import { audioEngine } from '../audio/audioEngine';
import { useTelegram } from '../hooks/useTelegram';
import { persistGuestRsvp } from '../data/invitations';
import { JackIllustration } from '../components/JackIllustration';
import { ShieldCheck, Share2, Sparkles, XCircle, CheckCircle2, Drama } from 'lucide-react';

interface ParchmentSceneProps {
  invitation: InvitationData;
}

export const ParchmentScene: React.FC<ParchmentSceneProps> = ({ invitation }) => {
  const [rsvpState, setRsvpState] = useState<'pending' | 'accepted' | 'declined'>(invitation.rsvpStatus || 'pending');
  const [revealedSteps, setRevealedSteps] = useState<number>(0);
  const { triggerNotificationHaptic, triggerHaptic } = useTelegram();

  useEffect(() => {
    audioEngine.startMainTheme();

    const timers = [
      setTimeout(() => setRevealedSteps(1), 300),   // Guest Greeting
      setTimeout(() => setRevealedSteps(2), 800),   // Date & 15:00 without limits
      setTimeout(() => setRevealedSteps(3), 1400),  // Costume Party & Venue
      setTimeout(() => setRevealedSteps(4), 2000),  // Soulbound NFT Pass
      setTimeout(() => setRevealedSteps(5), 2600),  // RSVP Action Buttons
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleAccept = () => {
    setRsvpState('accepted');
    persistGuestRsvp(invitation.tokenId, 'accepted');
    audioEngine.playAcceptChime();
    triggerNotificationHaptic('success');

    confetti({
      particleCount: 95,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#38bdf8', '#facc15', '#ffffff', '#18181b', '#ef4444']
    });
  };

  const handleDecline = () => {
    setRsvpState('declined');
    persistGuestRsvp(invitation.tokenId, 'declined');
    audioEngine.playDeclineGong();
    triggerNotificationHaptic('warning');
  };

  const handleShare = () => {
    triggerHaptic('light');
    const shareUrl = window.location.href;
    const shareText = `🎃 Вас запрошено на Ніч Джека Скеллінгтона! Відкрийте ваше персональне запрошення:`;

    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
      );
    } else if (navigator.share) {
      navigator.share({
        title: invitation.title,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Посилання на запрошення скопійовано!');
    }
  };

  return (
    <div className={`parchment-dedicated-scene rsvp-${rsvpState}`}>
      {/* The Magnificent Ancient Unfurling Parchment Scroll */}
      <div className="ancient-scroll-outer">
        {/* Jack Skellington Standing Tall Across the Entire Letter */}
        <div className="jack-host-wrapper">
          <JackIllustration />
        </div>

        {/* Top Wooden / Brass Spindle Roller */}
        <div className="scroll-spindle spindle-top">
          <div className="spindle-knob knob-left" />
          <div className="spindle-rod" />
          <div className="spindle-knob knob-right" />
        </div>

        {/* Scroll Textured Paper Canvas */}
        <div className="scroll-parchment-body">
          {/* Scorched burned border edges and antique paper grain */}
          <div className="scroll-scorched-perimeter" />
          <div className="scroll-parchment-grain" />

          {/* 1. Header & Personalized Guest Greeting */}
          <div className={`cinematic-reveal step-1 ${revealedSteps >= 1 ? 'visible' : ''}`}>
            <div className="scroll-occult-emblem">✦ 𝕳 ✦</div>
            <div className="scroll-kicker">ЗАПРОШЕННЯ ВІД ДЖЕКА СКЕЛЛІНГТОНА & САЛЛІ</div>
            <h1 className="scroll-guest-name">
              {invitation.guestName.toUpperCase()}
            </h1>
            <div className="scroll-nightmare-subtitle">ТЕБЕ ЧЕКАЄ СПРАВЖНІЙ КОШМАР!</div>
          </div>

          {/* 2. Date Block: Huge "31" and "15:00 — БЕЗ ОБМЕЖЕНЬ" */}
          <div className={`cinematic-reveal step-2 ${revealedSteps >= 2 ? 'visible' : ''}`}>
            <div className="scroll-date-container">
              <div className="scroll-date-header">НЕДІЛЯ • ЖОВТЕНЬ</div>
              <div className="scroll-giant-number">31</div>
              <div className="scroll-time-unlimited">
                ПОЧАТОК О 15:00 — БЕЗ ОБМЕЖЕНЬ
              </div>
            </div>
          </div>

          {/* 3. Costume Party Banner & Venue Location */}
          <div className={`cinematic-reveal step-3 ${revealedSteps >= 3 ? 'visible' : ''}`}>
            {/* Costume Party Mandatory Notice */}
            <div className="costume-party-badge">
              <Drama size={22} className="costume-mask-icon" />
              <div className="costume-text-group">
                <span className="costume-title">КОСТЮМОВАНА ВЕЧІРКА</span>
                <span className="costume-desc">Хелловін-образ / маскарадний костюм обов'язкові!</span>
              </div>
            </div>

            <div className="scroll-venue-container">
              <div className="venue-title">EVENT HALL / ОБСИДІАНОВИЙ СКЛЕП</div>
              <div className="venue-address">{invitation.location}</div>
              {invitation.venueSecret && (
                <div className="venue-secret">({invitation.venueSecret})</div>
              )}
            </div>
          </div>

          {/* 4. Lore & Soulbound NFT Tracker Badge */}
          <div className={`cinematic-reveal step-4 ${revealedSteps >= 4 ? 'visible' : ''}`}>
            {invitation.customLore && (
              <blockquote className="scroll-lore-quote">
                "{invitation.customLore}"
              </blockquote>
            )}

            <div className="scroll-nft-badge">
              <ShieldCheck size={18} className="badge-shield-icon" />
              <div className="badge-details">
                <div className="badge-row">
                  <span className="badge-token-label">SOULBOUND NFT: {invitation.tokenId}</span>
                  <span className="badge-verified-pill">ВЕРИФІКОВАНО</span>
                </div>
                <span className="badge-edition-text">
                  {invitation.edition || 'Індивідуальний пропуск'}
                  {invitation.openedAt ? ` • Активовано: ${invitation.openedAt}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Interactive RSVP Controls & Final States */}
          <div className={`cinematic-reveal step-5 ${revealedSteps >= 5 ? 'visible' : ''}`}>
            {rsvpState === 'pending' && (
              <div className="scroll-actions-bar">
                <button
                  type="button"
                  className="btn-burton btn-accept-burton"
                  onClick={handleAccept}
                >
                  <Sparkles size={18} />
                  <span>ПРИЙНЯТИ ЗАПРОШЕННЯ</span>
                </button>

                <button
                  type="button"
                  className="btn-burton btn-decline-burton"
                  onClick={handleDecline}
                >
                  <XCircle size={16} />
                  <span>ВІДХИЛИТИ</span>
                </button>
              </div>
            )}

            {/* ACCEPTED RESOLUTION */}
            {rsvpState === 'accepted' && (
              <div className="scroll-resolution resolution-accepted">
                <div className="jack-confirm-icon">
                  <CheckCircle2 size={32} />
                  <span>ЗАКРІПЛЕНО</span>
                </div>
                <h3 className="res-title">Твою присутність підтверджено!</h3>
                <p className="res-p">
                  Джек і Саллі чекають на тебе о 15:00 у твоєму костюмі. Свято триватиме без обмежень!
                </p>
                <button type="button" className="btn-burton-share" onClick={handleShare}>
                  <Share2 size={16} />
                  <span>Поділитися пропуском</span>
                </button>
              </div>
            )}

            {/* DECLINED RESOLUTION */}
            {rsvpState === 'declined' && (
              <div className="scroll-resolution resolution-declined">
                <div className="oogie-symbol">☠</div>
                <h3 className="res-title">Ми пам'ятатимемо про твою відсутність...</h3>
                <p className="res-p">
                  Тіні заберуть твоє місце на балу. Але свято відбудеться у будь-якому разі!
                </p>
                <button
                  type="button"
                  className="btn-burton-reconsider"
                  onClick={() => {
                    setRsvpState('pending');
                    persistGuestRsvp(invitation.tokenId, 'pending');
                  }}
                >
                  Змінити рішення
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Wooden / Brass Spindle Roller */}
        <div className="scroll-spindle spindle-bottom">
          <div className="spindle-knob knob-left" />
          <div className="spindle-rod" />
          <div className="spindle-knob knob-right" />
        </div>
      </div>
    </div>
  );
};
