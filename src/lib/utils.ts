/**
 * Normalizes a license plate number for database storage and lookup.
 * Removes spaces, dashes, and converts to uppercase.
 * Example: "01 A 777 AA" -> "01A777AA"
 */
export function normalizePlate(plate: string): string {
  return plate.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Formats a normalized plate for display.
 * (Generalized logic, can be customized by country in the future)
 */
export function formatPlateDisplay(plate: string, country: string = 'UZ'): string {
  const normalized = normalizePlate(plate);
  
  if (country === 'UZ') {
    // Basic UZ format: 01A777AA -> 01 | A 777 AA
    if (normalized.length === 8) {
      return `${normalized.slice(0, 2)} | ${normalized.slice(2, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
    }
  }

  if (country === 'RU') {
    // Basic RU format: A123AA77 -> A 123 AA | 77
    if (normalized.length >= 8) {
      return `${normalized.slice(0, 1)} ${normalized.slice(1, 4)} ${normalized.slice(4, 6)} | ${normalized.slice(6)}`;
    }
  }

  if (country === 'KZ') {
    // Basic KZ format: 123ABC01 -> 123 | ABC | 01
    if (normalized.length >= 7) {
      return `${normalized.slice(0, 3)} | ${normalized.slice(3, 6)} | ${normalized.slice(6)}`;
    }
  }
  
  // Default fallback: Just space it out every 2-3 chars for readability
  return normalized.replace(/(.{2,3})(?=.)/g, '$1 ');
}

