const MINUS = '−';

function assertFinite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number, received ${String(value)}`);
  }
}

function minorDigits(currency) {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
    .maximumFractionDigits;
}

function scaled(abs, digits) {
  // Decimal-exponent shift avoids float error such as 1.005 * 100 = 100.49999...
  const shifted = Math.round(Number(`${abs}e${digits}`));
  return Number.isNaN(shifted) ? Math.round(abs * 10 ** digits) : shifted;
}

function fractionDigits(abs, digits, fraction) {
  const hasMinor = digits > 0 && scaled(abs, digits) % 10 ** digits !== 0;
  const min = fraction === 'always' ? digits : fraction === 'never' ? 0 : hasMinor ? digits : 0;
  const max = fraction === 'never' ? 0 : digits;
  return { min, max };
}

function currencyFormat(locale, currency, currencyDisplay, abs, fraction) {
  const { min, max } = fractionDigits(abs, minorDigits(currency), fraction);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
    signDisplay: 'never',
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
}

/**
 * Split formatted money into parts for readouts that style pieces separately.
 */
export function moneyParts(amount, options = {}) {
  const {
    currency = 'INR',
    locale = 'en-IN',
    fraction = 'auto',
    sign = 'auto',
    currencyDisplay = 'narrowSymbol',
  } = options;
  assertFinite(amount, 'amount');

  const abs = Math.abs(amount);
  const nf = currencyFormat(locale, currency, currencyDisplay, abs, fraction);

  const out = { sign: '', currency: '', integer: '', decimal: '', fraction: '' };
  for (const p of nf.formatToParts(abs)) {
    if (p.type === 'currency') out.currency = p.value;
    else if (p.type === 'integer' || p.type === 'group') out.integer += p.value;
    else if (p.type === 'decimal') out.decimal = p.value;
    else if (p.type === 'fraction') out.fraction = p.value;
  }

  // A value that rounds to zero is never signed.
  const isZero = (out.integer + out.fraction).replace(/[^0-9]/g, '').replace(/0/g, '') === '';
  if (sign !== 'never' && !isZero) {
    if (amount < 0) out.sign = MINUS;
    else if (amount > 0 && sign === 'always') out.sign = '+';
  }
  return out;
}

/**
 * Format money (major units). Sign is always a prefix; negatives use U+2212.
 */
export function formatMoney(amount, options = {}) {
  const {
    currency = 'INR',
    locale = 'en-IN',
    fraction = 'auto',
    currencyDisplay = 'narrowSymbol',
  } = options;
  assertFinite(amount, 'amount');
  const body = currencyFormat(locale, currency, currencyDisplay, Math.abs(amount), fraction).format(
    Math.abs(amount),
  );
  return moneyParts(amount, options).sign + body;
}

const INDIAN_UNITS = [
  [1e7, 'Cr'],
  [1e5, 'L'],
  [1e3, 'k'],
];

function oneDecimal(n) {
  return String(Math.round(n * 10) / 10);
}

function compactIndian(abs) {
  if (Math.round(abs) < 1000) return String(Math.round(abs));
  let idx = INDIAN_UNITS.findIndex(([size]) => abs >= size);
  let text = oneDecimal(abs / INDIAN_UNITS[idx][0]);
  // Rounding can spill into the next unit (99,960 -> 100k -> 1L).
  if (idx > 0 && Number(text) >= 100) {
    idx -= 1;
    text = oneDecimal(abs / INDIAN_UNITS[idx][0]);
  }
  return text + INDIAN_UNITS[idx][1];
}

/**
 * Short scale labels: 2.4k, 2.5L, 1.2Cr (en-IN) or Intl compact otherwise.
 */
export function formatCompact(amount, options = {}) {
  const { locale = 'en-IN', currency } = options;
  assertFinite(amount, 'amount');
  const neg = amount < 0;
  const abs = Math.abs(amount);

  if (locale === 'en-IN') {
    const body = compactIndian(abs);
    const symbol = currency
      ? new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' })
          .formatToParts(0)
          .find((p) => p.type === 'currency').value
      : '';
    return (neg && body !== '0' ? MINUS : '') + symbol + body;
  }

  const nfOptions = { notation: 'compact', signDisplay: 'never' };
  if (currency) Object.assign(nfOptions, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' });
  const text = new Intl.NumberFormat(locale, nfOptions).format(abs);
  return (neg && abs !== 0 ? MINUS : '') + text;
}

/**
 * Grouped number with U+2212 negatives.
 */
export function formatNumber(value, options = {}) {
  const { locale = 'en-IN', minimumFractionDigits, maximumFractionDigits } = options;
  assertFinite(value, 'value');
  const nfOptions = { signDisplay: 'never' };
  if (minimumFractionDigits !== undefined) nfOptions.minimumFractionDigits = minimumFractionDigits;
  if (maximumFractionDigits !== undefined) nfOptions.maximumFractionDigits = maximumFractionDigits;
  const text = new Intl.NumberFormat(locale, nfOptions).format(Math.abs(value));
  const isZero = text.replace(/[^0-9]/g, '').replace(/0/g, '') === '';
  return (value < 0 && !isZero ? MINUS : '') + text;
}

function separators(locale) {
  let group = ',';
  let decimal = '.';
  try {
    for (const p of new Intl.NumberFormat(locale).formatToParts(1234567.5)) {
      if (p.type === 'group') group = p.value;
      else if (p.type === 'decimal') decimal = p.value;
    }
  } catch {
    // fall back to en defaults
  }
  return { group, decimal };
}

/**
 * Parse what people type or paste. Returns null when it is not a valid amount.
 */
export function parseAmount(input, options = {}) {
  try {
    if (typeof input !== 'string') return null;
    const { locale = 'en-IN' } = options;
    const { group, decimal } = separators(locale);
    let s = input.replace(/[\s  ]/g, '').replace(/[₹$€£¥]/g, '');
    if (s === '') return null;

    let negative = false;
    if (s[0] === '-' || s[0] === MINUS) {
      negative = true;
      s = s.slice(1);
    }
    let normalized = '';
    for (const ch of s) {
      if (ch >= '0' && ch <= '9') normalized += ch;
      else if (ch === decimal) normalized += '.';
      else if (ch === group) continue;
      else return null;
    }
    if (!/^(\d+(\.\d{1,2})?|\.\d{1,2})$/.test(normalized)) return null;
    const n = parseFloat(normalized);
    if (!Number.isFinite(n)) return null;
    return negative && n !== 0 ? -n : n;
  } catch {
    return null;
  }
}

/** Minor units (integer) to major units. */
export function fromMinor(minorUnits, currency = 'INR') {
  assertFinite(minorUnits, 'minorUnits');
  return minorUnits / 10 ** minorDigits(currency);
}

/** Major units to integer minor units, rounded half away from zero. */
export function toMinor(major, currency = 'INR') {
  assertFinite(major, 'major');
  const result = Math.sign(major) * scaled(Math.abs(major), minorDigits(currency));
  return result === 0 ? 0 : result;
}
