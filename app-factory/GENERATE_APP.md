# App Generation (app-factory)

This documents the canonical way to generate new micro-apps from the `app-factory/app-template`.

Usage

- Official generator entrypoint: `app-factory/scripts/generate_from_template.cjs`
- Prefer using the npm script shortcut from the repo root:

```bash
npm run generate-app -- app-factory/app-template app-factory/generated-apps/<your-app-name>
```

Arguments

- `<templatePath>`: path to the template directory to copy. Use `app-factory/app-template`.
- `<destinationPath>`: path where the generated app should be created (e.g. `app-factory/generated-apps/photosynthesis-explainer`).

Behavior guarantees

- Copies the full template directory recursively, preserving folder layout and file contents.
- Copies all files including the `/services/capabilityClient.ts` file when present in the template.
- Non-destructive: if a file already exists at the destination path it is skipped (to preserve manual edits).

Example

```bash
# Generate a new app named "photosynthesis-explainer"
npm run generate-app -- app-factory/app-template app-factory/generated-apps/photosynthesis-explainer
```

Notes

- The script is CommonJS and intended to be executed with Node.js (Node >= 20).
- If you need the generator to overwrite existing files, run a manual copy or modify the script accordingly.
- Do NOT modify legacy code or change architecture when using the generator; it only copies files.
