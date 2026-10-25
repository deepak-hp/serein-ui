import { useId, type CSSProperties } from 'react';
import * as stylex from '@stylexjs/stylex';
import { formatCompact, formatMoney, moneyParts } from '@serein-ui/format';
import { IconBackspace } from '@serein-ui/icons/react';

const reduced = '@media (prefers-reduced-motion: reduce)';
const growY = stylex.keyframes({ from: { transform: 'scaleY(0)' } });
const growX = stylex.keyframes({ from: { transform: 'scaleX(0)' } });
const tick = stylex.keyframes({ '0%, 100%': { opacity: 0.22 }, '12%': { opacity: 1 }, '40%': { opacity: 0.22 } });
const breathe = stylex.keyframes({ '0%, 100%': { opacity: 0.6 }, '50%': { opacity: 0.35 } });
const mono = 'var(--sr-font-family-mono)';

const s = stylex.create({
  sr: { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0 },
  readout: { display: 'inline-block', position: 'relative', whiteSpace: 'nowrap', fontFamily: 'var(--sr-font-family-sans)', fontStretch: '88%', fontVariantNumeric: 'tabular-nums', color: 'var(--sr-color-ink)' },
  xl: { fontSize: 88, lineHeight: '88px', fontWeight: 300, letterSpacing: '-0.035em' },
  l: { fontSize: 60, lineHeight: '64px', fontWeight: 300, letterSpacing: '-0.03em' },
  m: { fontSize: 32, lineHeight: '36px', fontWeight: 400, letterSpacing: '-0.02em' },
  muted: { color: 'var(--sr-color-ink-muted)' },
  currency: { color: 'var(--sr-color-ink-muted)', marginRight: '0.06em' },

  tape: { position: 'relative', height: 56, overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)' },
  strip: {
    position: 'absolute', top: 0, left: '50%', height: '100%',
    transform: 'translateX(calc(var(--sr-size-tick-minor) * var(--sr-tape-n) * -1))',
    transition: { default: 'transform var(--sr-duration-slow) var(--sr-easing-settle)', [reduced]: 'none' },
    // Longhands: StyleX drops a multi-layer `background` shorthand. Minor ₹100, mid ₹500, major ₹1,000 graduations.
    backgroundImage: 'repeating-linear-gradient(to right, var(--sr-color-line-strong) 0 1px, transparent 1px var(--sr-size-tick-minor)), repeating-linear-gradient(to right, var(--sr-color-ink-muted) 0 1px, transparent 1px calc(var(--sr-size-tick-major) / 2)), repeating-linear-gradient(to right, var(--sr-color-ink) 0 1px, transparent 1px var(--sr-size-tick-major))',
    backgroundSize: '100% 12px, 100% 18px, 100% 26px',
    backgroundPosition: 'top left, top left, top left',
    backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
  },
  over: { position: 'absolute', top: 0, bottom: 22, right: 0, left: 'calc(var(--sr-size-tick-minor) * var(--sr-tape-max))', backgroundImage: 'repeating-linear-gradient(135deg, var(--sr-color-danger-soft) 0 4px, transparent 4px 8px)' },
  tapeLabel: { position: 'absolute', top: 32, transform: 'translateX(-50%)', fontFamily: mono, fontSize: 12, lineHeight: '16px', color: 'var(--sr-color-ink-muted)' },
  needle: { position: 'absolute', left: '50%', top: 0, width: 2, height: 34, marginLeft: -1, backgroundColor: 'var(--sr-color-signal)', '::after': { content: '""', position: 'absolute', left: -4, top: -1, borderStyle: 'solid', borderWidth: 5, borderTopWidth: 6, borderColor: 'transparent', borderTopColor: 'var(--sr-color-signal)' } },

  gauge: { display: 'inline-block', maxWidth: '100%' },
  meter: { display: 'block', width: '100%' },
  svg: { display: 'block', overflow: 'visible' },
  tkMinor: { stroke: 'var(--sr-color-line-strong)' },
  tkMajor: { stroke: 'var(--sr-color-ink-muted)' },
  tkText: { fontFamily: mono, fontSize: 12, fill: 'var(--sr-color-ink-muted)' },
  tkLimitText: { fill: 'var(--sr-color-ink)', fontWeight: 500 },
  tubeBg: { fill: 'var(--sr-color-surface-sunken)' },
  tube: { fill: 'none', stroke: 'var(--sr-color-line-strong)' },
  waterBg: { fill: 'var(--sr-color-signal-soft)' },
  waterLine: { fill: 'var(--sr-color-signal)', opacity: 0.22 },
  meniscus: { stroke: 'var(--sr-color-signal)', strokeWidth: 2 },
  limit: { stroke: 'var(--sr-color-ink)', strokeDasharray: '3 3' },
  meterFill: { fill: 'var(--sr-color-signal)' },
  growY: { transformBox: 'fill-box', transformOrigin: 'bottom', animationName: { default: growY, [reduced]: 'none' }, animationDuration: '900ms', animationTimingFunction: 'var(--sr-easing-settle)', animationFillMode: 'both' },
  growX: { transformBox: 'fill-box', transformOrigin: 'left', animationName: { default: growX, [reduced]: 'none' }, animationDuration: 'var(--sr-duration-slow)', animationTimingFunction: 'var(--sr-easing-settle)', animationFillMode: 'both' },
  scale: { position: 'relative', height: 16, marginTop: 6, fontFamily: mono, fontSize: 12, lineHeight: '16px', color: 'var(--sr-color-ink-muted)' },
  scaleItem: { position: 'absolute', top: 0, left: 0 },
  scaleLimit: { transform: 'translateX(-50%)', color: 'var(--sr-color-ink)', fontWeight: 500 },
  scaleEnd: { left: 'auto', right: 0 },

  rain: { position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', columnGap: 'var(--sr-space-3)', margin: 0 },
  rainPlot: { position: 'relative', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--sr-color-line-strong)', backgroundImage: 'repeating-linear-gradient(to top, transparent 0 calc(var(--sr-rain-h) / 3 - 1px), var(--sr-color-line) calc(var(--sr-rain-h) / 3 - 1px) calc(var(--sr-rain-h) / 3))' },
  rainBars: { position: 'absolute', inset: 0, display: 'grid', alignItems: 'end' },
  bar: { justifySelf: 'center', width: 3, backgroundColor: 'var(--sr-color-ink)', borderRadius: '1px 1px 0 0', transformOrigin: 'bottom', animationName: { default: growY, [reduced]: 'none' }, animationDuration: 'var(--sr-duration-slow)', animationTimingFunction: 'var(--sr-easing-settle)', animationFillMode: 'both' },
  barHighlight: { width: 5, backgroundColor: 'var(--sr-color-signal)' },
  barFuture: { height: 2, backgroundColor: 'var(--sr-color-line-strong)', animationName: 'none' },
  average: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderTopStyle: 'dashed', borderTopColor: 'var(--sr-color-ink-muted)' },
  rainY: { position: 'relative', minWidth: 24, alignSelf: 'start' }, // same height as the plot (set inline) so labels sit on the gridlines
  rainYLabel: { position: 'absolute', right: 0, transform: 'translateY(50%)', fontFamily: mono, fontSize: 12, lineHeight: '16px', color: 'var(--sr-color-ink-muted)' },
  rainX: { display: 'grid', marginTop: 'var(--sr-space-2)' },
  rainXLabel: { fontFamily: mono, fontSize: 12, lineHeight: '16px', color: 'var(--sr-color-ink-muted)' },
  rainXEnd: { textAlign: 'right' },

  keypad: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sr-space-2)' },
  key: {
    display: 'grid', placeItems: 'center', height: 'var(--sr-size-key)', padding: 0, borderWidth: 0, borderRadius: 'var(--sr-radius-key)', boxShadow: 'var(--sr-shadow-key)', color: 'var(--sr-color-ink)', cursor: 'pointer',
    backgroundColor: { default: 'var(--sr-color-surface-raised)', ':hover': 'var(--sr-color-surface-overlay)', ':active': 'var(--sr-color-surface-sunken)' },
    fontFamily: 'var(--sr-font-family-sans)', fontSize: 26, fontWeight: 300, fontStretch: '92%', lineHeight: 1, transform: { default: 'none', ':active': 'translateY(1px)' },
    transition: { default: 'background-color var(--sr-duration-fast) var(--sr-easing-standard), transform var(--sr-duration-fast) var(--sr-easing-standard)', [reduced]: 'none' },
  },
  keyDisabled: { opacity: 0.5, cursor: 'not-allowed', transform: 'none', backgroundColor: 'var(--sr-color-surface-raised)' },
  keyIcon: { color: 'var(--sr-color-ink-muted)' },

  drizzle: { position: 'relative', display: 'inline-flex', alignItems: 'flex-end', width: 'max-content' },
  drizzleSm: { height: 14, gap: 3 },
  drizzleLg: { height: 24, gap: 5 },
  tick: { display: 'block', width: 2, backgroundColor: 'currentColor', opacity: { default: 0.22, [reduced]: 0.6 }, animationName: { default: tick, [reduced]: breathe }, animationDuration: { default: 'var(--sr-duration-rain)', [reduced]: '1.6s' }, animationTimingFunction: { default: 'linear', [reduced]: 'ease-in-out' }, animationIterationCount: 'infinite' },
});

