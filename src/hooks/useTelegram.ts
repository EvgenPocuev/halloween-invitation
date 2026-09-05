import { useEffect, useState } from 'react';
import type { TelegramUser } from '../types/invitation';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation?: () => void;
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
  initDataUnsafe?: {
    user?: TelegramUser;
    query_id?: string;
    start_param?: string;
  };
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [startParam, setStartParam] = useState<string | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#070208');
        tg.setBackgroundColor('#070208');
        if (tg.enableClosingConfirmation) {
          tg.enableClosingConfirmation();
        }

        if (tg.initDataUnsafe?.user) {
          setTgUser(tg.initDataUnsafe.user);
          setIsTelegram(true);
        } else {
          // Check if passed via URL parameters (useful for direct testing)
          const params = new URLSearchParams(window.location.search);
          const nameParam = params.get('name');
          if (nameParam) {
            setTgUser({ first_name: nameParam });
          }
        }

        if (tg.initDataUnsafe?.start_param) {
          setStartParam(tg.initDataUnsafe.start_param);
        }
      } catch (e) {
        console.warn('Telegram WebApp init warning:', e);
      }
    }
  }, []);

  const triggerHaptic = (style: 'heavy' | 'medium' | 'light' = 'heavy') => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
    } catch {
      // Fallback: browser navigator.vibrate if available
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(style === 'heavy' ? [40, 20, 60] : 30);
      }
    }
  };

  const triggerNotificationHaptic = (type: 'success' | 'error' | 'warning') => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(type === 'success' ? [30, 40, 30] : [80, 50, 80]);
      }
    }
  };

  return {
    tgUser,
    isTelegram,
    startParam,
    triggerHaptic,
    triggerNotificationHaptic
  };
}
