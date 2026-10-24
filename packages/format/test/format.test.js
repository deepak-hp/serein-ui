import { describe, it, expect } from 'vitest';
import {
  formatMoney, moneyParts, formatCompact, formatNumber, parseAmount, fromMinor, toMinor,
} from '../src/index.js';

const M = '−';

describe('formatMoney', () => {
  it('documented examples', () => {
    expect(formatMoney(482315.4)).toBe('₹4,82,315.40');
    expect(formatMoney(2400)).toBe('₹2,400');
    expect(formatMoney(-2400)).toBe(`${M}₹2,400`);
    expect(formatMoney(142000, { sign: 'always' })).toBe('+₹1,42,000');
    expect(formatMoney(0)).toBe('₹0');
    expect(formatMoney(1234.5, { currency: 'USD', locale: 'en-US' })).toBe('$1,234.50');
  });
  it('uses U+2212, never a hyphen', () => {
    expect(formatMoney(-1)).not.toContain('-');
    expect(formatMoney(-1)[0]).toBe(M);
  });
  it('crore-scale grouping', () => {
    expect(formatMoney(12345678.9)).toBe('₹1,23,45,678.90');
    expect(formatMoney(100000000)).toBe('₹10,00,00,000');
  });
  it('paise rounding', () => {
    expect(formatMoney(10.005)).toBe('₹10.01');
    expect(formatMoney(10.004)).toBe('₹10');
    expect(formatMoney(0.1 + 0.2)).toBe('₹0.30');
  });
  it('negative zero and sub-paise negatives are unsigned', () => {
    expect(formatMoney(-0)).toBe('₹0');
    expect(formatMoney(-0.001)).toBe('₹0');
    expect(formatMoney(-0.001, { sign: 'always' })).toBe('₹0');
  });
  it('sign modes', () => {
    expect(formatMoney(5, { sign: 'auto' })).toBe('₹5');
    expect(formatMoney(5, { sign: 'always' })).toBe('+₹5');
    expect(formatMoney(-5, { sign: 'always' })).toBe(`${M}₹5`);
    expect(formatMoney(-5, { sign: 'never' })).toBe('₹5');
    expect(formatMoney(0, { sign: 'always' })).toBe('₹0');
  });
  it('fraction modes', () => {
    expect(formatMoney(2400, { fraction: 'always' })).toBe('₹2,400.00');
    expect(formatMoney(2400.5, { fraction: 'always' })).toBe('₹2,400.50');
    expect(formatMoney(2400.5, { fraction: 'never' })).toBe('₹2,401');
    expect(formatMoney(2400.5, { fraction: 'auto' })).toBe('₹2,400.50');
    expect(formatMoney(2400, { fraction: 'auto' })).toBe('₹2,400');
  });
  it('USD / en-US and EUR / de-DE', () => {
    expect(formatMoney(-1234.5, { currency: 'USD', locale: 'en-US' })).toBe(`${M}$1,234.50`);
    expect(formatMoney(1234.5, { currency: 'EUR', locale: 'de-DE' })).toBe('1.234,50 €');
    expect(formatMoney(-1234.5, { currency: 'EUR', locale: 'de-DE' })).toBe(`${M}1.234,50 €`);
  });
  it('zero-decimal currencies', () => {
    expect(formatMoney(1500, { currency: 'JPY', locale: 'ja-JP' })).toMatch(/1,500/);
  });
  it('throws RangeError on non-finite', () => {
    expect(() => formatMoney(NaN)).toThrow(RangeError);
    expect(() => formatMoney(Infinity)).toThrow(RangeError);
    expect(() => formatMoney(-Infinity)).toThrow(/finite/);
  });
});

describe('moneyParts', () => {
  it('splits parts', () => {
    expect(moneyParts(482315.4)).toEqual({
      sign: '', currency: '₹', integer: '4,82,315', decimal: '.', fraction: '40',
    });
  });
  it('hides fraction when whole', () => {
    expect(moneyParts(2400)).toEqual({
      sign: '', currency: '₹', integer: '2,400', decimal: '', fraction: '',
    });
  });
  it('signs', () => {
    expect(moneyParts(-2400).sign).toBe(M);
    expect(moneyParts(2400, { sign: 'always' }).sign).toBe('+');
    expect(moneyParts(-2400, { sign: 'never' }).sign).toBe('');
    expect(moneyParts(0, { sign: 'always' }).sign).toBe('');
  });
  it('fraction always', () => {
    expect(moneyParts(5, { fraction: 'always' }).fraction).toBe('00');
  });
  it('USD', () => {
    expect(moneyParts(1234.5, { currency: 'USD', locale: 'en-US' })).toEqual({
      sign: '', currency: '$', integer: '1,234', decimal: '.', fraction: '50',
    });
  });
  it('throws on non-finite', () => {
    expect(() => moneyParts(NaN)).toThrow(RangeError);
  });
});

