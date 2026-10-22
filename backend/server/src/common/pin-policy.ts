import { BadRequestException } from '@nestjs/common';

/** Rejects the PINs people (and attackers) try first. Expects a 4-digit string. */
export function assertStrongPin(pin: string): void {
  const digits = (pin ?? '').split('').map(Number);

  const allSame = /^(\d)\1{3}$/.test(pin); // 0000, 1111
  const repeatedPair = /^(\d\d)\1$/.test(pin); // 1212, 0101
  const ascending = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1); // 1234, 0123
  const descending = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1); // 4321, 3210

  if (allSame || repeatedPair || ascending || descending) {
    throw new BadRequestException(
      'That PIN is too easy to guess. Avoid repeated digits (1111), sequences (1234) and patterns (1212).',
    );
  }
}