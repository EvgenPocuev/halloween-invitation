import type { InvitationData } from '../types/invitation';

export const INVITATIONS_DATABASE: Record<string, Omit<InvitationData, 'nftNumber' | 'tokenId'>> = {
  '001': {
    invitationId: '001',
    guestName: 'Євгеній',
    title: 'ХЕЛЛОВІН ДЖЕКА СКЕЛЛІНГТОНА',
    subtitle: 'Костюмована вечірка у Місті Жахів',
    date: '31 Жовтня',
    time: '15:00 — БЕЗ ОБМЕЖЕНЬ',
    location: 'Event Hall / Обсидіановий Склеп',
    venueSecret: 'Координати та пароль будуть надіслані особисто',
    edition: 'Видання зі 100 • Black Velvet Tier',
    dressCode: '🎭 КОСТЮМОВАНА ВЕЧІРКА (Хелловін-образ / Маски обов\'язкові)',
    customLore: 'Джек і Саллі особисто внесли твоє ім\'я до книги гостей. Не забудь свій найжахливіший костюм!',
  },
  '002': {
    invitationId: '002',
    guestName: 'Валерія',
    title: 'БАГРЯНИЙ БАЛ-МАСКАРАД',
    subtitle: 'Костюмована ніч Джека та Саллі',
    date: '31 Жовтня',
    time: '15:00 — БЕЗ ОБМЕЖЕНЬ',
    location: 'Event Hall / Катакомби Святого Юди',
    venueSecret: 'Постукайте тричі у залізну браму',
    edition: 'Видання зі 100 • Blood Gold Tier',
    dressCode: '🎭 КОСТЮМОВАНА ВЕЧІРКА (Хелловін-образ / Маски обов\'язкові)',
    customLore: 'Усі жителі міста Хелловін зберуться о 15:00. Твоє місце чекає біля трону Гарбузового Короля.',
  },
  '003': {
    invitationId: '003',
    guestName: 'Олександр',
    title: 'НІЧ ПРОБУДЖЕНИХ СТРАХІВ',
    subtitle: 'Костюмоване свято темряви',
    date: '31 Жовтня',
    time: '15:00 — БЕЗ ОБМЕЖЕНЬ',
    location: 'Event Hall / Sanctum Sanctorum',
    venueSecret: 'Слідуйте за ліхтарями гарбузів уздовж темної алеї',
    edition: 'Видання зі 100 • Midnight Silver Tier',
    dressCode: '🎭 КОСТЮМОВАНА ВЕЧІРКА (Хелловін-образ / Маски обов\'язкові)',
    customLore: 'Свято триватиме без обмежень у часі до останнього гостя!',
  }
};

/**
 * NFT Registry Tracker:
 * Automatically tracks, assigns, and persists unique NFT token numbers for every guest.
 */
export function getTrackedInvitation(
  id: string | null,
  telegramUser?: { id?: number; first_name?: string; last_name?: string; username?: string }
): InvitationData {
  const cleanId = (id || '001').replace(/^#/, '').trim();
  const base = INVITATIONS_DATABASE[cleanId] || {
    invitationId: cleanId,
    guestName: `Гість #${cleanId}`,
    title: 'ХЕЛЛОВІН ДЖЕКА СКЕЛЛІНГТОНА',
    subtitle: 'Костюмована вечірка у Місті Жахів',
    date: '31 Жовтня',
    time: '15:00 — БЕЗ ОБМЕЖЕНЬ',
    location: 'Event Hall / Обсидіановий Склеп',
    venueSecret: 'Таємна локація надійде після підтвердження',
    edition: 'Ексклюзивний пропуск Telegram Mini App',
    dressCode: '🎭 КОСТЮМОВАНА ВЕЧІРКА (Хелловін-образ / Маски обов\'язкові)',
    customLore: 'Свято розпочинається о 15:00 і триватиме без обмежень до ранку!',
  };

  const telegramDisplayName = telegramUser?.first_name
    ? [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ')
    : (telegramUser?.username ? `@${telegramUser.username}` : null);

  const guestName = telegramDisplayName || base.guestName;

  let nftNumber = parseInt(cleanId, 10);
  if (isNaN(nftNumber) || nftNumber <= 0) {
    if (telegramUser?.id) {
      nftNumber = (telegramUser.id % 999) + 1;
    } else {
      nftNumber = 13;
    }
  }

  const paddedNumber = String(nftNumber).padStart(3, '0');
  const tokenId = `SOUL-№${paddedNumber}`;

  let persistedRsvp: 'pending' | 'accepted' | 'declined' = 'pending';
  let openedAt = new Date().toLocaleDateString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storageKey = `nft_guest_${tokenId}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        persistedRsvp = parsed.rsvpStatus || 'pending';
        openedAt = parsed.openedAt || openedAt;
      } else {
        localStorage.setItem(storageKey, JSON.stringify({
          tokenId,
          nftNumber,
          openedAt,
          rsvpStatus: 'pending',
          guestName
        }));
      }
    } catch {
      // Ignore
    }
  }

  return {
    ...base,
    guestName,
    nftNumber,
    tokenId,
    openedAt,
    rsvpStatus: persistedRsvp,
    isRegistered: true
  };
}

export function persistGuestRsvp(tokenId: string, rsvpStatus: 'accepted' | 'declined' | 'pending') {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storageKey = `nft_guest_${tokenId}`;
      const saved = localStorage.getItem(storageKey);
      const data = saved ? JSON.parse(saved) : {};
      data.rsvpStatus = rsvpStatus;
      data.updatedAt = new Date().toISOString();
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // Ignore
    }
  }
}
