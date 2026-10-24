# Reviewed client-side workflow examples

These files are reviewed, runnable local demonstrations, not package exports or backend integrations. Read only the example relevant to the task, together with [COMPOSITION.md](../COMPOSITION.md), [README.md](../README.md), and the [generated contract](../contract.json).

- Invoices.tsx: records, filtering, detail focus return, and simulated reminder recovery.
- Settings.tsx: grouped local preferences, validation, failure recovery, and retained input.
- Onboarding.tsx: sequential local setup, review, completion, and restart recovery.
- Shell.tsx and workflows.css: the shared semantic shell and layout treatment.
- model.ts: fictional fixture data, validation, storage boundaries, and simulated latency.

These files are the source of truth. Run pnpm build to regenerate the contract and full-text guide from them; pnpm ai:check verifies freshness.
