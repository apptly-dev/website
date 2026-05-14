// Re-export shim for the Nitro handler emitted by `nuxt build`.
//
// `export *` forwards any named exports Nitro emits alongside the default
// handler (e.g. Durable Object classes, Workflow classes); `export { default }`
// is needed in addition because `export *` skips defaults.
//
// The .output path resolves to a build artefact with no .d.mts sibling;
// pairing this shim with `nitro-entry.d.mts` gives the dispatcher a typed,
// relative import without a `@ts-expect-error` directive.

export * from '../../.output/server/index.mjs';
export { default } from '../../.output/server/index.mjs';
