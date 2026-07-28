Add support for the HTTP method: $ARGUMENTS (e.g. `patch`, `head`, `options`).

This method is currently recognized by `utils/openApiParser.ts` and the
`HttpMethod`/`ExecutePayload` type unions, but has no UI component and
`MethodRenderer.tsx` falls through to "not yet supported" for it.

Steps:
1. Look at `components/explorer/methods/put/PutMethod.tsx` if the method
   carries a request body (e.g. PATCH), or `get/GetMethod.tsx` if it doesn't
   (e.g. HEAD/OPTIONS). Use it as the template — same local state shape
   (`response`, `isRunning`, `paramValues`, `toasts`, `showCurl`,
   `activeTab`, `requestHistory`), same grouped-parameter handling, same
   reset-on-endpoint-change effect.
2. Create `components/explorer/methods/<method>/<Method>Method.tsx`.
3. Use the method's own color where one exists in `index.css`
   (`--color-patch` is already defined; add a new CSS var + `.method-pill-*`
   class in `index.css` if this method doesn't have one yet).
4. Wire it into `MethodRenderer.tsx`'s switch statement.
5. **Use the richer types, not the thin duplicates**: import
   `ParsedApiMethod` from `utils/openApiParser.ts` and `ExecutePayload` from
   `types/executPayload.ts`. Do not add another `as unknown as ExecutePayload`
   cast — if the type doesn't fit, that's a signal to fix the type, not to
   cast around it (see the "Known issues" section in CLAUDE.md).
6. Confirm `npm run build` (tsc) and `npm run lint` pass.
