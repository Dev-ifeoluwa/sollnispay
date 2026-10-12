/** Selling price = Sabuss cost + margin %, rounded UP to a whole naira. */
export function sellingPrice(costPrice: number): number {
  const margin = Number(process.env.DATA_MARGIN_PERCENT ?? 5);
  const raw = Math.round(costPrice * (100 + margin)) / 100;
  return Math.ceil(raw);
}

/** "MTN SME 1GB - 7 Days" -> { network: 'MTN', validity: '7 Days' }. Null for networks we don't support yet (Smile, Freedom). */
export function parsePlan(name: string): { network: string; validity: string | null } | null {
  const n = name.trim();
  const upper = n.toUpperCase();
  let network: string | null = null;
  if (upper.startsWith('MTN')) network = 'MTN';
  else if (upper.startsWith('AIRTEL')) network = 'AIRTEL';
  else if (upper.startsWith('GLO')) network = 'GLO';
  else if (upper.startsWith('9MOBILE')) network = '9MOBILE';
  if (!network) return null;

  const m = n.match(/-\s*([^-]+)$/);
  return { network, validity: m ? m[1].trim() : null };
}