const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;
const fixed = (n: number) => +n.toFixed(3);

export type ReadoutProps = { value: number; currency?: string; locale?: string; size?: 'xl' | 'l' | 'm'; fraction?: 'auto' | 'always' | 'never'; sign?: 'auto' | 'always'; className?: string };
/** A key figure as an instrument display. The visible glyphs are hidden from assistive technology; the full formatted amount is read instead. */
export function Readout({ value, currency = 'INR', locale = 'en-IN', size = 'xl', fraction = 'auto', sign = 'auto', className = '' }: ReadoutProps) {
  const options = { currency, locale, fraction, sign } as const;
  const parts = moneyParts(value, options);
  const generated = stylex.props(s.readout, s[size]);
  return <span className={`${generated.className} ${className}`.trim()}>
    <span aria-hidden="true">{parts.sign}<span {...stylex.props(s.currency)}>{parts.currency}</span>{parts.integer}{parts.fraction && <span {...stylex.props(s.muted)}>{parts.decimal}{parts.fraction}</span>}</span>
    <span {...stylex.props(s.sr)}>{formatMoney(value, options)}</span>
  </span>;
}

export type TapeProps = { value: number; max: number; className?: string };
/** Amount ruler (100 per 6px) sliding under a fixed needle. Decorative: the Readout or action carries the value. */
export function Tape({ value, max, className = '' }: TapeProps) {
  const span = Math.max(0, max) * 1.1 / 100;
  const n = fixed(Math.min(Math.max(0, Number.isFinite(value) ? value : 0) / 100, span));
  const labels = Array.from({ length: Math.floor(Math.max(0, max) / 5000) + 1 }, (_, k) => k * 5000);
  const generated = stylex.props(s.tape);
  return <div aria-hidden="true" className={`${generated.className} ${className}`.trim()}>
    <div {...stylex.props(s.strip)} style={{ ...cssVars({ '--sr-tape-n': n, '--sr-tape-max': fixed(Math.max(0, max) / 100) }), width: `calc(var(--sr-size-tick-minor) * ${fixed(span)})` }}>
      <span {...stylex.props(s.over)} />
      {labels.map(amount => <span key={amount} {...stylex.props(s.tapeLabel)} style={{ left: `calc(var(--sr-size-tick-minor) * ${amount / 100})` }}>{formatCompact(amount)}</span>)}
    </div>
    <span {...stylex.props(s.needle)} />
  </div>;
}

