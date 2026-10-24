# AI composition evaluation protocol

Use this protocol to compare guidance-assisted composition with another approach without claiming a universal quality score.

## Scope and setup

Choose at least three representative tasks with settled content and states, such as an invoice collection, a grouped settings form, and a local onboarding flow. For every task, keep the same brief, fixture data, supported Serein APIs, model/version, generation budget, and implementation time. Record the exact guidance supplied to each run, including whether it received `ai/COMPOSITION.md`, `ai/examples/README.md`, or only the contract. Do not weaken a baseline deliberately.

Run each condition more than once. Preserve the prompts, source revision/fingerprint, outputs, screenshots, command results, and any manual corrections. The workflow examples are local client demonstrations, not backend reference implementations and not package exports.

## Human review

Have reviewers inspect rendered desktop and narrow light/dark results independently where possible. Use the same written rubric for every output:

- task clarity and information hierarchy;
- fit of real content, labels, density, and empty/error/loading states;
- interaction completion, including retained input and recovery;
- responsive behavior and visual fidelity to Flame & Ink;
- keyboard behavior, focus, labels, and accessibility evidence.

Record observations and disagreements rather than converting taste into invented objective scores. Accessibility is reviewed separately: automated checks may identify regressions, but do not replace complete-process or assistive-technology evaluation.

## Reporting

Report the task set, conditions, number of runs, source fingerprint, human review notes, concrete defects, fixes, and limits. State only what the evidence supports for these runs. Do not generalize a local pilot into improved AI quality, WCAG conformance, or cross-assistant compatibility.

## Separate whole-library pilot

`../evaluation/README.md` describes a separate 12-attempt comparison of plain React/CSS with the pre-rename library plus its guidance. Unlike the composition-only pilot, candidates implement their own state and interactions against a common simulated service. The three tasks all overlap existing canonical recipes, so this is explicitly in-domain evidence. Frozen prompts/materials and uncorrected generated outputs retain the package identity used at the time; compile failures count as outcomes. Automated checks and a label-blinded browser packet support independent human review but do not substitute for it. The comparison evaluates the combined package/guidance offering, not the isolated effect of composition guidance or a universal improvement claim.
