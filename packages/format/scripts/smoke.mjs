import assert from 'node:assert/strict';
import {
  formatMoney, moneyParts, formatCompact, formatNumber, parseAmount, fromMinor, toMinor,
} from '../src/index.js';

const M = '−';
assert.equal(formatMoney(482315.4), '₹4,82,315.40');
assert.equal(formatMoney(2400), '₹2,400');
assert.equal(formatMoney(-2400), `${M}₹2,400`);
assert.equal(formatMoney(142000, { sign: 'always' }), '+₹1,42,000');
assert.equal(formatMoney(0), '₹0');
assert.equal(formatMoney(1234.5, { currency: 'USD', locale: 'en-US' }), '$1,234.50');
assert.equal(formatMoney(2400, { fraction: 'always' }), '₹2,400.00');
assert.equal(formatMoney(2400.5, { fraction: 'never' }), '₹2,401');
assert.equal(formatMoney(-0.001), '₹0');
assert.equal(formatMoney(-5, { sign: 'never' }), '₹5');
assert.equal(formatMoney(12345678.9), '₹1,23,45,678.90');
assert.deepEqual(moneyParts(-482315.4), { sign: M, currency: '₹', integer: '4,82,315', decimal: '.', fraction: '40' });
assert.deepEqual(moneyParts(2400), { sign: '', currency: '₹', integer: '2,400', decimal: '', fraction: '' });

assert.equal(formatCompact(999), '999');
assert.equal(formatCompact(2400), '2.4k');
assert.equal(formatCompact(25000), '25k');
assert.equal(formatCompact(100000), '1L');
assert.equal(formatCompact(250000), '2.5L');
assert.equal(formatCompact(12000000), '1.2Cr');
assert.equal(formatCompact(-2400), `${M}2.4k`);
assert.equal(formatCompact(2400, { currency: 'INR' }), '₹2.4k');
assert.equal(formatCompact(99999), '1L');
assert.equal(formatCompact(1500, { locale: 'en-US' }), '1.5K');

assert.equal(formatNumber(1234567.891, { maximumFractionDigits: 2 }), '12,34,567.89');
assert.equal(formatNumber(-1500), `${M}1,500`);

for (const [i, o] of [['2,400', 2400], ['₹2,400.50', 2400.5], ['2400', 2400], [' 1,00,000 ', 100000], ['2400.5', 2400.5]]) {
  assert.equal(parseAmount(i), o, i);
}
for (const bad of ['', '   ', '1.2.3', 'abc', '12a', '1.234']) assert.equal(parseAmount(bad), null, bad);
assert.equal(parseAmount('1.234,50', { locale: 'de-DE' }), 1234.5);

assert.equal(toMinor(2400.5), 240050);
assert.equal(toMinor(1.005), 101);
assert.equal(toMinor(-1.005), -101);
assert.equal(fromMinor(240050), 2400.5);
assert.equal(toMinor(500, 'JPY'), 500);
assert.equal(fromMinor(1000, 'KWD'), 1);

for (const bad of [NaN, Infinity, -Infinity]) {
  assert.throws(() => formatMoney(bad), RangeError);
  assert.throws(() => formatCompact(bad), RangeError);
  assert.throws(() => formatNumber(bad), RangeError);
}
console.log('smoke ok');
