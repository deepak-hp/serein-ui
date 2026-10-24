import tokens from '@serein-ui/tokens/json';
import { icons, iconNames } from '@serein-ui/icons';
import './foundations.css';

type Data = { base: Record<string, any>; themes: Record<'light' | 'dark', { color: Record<string, string> }>; descriptions: Record<string, string> };
const data = tokens as unknown as Data;

const SAMPLES: Record<string, string> = {
  'readout-xl': '₹4,82,315.40', 'readout-l': '₹2,400', 'readout-m': '₹39,776', title: 'Overview', heading: 'October budget',
  body: 'Nothing was charged. Try again in a minute.', 'body-reading': 'Serein keeps money calm and exact.', label: 'Amount',
  measure: '21 OCT · 19:24 · REF 4821', 'measure-strong': 'INR',
};

/** Every colour token in both themes, generated from @serein-ui/tokens. */
export function ColourTable() {
  return (
    <div className="sr-doc-scroll" tabIndex={0} role="region" aria-label="Colour tokens">
      <table className="sr-doc-table">
        <thead><tr><th scope="col">TOKEN</th><th scope="col">LIGHT</th><th scope="col">DARK</th><th scope="col">USE</th></tr></thead>
        <tbody>
          {Object.keys(data.themes.light.color).map(name => (
            <tr key={name}>
              <td><code>--sr-color-{name}</code></td>
              {(['light', 'dark'] as const).map(theme => (
                <td key={theme}><span className="sr-doc-chip" style={{ background: data.themes[theme].color[name] }} aria-hidden="true" /><code>{data.themes[theme].color[name]}</code></td>
              ))}
              <td>{data.descriptions[`color.${name}`]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Type styles rendered in their own style (sr-type-* classes from @serein-ui/tokens). */
export function TypeTable() {
  return (
    <div className="sr-doc-scroll" tabIndex={0} role="region" aria-label="Type styles">
      <table className="sr-doc-table">
        <thead><tr><th scope="col">STYLE</th><th scope="col">SAMPLE</th><th scope="col">SIZE / LINE / WEIGHT</th></tr></thead>
        <tbody>
          {Object.entries(data.base.type as Record<string, { fontSize: number; lineHeight: number; fontWeight: number }>).map(([name, style]) => (
            <tr key={name}>
              <td><code>sr-type-{name}</code></td>
              <td className={`sr-type-${name}`}>{SAMPLES[name]}</td>
              <td><code>{style.fontSize}px / {Math.round(style.fontSize * style.lineHeight)}px / {style.fontWeight}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Spacing, radius, duration and easing tokens. */
export function ScaleTables() {
  const rows = (group: string, unit: string) => Object.entries(data.base[group] as Record<string, number | number[]>).map(([key, value]) => (
    <tr key={key}>
      <td><code>--sr-{group}-{key}</code></td>
      <td>{group === 'space' && <span className="sr-doc-space" style={{ width: value as number }} aria-hidden="true" />}<code>{Array.isArray(value) ? `cubic-bezier(${value.join(', ')})` : `${value}${unit}`}</code></td>
      <td>{data.descriptions[`${group}.${key}`]}</td>
    </tr>
  ));
  return (
    <div className="sr-doc-scroll" tabIndex={0} role="region" aria-label="Spacing, radius and motion tokens">
      <table className="sr-doc-table">
        <thead><tr><th scope="col">TOKEN</th><th scope="col">VALUE</th><th scope="col">USE</th></tr></thead>
        <tbody>{rows('space', 'px')}{rows('radius', 'px')}{rows('duration', 'ms')}{rows('easing', '')}</tbody>
      </table>
    </div>
  );
}

/** The authored icon set from @serein-ui/icons. */
export function IconGrid() {
  return (
    <ul className="sr-doc-icons" aria-label={`${iconNames.length} icons`}>
      {iconNames.map(name => (
        <li key={name}><span aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons[name] }} /><code>{name}</code></li>
      ))}
    </ul>
  );
}
