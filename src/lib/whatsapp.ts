/**
 * Formats any phone number into an international WhatsApp-compatible numeric format.
 * Specifically handles Turkish numbers (+90, 05xx, 5xx, etc.) ensuring country code 90 is always prefixed.
 */
export function formatWhatsAppPhone(rawPhone?: string | null, defaultFallback: string = '905301234567'): string {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return defaultFallback;
  }

  // Strip all non-numeric characters
  let digits = rawPhone.replace(/[^0-9]/g, '');
  if (!digits) {
    return defaultFallback;
  }

  // If starts with 00 (international call prefix e.g. 0090...)
  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }

  // If already full Turkish number: starts with 90 and length is 12 (90 + 10 digits)
  if (digits.startsWith('90') && digits.length === 12) {
    return digits;
  }

  // If starts with 900 (e.g. 900532XXXXXXX)
  if (digits.startsWith('900') && digits.length === 13) {
    return `90${digits.substring(3)}`;
  }

  // If starts with 0 (Turkish local format: 05xx or 02xx or 03xx)
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // If 10 digits (Standard Turkish mobile/landline without 0: 5xx, 2xx, 3xx, 4xx)
  if (digits.length === 10) {
    return `90${digits}`;
  }

  // If starts with 5 and has 9 to 11 digits (Turkish mobile entered with slight typo or variation)
  if (digits.startsWith('5') && digits.length >= 9 && digits.length <= 11) {
    return `90${digits}`;
  }

  // If it doesn't match above, but starts with 90 (e.g. Turkish number with 11 digits)
  if (digits.startsWith('90')) {
    return digits;
  }

  return digits;
}
