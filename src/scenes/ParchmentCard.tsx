import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { InvitationData } from '../types/invitation';
import { audioEngine } from '../audio/audioEngine';
import { useTelegram } from '../hooks/useTelegram';
import { persistGuestRsvp } from '../data/invitations';
import { ShieldCheck, Share2, Sparkles, XCircle, CheckCircle2 } from 'lucide-react';

interface ParchmentCardProps {
  invitation: InvitationData;
  isRevealed: boolean;
}

export const ParchmentCard: React.FC<ParchmentCardProps> = ({ invitation, isRevealed }) => {
  const [rsvpState, setRsvpState] = useState<'pending' | 'accepted' | 'declined'>(invitation.rsvpStatus || 'pending');
  const [revealedSteps, setRevealedSteps] = useState<number>(0);
  const { triggerNotificationHaptic, triggerHaptic } = useTelegram();

  useEffect(() => {
    if (!isRevealed) {
      setRevealedSteps(0);
      return;
    }

    const timers = [
      setTimeout(() => setRevealedSteps(1), 300),   // Guest greeting
      setTimeout(() => setRevealedSteps(2), 800),   // Huge "31 ЖОВТНЯ"
      setTimeout(() => setRevealedSteps(3), 1400),  // Time & Venue
      setTimeout(() => setRevealedSteps(4), 2000),  // NFT Soulbound Badge
      setTimeout(() => setRevealedSteps(5), 2600),  // RSVP Buttons
    ];

    return () => timers.forEach(clearTimeout);
  }, [isRevealed]);

  const handleAccept = () => {
    setRsvpState('accepted');
    persistGuestRsvp(invitation.tokenId, 'accepted');
    audioEngine.playAcceptChime();
    triggerNotificationHaptic('success');

    confetti({
      particleCount: 85,
      spread: 75,
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
    <div className={`unfurling-parchment-scroll ${isRevealed ? 'scroll-unfurled' : 'scroll-rolled'} rsvp-${rsvpState}`}>
      {/* Top Wooden / Rolled Scroll Spindle */}
      <div className="scroll-spindle spindle-top">
        <div className="spindle-knob knob-left" />
        <div className="spindle-rod" />
        <div className="spindle-knob knob-right" />
      </div>

      {/* Main Parchment Paper Body */}
      <div className="parchment-scroll-canvas">
        {/* Scorched burned edge shadows and paper texture */}
        <div className="parchment-scorched-trim" />
        <div className="parchment-grain-layer" />

        {/* Scroll Header */}
        <div className={`cinematic-reveal step-1 ${revealedSteps >= 1 ? 'visible' : ''}`}>
          <div className="scroll-occult-seal">✦ 𝕳 ✦</div>
          <div className="burton-card-kicker">ЗАПРОШЕННЯ ВІД ДЖЕКА & САЛЛІ:</div>
          <h1 className="burton-card-guest">
            {invitation.guestName.toUpperCase()}
          </h1>
          <div className="burton-card-subline">ТЕБЕ ЧЕКАЄ СПРАВЖНІЙ КОШМАР!</div>
        </div>

        {/* Tim Burton Giant Date Display (like Photo 2) */}
        <div className={`cinematic-reveal step-2 ${revealedSteps >= 2 ? 'visible' : ''}`}>
          <div className="burton-date-block">
            <div className="burton-date-day">СУБОТА • ЖОВТЕНЬ</div>
            <div className="burton-date-giant-number">31</div>
            <div className="burton-date-time">20:00 — 04:00</div>
          </div>
        </div>

        {/* Venue & Coordinates */}
        <div className={`cinematic-reveal step-3 ${revealedSteps >= 3 ? 'visible' : ''}`}>
          <div className="burton-venue-block">
            <div className="venue-title">EVENT HALL / ОБСИДІАНОВИЙ СКЛЕП</div>
            <div className="venue-address">{invitation.location}</div>
            {invitation.venueSecret && (
              <div className="venue-secret">({invitation.venueSecret})</div>
            )}
          </div>
        </div>

        {/* Soulbound NFT Badge */}
        <div className={`cinematic-reveal step-4 ${revealedSteps >= 4 ? 'visible' : ''}`}>
          <div className="burton-nft-badge">
            <ShieldCheck size={18} className="badge-shield-icon" />
            <div className="badge-details">
              <div className="badge-row">
                <span className="badge-token-label">SOULBOUND NFT: {invitation.tokenId}</span>
                <span className="badge-verified-pill">ВЕРЕФІКОВАНО</span>
              </div>
              <span className="badge-edition-text">
                {invitation.edition || 'Індивідуальний пропуск'}
                {invitation.openedAt ? ` • Активовано: ${invitation.openedAt}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive RSVP Buttons & Final Resolutions */}
        <div className={`cinematic-reveal step-5 ${revealedSteps >= 5 ? 'visible' : ''}`}>
          {rsvpState === 'pending' && (
            <div className="burton-actions-bar">
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

          {/* Accepted Resolution */}
          {rsvpState === 'accepted' && (
            <div className="burton-resolution burton-accepted">
              <div className="jack-confirm-icon">
                <CheckCircle2 size={30} />
                <span>ЗАКРІПЛЕНО</span>
              </div>
              <h3 className="res-title">Твою присутність підтверджено!</h3>
              <p className="res-p">
                Джек і Саллі готують твій куточок у місті Хелловіна. До зустрічі опівночі!
              </p>
              <button type="button" className="btn-burton-share" onClick={handleShare}>
                <Share2 size={16} />
                <span>Поділитися пропуском</span>
              </button>
            </div>
          )}

          {/* Declined Resolution */}
          {rsvpState === 'declined' && (
            <div className="burton-resolution burton-declined">
              <div className="oogie-symbol">☠</div>
              <h3 className="res-title">Ми пам'ятатимемо про твою відсутність...</h3>
              <p className="res-p">
                Тіні заберуть твоє місце на святі. Але свято відбудеться у будь-якому разі!
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

      {/* Bottom Wooden / Rolled Scroll Spindle */}
      <div className="scroll-spindle spindle-bottom">
        <div className="spindle-knob knob-left" />
        <div className="spindle-rod" />
        <div className="spindle-knob knob-right" />
      </div>
    </div>
  );
};
