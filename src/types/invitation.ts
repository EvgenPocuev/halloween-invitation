export interface InvitationData {
  invitationId: string;
  guestName: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  location: string;
  venueSecret?: string;
  tokenId: string;
  nftNumber: number;
  edition?: string;
  dressCode?: string;
  customLore?: string;
  rsvpStatus?: 'pending' | 'accepted' | 'declined';
  openedAt?: string;
  isRegistered?: boolean;
}

export interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}
