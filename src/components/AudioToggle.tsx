import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../audio/audioEngine';

export const AudioToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(audioEngine.getIsMuted());

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <button
      type="button"
      className={`audio-toggle-btn ${isMuted ? 'muted' : 'playing'}`}
      onClick={handleToggle}
      aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
    >
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      <span className="audio-toggle-glow" />
    </button>
  );
};
