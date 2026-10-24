# Serein native playground

An Expo (SDK 57) app showing `@serein-ui/native` in light and dark side by side. The page itself can follow the system or be forced to either theme.

```bash
pnpm build                                        # once, from the repository root: builds tokens, fonts and @serein-ui/native
pnpm --filter @serein-ui/native-playground start  # then press i, a or w, or scan the QR code
```

Expo Go only runs the newest SDK. If the store version has moved past SDK 57, use `w` (web), a simulator, or a development build.
