import { BadRequestException } from '@nestjs/common';

// Small blocklist of the most common bases. Case, digits and symbols are stripped
// before comparing, so "Password1!" and "P@ssword123" both match "password".
const COMMON_BASES = new Set([
  'password',
  'passw',
  'qwerty',
  'qwertyuiop',
  'asdfghjkl',
  'iloveyou',
  'admin',
  'welcome',
  'letmein',
  'abcdefgh',
  'sollnis',
  'sollnispay',
  'shalompay',
  'nigeria',
  'naija',
]);

/** Rules that need nothing but the password itself. */
export function getPasswordIssues(password: string): string[] {
  const p = password ?? '';
  const issues: string[] = [];

  if (p.length < 8) issues.push('at least 8 characters');
  // bcrypt silently ignores everything after 72 bytes, so cap it
  if (Buffer.byteLength(p) > 72) issues.push('no more than 72 characters');
  if (!/[a-z]/.test(p)) issues.push('a lowercase letter');
  if (!/[A-Z]/.test(p)) issues.push('an uppercase letter');
  if (!/\d/.test(p)) issues.push('a number');
  if (!/[^A-Za-z0-9]/.test(p)) issues.push('a special character (like ! @ # $)');
  if (/(.)\1{3,}/.test(p)) issues.push('no character repeated 4 or more times in a row');

  const base = p.toLowerCase().replace(/[^a-z]/g, '');
  if (COMMON_BASES.has(base)) issues.push('nothing too common (like "password")');

  return issues;
}

export function assertStrongPassword(password: string): void {
  const issues = getPasswordIssues(password);
  if (issues.length) {
    throw new BadRequestException(`Password is too weak. It needs: ${issues.join(', ')}.`);
  }
}

/** Rejects passwords that contain the user's own email name or first/last name. */
export function assertNoPersonalInfo(
  password: string,
  user: { email: string; firstName?: string; lastName?: string },
): void {
  const lower = (password ?? '').toLowerCase();
  const parts = [user.email?.split('@')[0], user.firstName, user.lastName]
    .map((s) => (s ?? '').toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter((s) => s.length >= 3);

  if (parts.some((part) => lower.includes(part))) {
    throw new BadRequestException('Password must not contain your name or email.');
  }
}