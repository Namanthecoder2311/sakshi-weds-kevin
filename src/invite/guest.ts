// Personal invitations: the guest's name comes from the link, e.g. ?to=Sharma%20Family

function readGuest(): string {
  if (typeof location === 'undefined') return '';
  const raw = new URLSearchParams(location.search).get('to') ?? '';
  // keep it tidy: plain text only, single spaces, a sensible length
  return raw
    .replace(/[\u0000-\u001f<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}

export const GUEST = readGuest();

/** Build a personal link for one guest. */
export function guestLink(base: string, name: string) {
  const u = new URL(base);
  u.search = '';
  u.hash = '';
  u.searchParams.set('to', name.trim());
  return u.toString();
}
