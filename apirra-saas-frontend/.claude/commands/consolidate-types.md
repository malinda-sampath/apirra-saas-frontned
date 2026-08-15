Consolidate the duplicated `ParsedApiMethod` and `ExecutePayload` types
described in CLAUDE.md's "Known issues" section.

Steps:
1. Confirm the two definitions of each type:
   - `ParsedApiMethod`: the full one in `utils/openApiParser.ts` vs. the
     thin one in `types/methodTypes.ts`.
   - `ExecutePayload`: the one with `body` in `types/executPayload.ts` vs.
     the one without `body` in `types/methodTypes.ts`.
2. Pick the richer definition of each as canonical. Delete the thin
   duplicates from `types/methodTypes.ts`.
3. Update every import across `components/explorer/methods/**` and
   `components/explorer/layout/**` to import from the canonical location.
4. Remove the `as unknown as ExecutePayload` casts in `PostMethod.tsx` and
   `PutMethod.tsx` now that the real type includes `body`.
5. Run `npm run build` (tsc) to catch any now-surfaced type errors from
   components that were relying on the thinner shape, and fix them properly
   rather than re-introducing a cast.
6. Once done, remove item 1 from CLAUDE.md's "Known issues" list.
