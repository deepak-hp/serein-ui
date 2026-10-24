export interface MoneyOptions {
  /** ISO 4217 code. Default 'INR'. */
  currency?: string;
  /** BCP 47 locale. Default 'en-IN'. */
  locale?: string;
  /** 'auto' shows minor units only when non-zero. Default 'auto'. */
  fraction?: 'auto' | 'always' | 'never';
  /** 'always' adds a leading "+" to positives. Default 'auto'. */
  sign?: 'auto' | 'always' | 'never';
  /** Default 'narrowSymbol'. */
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
}

export interface MoneyParts {
  sign: '' | '+' | '−';
  currency: string;
  integer: string;
  decimal: string;
  fraction: string;
}

export interface CompactOptions {
  locale?: string;
  currency?: string;
}

export interface NumberOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface ParseOptions {
  locale?: string;
}

export function formatMoney(amount: number, options?: MoneyOptions): string;
export function moneyParts(amount: number, options?: MoneyOptions): MoneyParts;
export function formatCompact(amount: number, options?: CompactOptions): string;
export function formatNumber(value: number, options?: NumberOptions): string;
export function parseAmount(input: string, options?: ParseOptions): number | null;
export function fromMinor(minorUnits: number, currency?: string): number;
export function toMinor(major: number, currency?: string): number;
