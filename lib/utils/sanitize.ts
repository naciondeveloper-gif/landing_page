export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Returns null if the email contains CRLF injection or is malformed. */
export function sanitizeEmail(email: string): string | null {
  const trimmed = email.trim();
  if (/[\r\n]/.test(trimmed)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return null;
  return trimmed;
}