export type GaugeProps = { value: number; max: number; limit?: number; unit?: number; label: string; formatTick?: (value: number) => string; formatValue?: (value: number) => string };
export type MeterProps = GaugeProps;
const tickLength = (k: number) => k % 10 === 0 ? 16 : k % 5 === 0 ? 10 : 6;
const clamp = (value: number, max: number) => Math.min(max, Math.max(0, Number.isFinite(value) ? value : 0));
function meterSemantics({ value, max, limit, label, formatValue }: GaugeProps) {
  const top = limit ?? max, format = formatValue ?? ((v: number) => formatMoney(v));
  return { role: 'meter', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': top, 'aria-valuenow': clamp(value, max), 'aria-valuetext': `${format(value)} of ${format(top)}` } as const;
}

/** Vertical graduated tube, 4px per scale unit. aria-valuemax is the limit when one is given, otherwise the scale maximum. */
export function Gauge(props: GaugeProps) {
  const { value, max, limit, unit = 1000, formatTick = (v: number) => formatCompact(v) } = props;
  const pattern = useId().replace(/[^\w-]/g, '');
  const units = Math.max(0, Math.floor(max / unit)), height = units * 4, y = (k: number) => height - k * 4;
  const level = y(clamp(value, max) / unit), limitY = limit === undefined ? 0 : y(clamp(limit, max) / unit) - 0.5;
  return <div {...meterSemantics(props)} {...stylex.props(s.gauge)}><svg width={112} height={height + 20} viewBox={`0 -10 112 ${height + 20}`} aria-hidden="true" {...stylex.props(s.svg)}>
    <defs><pattern id={pattern} width={4} height={4} patternUnits="userSpaceOnUse"><rect width={4} height={4} {...stylex.props(s.waterBg)} /><rect y={3} width={4} height={1} {...stylex.props(s.waterLine)} /></pattern></defs>
    <rect x={57} y={-6} width={54} height={height + 6} {...stylex.props(s.tubeBg)} />
    <g {...stylex.props(s.growY)}><rect x={57} y={level} width={54} height={height - level} fill={`url(#${pattern})`} /><line x1={57} x2={111} y1={level} y2={level} shapeRendering="crispEdges" {...stylex.props(s.meniscus)} /></g>
    <path d={`M56.5 -6V${height - 0.5}H111.5V-6`} shapeRendering="crispEdges" {...stylex.props(s.tube)} />
    {Array.from({ length: units + 1 }, (_, k) => <line key={k} x1={50 - tickLength(k)} x2={50} y1={y(k) - 0.5} y2={y(k) - 0.5} shapeRendering="crispEdges" {...stylex.props(k % 10 === 0 ? s.tkMajor : s.tkMinor)} />)}
    {/* A tick label within one label height (16px) of the limit label would collide with it, so the limit wins. */}
    {Array.from({ length: Math.floor(units / 10) + 1 }, (_, i) => i).filter(i => limit === undefined || Math.abs(y(i * 10) - 0.5 - limitY) >= 16).map(i => <text key={i} x={30} y={y(i * 10) - 0.5} textAnchor="end" dominantBaseline="central" {...stylex.props(s.tkText)}>{formatTick(i * 10 * unit)}</text>)}
    {limit !== undefined && <><line x1={34} x2={111} y1={limitY} y2={limitY} shapeRendering="crispEdges" {...stylex.props(s.limit)} /><text x={30} y={limitY} textAnchor="end" dominantBaseline="central" {...stylex.props(s.tkText, s.tkLimitText)}>{formatTick(limit)}</text></>}
  </svg></div>;
}

/** Horizontal variant of Gauge for tight spaces; fluid width, limit label beneath its marker. */
export function Meter(props: MeterProps) {
  const { value, max, limit, unit = 1000, formatTick = (v: number) => formatCompact(v) } = props;
  const units = Math.max(0, Math.floor(max / unit)), x = (k: number) => k * 10;
  const pct = (v: number) => `${fixed(clamp(v, max) / max * 100)}%`;
  return <div {...meterSemantics(props)} {...stylex.props(s.meter)}><svg width="100%" height={28} viewBox={`0 0 ${x(units)} 28`} preserveAspectRatio="none" aria-hidden="true" {...stylex.props(s.svg)}>
    <rect x={0} y={0} width={x(clamp(value, max) / unit)} height={8} {...stylex.props(s.meterFill, s.growX)} />
    {Array.from({ length: units + 1 }, (_, k) => <line key={k} x1={x(k)} x2={x(k)} y1={28 - tickLength(k)} y2={28} shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" {...stylex.props(k % 10 === 0 ? s.tkMajor : s.tkMinor)} />)}
    {limit !== undefined && <line x1={x(clamp(limit, max) / unit)} x2={x(clamp(limit, max) / unit)} y1={-2} y2={28} shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" {...stylex.props(s.limit)} />}
  </svg><div aria-hidden="true" {...stylex.props(s.scale)}>
    <span {...stylex.props(s.scaleItem)}>{formatTick(0)}</span>
    {limit !== undefined ? <span {...stylex.props(s.scaleItem, s.scaleLimit)} style={{ left: pct(limit) }}>{formatTick(limit)}</span> : <span {...stylex.props(s.scaleItem, s.scaleEnd)}>{formatTick(max)}</span>}
  </div></div>;
}

export type RainChartProps = { data: Array<number | null>; max?: number; highlight?: number; showAverage?: boolean; xLabels?: string[]; height?: number; label: string };
function niceMax(top: number) {
  if (!(top > 0)) return 3;
  const step = 10 ** Math.floor(Math.log10(top / 3)) * 3;
  return Math.ceil(top / step) * step;
}
/** Daily values as precipitation bars: ink for the past, signal for the highlighted period, 2px stubs for periods still to come. */
export function RainChart({ data, max, highlight, showAverage = true, xLabels, height = 148, label }: RainChartProps) {
  const present = data.flatMap((v, i) => v === null || !Number.isFinite(v) ? [] : [{ v, i }]);
  const top = max ?? niceMax(Math.max(0, ...present.map(p => p.v)));
  const active = highlight ?? present.at(-1)?.i;
  const average = present.length ? present.reduce((sum, p) => sum + p.v, 0) / present.length : 0;
  const count = Math.max(1, data.length);
  const step = xLabels?.length ? Math.ceil(count / xLabels.length) : 1;
  const shown = (xLabels ?? []).filter((_, i) => i * step < count);
  return <figure role="img" aria-label={label} {...stylex.props(s.rain)} style={cssVars({ '--sr-rain-h': `${height}px` })}>
    <div style={{ minWidth: 0 }}>
      <div {...stylex.props(s.rainPlot)} style={{ height }}>
        {showAverage && present.length > 0 && <div {...stylex.props(s.average)} style={{ bottom: `${fixed(clamp(average, top) / top * 100)}%` }} />}
        <div {...stylex.props(s.rainBars)} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
          {data.map((v, i) => v === null ? <i key={i} data-future="" {...stylex.props(s.bar, s.barFuture)} /> : <i key={i} data-highlight={i === active ? '' : undefined} {...stylex.props(s.bar, i === active && s.barHighlight)} style={{ height: `${fixed(clamp(v, top) / top * 100)}%`, animationDelay: `${i * 14}ms` }} />)}
        </div>
      </div>
      {shown.length > 0 && <div aria-hidden="true" {...stylex.props(s.rainX)} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
        {shown.map((text, i) => { const last = i === shown.length - 1; return <span key={i} {...stylex.props(s.rainXLabel, last && s.rainXEnd)} style={{ gridColumn: `span ${last ? count - i * step : step}` }}>{text}</span>; })}
      </div>}
    </div>
    <div aria-hidden="true" {...stylex.props(s.rainY)} style={{ height }}>
      {[3, 2, 1, 0].map(k => <span key={k} {...stylex.props(s.rainYLabel)} style={{ bottom: `${fixed(k / 3 * 100)}%` }}>{formatCompact(top * k / 3)}</span>)}
    </div>
  </figure>;
}

export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '00' | '.' | 'delete';
export type KeypadProps = { onKey: (key: KeypadKey) => void; decimal?: boolean; label?: string; disabled?: boolean };
/** Machined numeric keys for touch money entry. The caller owns the entered value and how each key edits it. */
export function Keypad({ onKey, decimal = false, label = 'Amount keypad', disabled = false }: KeypadProps) {
  const keys: KeypadKey[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', decimal ? '.' : '00', '0', 'delete'];
  return <div role="group" aria-label={label} {...stylex.props(s.keypad)}>
    {keys.map(key => <button key={key} type="button" disabled={disabled} onClick={() => onKey(key)} aria-label={key === 'delete' ? 'Delete last digit' : key === '.' ? 'Decimal point' : undefined} {...stylex.props(s.key, disabled && s.keyDisabled)}>
      {key === 'delete' ? <IconBackspace size={24} {...stylex.props(s.keyIcon)} /> : key}
    </button>)}
  </div>;
}

export type DrizzleProps = { size?: 'sm' | 'lg'; label?: string; className?: string };
/** Loading indicator: eight graduations lighting in turn, like rain into a gauge. Inherits currentColor. */
export function Drizzle({ size = 'sm', label, className = '' }: DrizzleProps) {
  const generated = stylex.props(s.drizzle, size === 'lg' ? s.drizzleLg : s.drizzleSm);
  const tall = size === 'lg' ? 24 : 14, short = size === 'lg' ? 12 : 8;
  return <span role={label ? 'status' : undefined} aria-hidden={label ? undefined : true} className={`${generated.className} ${className}`.trim()} style={generated.style}>
    <span aria-hidden="true" style={{ display: 'contents' }}>
      {Array.from({ length: 8 }, (_, i) => <i key={i} {...stylex.props(s.tick)} style={{ height: i % 4 === 0 ? tall : short, animationDelay: `calc(var(--sr-duration-rain) * ${i / 8})` }} />)}
    </span>
    {label && <span {...stylex.props(s.sr)}>{label}</span>}
  </span>;
}
