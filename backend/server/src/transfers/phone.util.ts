/**
 * Turns any common way of writing a Nigerian mobile number into ONE form:
 *   08012345678, 8012345678, 2348012345678, +234 801 234 5678  ->  08012345678
 * Returns null if it isn't a valid Nigerian mobile number.
 */
export function normalizeNgPhone(input: string): string | null {
  const digits = (input ?? '').replace(/[^\d]/g, '');

  let local: string;
  if (digits.startsWith('234') && digits.length === 13) local = '0' + digits.slice(3);
  else if (digits.length === 11 && digits.startsWith('0')) local = digits;
  else if (digits.length === 10) local = '0' + digits;
  else return null;

  // 070x, 071x, 080x, 081x, 090x, 091x
  return /^0[789][01]\d{8}$/.test(local) ? local : null;
}

/** The forms a number might already be stored in, so lookups still work for older sign-ups. */
export function phoneVariants(local: string): string[] {
  const rest = local.slice(1);
  return [local, `234${rest}`, `+234${rest}`];
}