# @serein-ui/format

Money and number formatting for Serein UIs. India-first, locale-aware, no runtime dependencies.

## Why

- **Lakh/crore grouping.** `₹4,82,315.40`, not `₹482,315.40`. Powered by `Intl` with `en-IN`.
- **A true minus sign.** Negatives use U+2212 placed before the currency symbol (`−₹2,400`), never a hyphen.
- **Tabular readouts.** `moneyParts` splits sign, symbol, integer and fraction so a UI can style each piece (smaller symbol, dimmed paise) while the text stays consistent.
- **Minor units only when they matter.** `₹2,400`, but `₹2,400.50`.

## API

| Function | Purpose |
| --- | --- |
| `formatMoney(amount, opts?)` | Currency string. Options: `currency='INR'`, `locale='en-IN'`, `fraction='auto'\|'always'\|'never'`, `sign='auto'\|'always'\|'never'`, `currencyDisplay='narrowSymbol'` |
| `moneyParts(amount, opts?)` | `{ sign, currency, integer, decimal, fraction }` for styled readouts |
| `formatCompact(amount, { locale?, currency? })` | `2.4k`, `2.5L`, `1.2Cr` for en-IN; Intl compact for other locales |
| `formatNumber(value, { locale?, minimumFractionDigits?, maximumFractionDigits? })` | Grouped number with U+2212 negatives |
| `parseAmount(input, { locale? })` | Parse typed/pasted text to a number, or `null` (never throws) |
| `toMinor(major, currency?)` / `fromMinor(minor, currency?)` | Convert between major and integer minor units |

The `format*` functions and `moneyParts` throw `RangeError` for `NaN` / `Infinity`.

## Examples

```js
import { formatMoney, moneyParts, formatCompact, parseAmount, toMinor } from '@serein-ui/format';

formatMoney(482315.4);                                   // ₹4,82,315.40
formatMoney(-2400);                                      // −₹2,400
formatMoney(142000, { sign: 'always' });                 // +₹1,42,000
formatMoney(1234.5, { currency: 'USD', locale: 'en-US' }); // $1,234.50

moneyParts(482315.4);
// { sign: '', currency: '₹', integer: '4,82,315', decimal: '.', fraction: '40' }

formatCompact(250000);                                   // 2.5L
formatCompact(2400, { currency: 'INR' });                // ₹2.4k

parseAmount(' 1,00,000 ');                               // 100000
parseAmount('₹2,400.50');                                // 2400.5
parseAmount('1.234');                                    // null (more than 2 fraction digits)

toMinor(2400.5);                                         // 240050
```

## Store money as integer minor units

Floating-point numbers cannot represent most decimal amounts exactly. Keep money in your database and API as integer minor units (paise, cents) and convert with `fromMinor` only at the edge, when displaying. Use `toMinor(parseAmount(input))` to turn user input back into storable integers.
