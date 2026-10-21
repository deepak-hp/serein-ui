# Serein

A React component library and composition guide for building purposeful interfaces with coding assistants. The MIT-licensed beta package is `@serein-ui/react`; version `0.1.0-beta.1` is prepared but not yet published to npm.

Serein means fine rain from a clear evening sky. Its design pairs bright orange actions with clear white and deep evening surfaces, soft elevation, Plus Jakarta Sans, and restrained success green. It preserves the founder's Indian astrology-inspired direction; personal chart research is kept outside version control.

Explore the [component catalogue](https://deepak-hp.github.io/serein-ui/?view=catalogue), [design studio](https://deepak-hp.github.io/serein-ui/?view=serein), and [Storybook](https://deepak-hp.github.io/serein-ui/storybook/). These are planned canonical beta destinations pending repository rename and Pages verification; npm publication and human accessibility review remain open.

## Beta download

The planned GitHub prerelease will provide `serein-ui-react-0.1.0-beta.1.tgz`, `SHA256SUMS`, and unsigned `SOURCE.json` source metadata. Download all three assets from the same prerelease, verify the checksum, and install the exact tarball in a Node 24 test application using React and React DOM `^19.3.0`; import `@serein-ui/react/styles.css` once. npm publication is explicitly deferred.

To see the redesign locally, run `npm run reference:setup` then `npm run reference:dev` in `trial/`, and open [the Serein design studio](http://127.0.0.1:5174/?view=serein). The same real components appear in both themes. [DESIGN.md](DESIGN.md) records the visual language and [foundations](trial/docs/FOUNDATIONS.md) documents the tokens.

## Start here

- [End goal and master checklist](docs/RELEASE-CHECKLIST.md)
- [Library setup and commands](trial/README.md)
- [AI integration](trial/ai/README.md)
- [Composition recipes](trial/ai/COMPOSITION.md)
- [Comparison pilot and its limits](trial/docs/COMPOSITION-PILOT.md)
- [Accessibility scope](trial/docs/ACCESSIBILITY.md)
- [Release and verification guide](docs/RELEASING.md)
- [Beta evaluation and feedback](docs/BETA-EVALUATION.md)
- [Supported environments](docs/SUPPORT.md)
- [Documentation hosting](docs/HOSTING.md)
- [Release readiness evidence](docs/RELEASE-READINESS.md)
- [Contributing and maintenance](CONTRIBUTING.md)
- [Repository handoff](docs/REPOSITORY-HANDOFF.md)

The current implementation supports React web. Native platform adapters are not implemented. Automated accessibility tests are not a conformance certification. No public registry installation is available until the beta is published; use the reviewed prerelease asset or local tarball workflow in [the library setup](trial/README.md).

The source is available under the [MIT License](LICENSE). [Licensing details](docs/LICENSING.md) explain its scope and the separate terms for dependencies and font software.
