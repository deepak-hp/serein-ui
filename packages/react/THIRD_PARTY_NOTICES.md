# Third-party notices

Serein is built with dependencies declared in `package.json`; their license texts remain governed by their respective authors. The npm archive keeps code dependencies external and installs them as dependencies; it does not relicense their code or font software under Serein's MIT license.

| Dependency | Version | License | Upstream license |
| --- | --- | --- | --- |
| [Base UI](https://base-ui.com) | 1.9.0 | MIT | [MIT text](https://github.com/mui/base-ui/blob/master/LICENSE) |
| [DayPicker](https://daypicker.dev) | 10.0.1 | MIT | [MIT text](https://github.com/gpbl/react-day-picker/blob/main/LICENSE) |
| [StyleX](https://stylexjs.com) | 0.19.1 | MIT | [MIT text](https://github.com/facebook/stylex/blob/main/LICENSE) |
| [React](https://react.dev) peer dependency | 19.3.0 | MIT | [MIT text](https://github.com/facebook/react/blob/main/LICENSE) |
| [React DOM](https://react.dev) peer dependency | 19.3.0 | MIT | [MIT text](https://github.com/facebook/react/blob/main/LICENSE) |
| [Anek Latin](https://github.com/EkType/Anek) (Ek Type), bundled | 5.3.0 via Fontsource | OFL-1.1 | `dist/files/OFL.txt` |
| [Chivo Mono](https://github.com/Omnibus-Type/ChivoMono) (Omnibus-Type), bundled | 5.3.0 via Fontsource | OFL-1.1 | `dist/files/OFL.txt` |

Anek Latin and Chivo Mono font files are redistributed inside this package (`dist/files`, loaded by `@serein-ui/react/fonts.css`) under the SIL Open Font License 1.1. Their copyright notices and the complete license text ship beside them in `dist/files/OFL.txt`; keep that file when you redistribute the fonts.

Development tooling also includes Vite, TypeScript, Storybook, Vitest, Playwright, Babel, Testing Library, and axe-core. This notice records attribution for the package's direct runtime dependencies and bundled assets. Complete license texts remain available in each installed dependency and from the linked upstream projects.
