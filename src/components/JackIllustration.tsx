import React from 'react';

interface JackIllustrationProps {
  className?: string;
  pose?: 'full' | 'portrait';
}

export const JackIllustration: React.FC<JackIllustrationProps> = ({ className, pose = 'full' }) => {
  const imageSrc = pose === 'portrait' 
    ? '/assets/images/jack_portrait.png' 
    : '/assets/images/jack_transparent.png';

  return (
    <div className={`jack-fullbody-wrapper ${className || ''}`}>
      <div className="jack-glow-aura" />
      <img
        src={imageSrc}
        alt="Jack Skellington - The Pumpkin King"
        className="jack-fullbody-img"
        loading="eager"
        decoding="async"
        onError={(e) => {
          // Fallback to original image if transparent png fails
          const target = e.currentTarget;
          if (target.src.indexOf('jack_transparent.png') !== -1) {
            target.src = '/assets/images/jack_skellington.png';
          }
        }}
      />
    </div>
  );
};