describe('formatCompact', () => {
  it('en-IN scale', () => {
    expect(formatCompact(0)).toBe('0');
    expect(formatCompact(999)).toBe('999');
    expect(formatCompact(1000)).toBe('1k');
    expect(formatCompact(2400)).toBe('2.4k');
    expect(formatCompact(25000)).toBe('25k');
    expect(formatCompact(100000)).toBe('1L');
    expect(formatCompact(250000)).toBe('2.5L');
    expect(formatCompact(10000000)).toBe('1Cr');
    expect(formatCompact(12000000)).toBe('1.2Cr');
    expect(formatCompact(1234567890)).toBe('123.5Cr');
  });
  it('negatives use U+2212', () => {
    expect(formatCompact(-2400)).toBe(`${M}2.4k`);
    expect(formatCompact(-250000)).toBe(`${M}2.5L`);
  });
  it('currency prefix', () => {
    expect(formatCompact(2400, { currency: 'INR' })).toBe('₹2.4k');
    expect(formatCompact(-2400, { currency: 'INR' })).toBe(`${M}₹2.4k`);
  });
  it('rounding spills into next unit', () => {
    expect(formatCompact(99999)).toBe('1L');
    expect(formatCompact(9999999)).toBe('1Cr');
  });
  it('other locales use Intl compact', () => {
    expect(formatCompact(1500, { locale: 'en-US' })).toBe('1.5K');
    expect(formatCompact(-1500, { locale: 'en-US' })).toBe(`${M}1.5K`);
    expect(formatCompact(1500, { locale: 'en-US', currency: 'USD' })).toBe('$1.5K');
  });
  it('throws on non-finite', () => {
    expect(() => formatCompact(NaN)).toThrow(RangeError);
    expect(() => formatCompact(Infinity)).toThrow(RangeError);
  });
});

describe('formatNumber', () => {
  it('groups en-IN by default', () => {
    expect(formatNumber(1234567)).toBe('12,34,567');
  });
  it('negatives', () => {
    expect(formatNumber(-1500)).toBe(`${M}1,500`);
    expect(formatNumber(-0)).toBe('0');
  });
  it('fraction digits', () => {
    expect(formatNumber(1234567.891, { maximumFractionDigits: 2 })).toBe('12,34,567.89');
    expect(formatNumber(5, { minimumFractionDigits: 2 })).toBe('5.00');
  });
  it('locale', () => {
    expect(formatNumber(1234567.5, { locale: 'en-US' })).toBe('1,234,567.5');
    expect(formatNumber(1234.5, { locale: 'de-DE' })).toBe('1.234,5');
  });
  it('throws on non-finite', () => {
    expect(() => formatNumber(NaN)).toThrow(RangeError);
    expect(() => formatNumber(-Infinity)).toThrow(RangeError);
  });
});

describe('parseAmount', () => {
  it.each([
    ['2,400', 2400],
    ['₹2,400.50', 2400.5],
    ['2400', 2400],
    [' 1,00,000 ', 100000],
    ['2400.5', 2400.5],
    ['0', 0],
    ['.5', 0.5],
    ['12,34,56,789.25', 123456789.25],
    [`${M}2,400`, -2400],
    ['-2400', -2400],
  ])('accepts %j', (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });
  it.each([
    [''], ['   '], ['1.2.3'], ['1..2'], ['abc'], ['12a'], ['₹'], ['1.234'], ['--5'], ['2,400.'],
  ])('rejects %j', (input) => {
    expect(parseAmount(input)).toBeNull();
  });
  it('never throws on odd input', () => {
    expect(parseAmount(undefined)).toBeNull();
    expect(parseAmount(null)).toBeNull();
    expect(parseAmount(12)).toBeNull();
    expect(parseAmount('x', { locale: 'not a locale!!' })).toBeNull();
  });
  it('locale separators', () => {
    expect(parseAmount('1.234,50', { locale: 'de-DE' })).toBe(1234.5);
    expect(parseAmount('1,234.50', { locale: 'en-US' })).toBe(1234.5);
  });
});

describe('toMinor / fromMinor', () => {
  it('INR', () => {
    expect(toMinor(2400.5)).toBe(240050);
    expect(fromMinor(240050)).toBe(2400.5);
  });
  it('rounds half away from zero', () => {
    expect(toMinor(1.005)).toBe(101);
    expect(toMinor(-1.005)).toBe(-101);
    expect(toMinor(0.004)).toBe(0);
    expect(Object.is(toMinor(-0.004), 0)).toBe(true);
  });
  it('round-trips', () => {
    for (const minor of [0, 1, 99, 100, 123456, -250, 99999999999]) {
      expect(toMinor(fromMinor(minor))).toBe(minor);
    }
    for (const major of [0, 0.01, 19.99, 2400.5, -42.42]) {
      expect(fromMinor(toMinor(major))).toBeCloseTo(major, 10);
    }
  });
  it('currency minor digits', () => {
    expect(toMinor(500, 'JPY')).toBe(500);
    expect(fromMinor(500, 'JPY')).toBe(500);
    expect(toMinor(1.234, 'KWD')).toBe(1234);
    expect(fromMinor(1234, 'KWD')).toBe(1.234);
    expect(toMinor(12.34, 'USD')).toBe(1234);
  });
  it('throws on non-finite', () => {
    expect(() => toMinor(NaN)).toThrow(RangeError);
    expect(() => fromMinor(Infinity)).toThrow(RangeError);
  });
});
