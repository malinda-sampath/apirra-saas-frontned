# Apirra — API Explorer

## What this is
Apirra is a browser-based API explorer, similar in spirit to Swagger UI or
Postman: the user pastes an OpenAPI spec URL, the app fetches and parses it,
then lets them browse every endpoint in a sidebar and "Try it out" — filling
in parameters/body, sending a real request, and inspecting the response —
all client-side.

## Tech stack (as used in this repo)
- React + TypeScript, built with Vite (`import.meta.env.VITE_APP_API_URL`)
- `react-router-dom` for routing (`/` and `/explorer`)
- `axios` for HTTP calls
- `openapi-types` for OpenAPI v3 typings
- Tailwind CSS v4 (`@import "tailwindcss"` + `@layer base/components` in
  `index.css`; utility classes like `bg-linear-to-br` confirm v4, not v3)

## Data flow
1. **`pages/ExplorerPage/PreLoginHome.tsx`** — user enters an OpenAPI spec
   URL. `fetchOpenApiSpec` (axios, via `services/explorer/explorerApi.ts`)
   retrieves the raw spec.
2. **`utils/openApiParser.ts`** — `parseOpenApi()` flattens `spec.paths` into
   a flat `ParsedApiMethod[]` (one entry per method per path), resolving
   `$ref`s for request bodies and schemas, and building a JSON example body
   for POST/PUT/PATCH via `generateExample()` (with circular-ref guarding).
3. On success, `react-router-dom` navigates to `/explorer`, passing
   `{ endpoints, baseUrl }` through router `state` (not global state/context —
   if the user refreshes `/explorer` directly, this data is gone).
4. **`components/explorer/layout/ExplorerPage.tsx`** — hosts `Sidebar` +
   `MethodRenderer`. Owns `selected` (currently chosen endpoint) and
   `loading`, and defines `handleExecute`, which wraps
   `services/explorer/requestExecutor.ts`'s `executeRequest` (a raw axios
   call assembled from `baseUrl` + `path` + query params + body).
5. **`components/explorer/layout/Sidebar.tsx`** — groups endpoints by their
   first OpenAPI tag and lists them.
6. **`components/explorer/methods/MethodRenderer.tsx`** — switches on
   `endpoint.method` to render `GetMethod` / `PostMethod` / `PutMethod` /
   `DeleteMethod`. `PATCH`/`HEAD`/`OPTIONS` fall through to a "not yet
   supported" placeholder.
7. Each method component (`get/GetMethod.tsx`, `post/PostMethod.tsx`,
   `put/PutMethod.tsx`, `delete/DeleteMethod.tsx`) is a near-identical
   pattern: param inputs → (body editor for POST/PUT) → send button →
   cURL preview (`CurlGenerator`) → response viewer (`ResponseDisplay`) →
   history (`RequestHistory`) → toasts (`ToastContainer`).

## File structure (inferred from imports — adjust if it drifts)
```
src/
├── app/Router.tsx
├── App.tsx
├── main.tsx
├── index.css
├── pages/
│   └── ExplorerPage/
│       └── PreLoginHome.tsx
├── components/
│   └── explorer/
│       ├── UserInput.tsx
│       ├── layout/
│       │   ├── ExplorerPage.tsx
│       │   └── Sidebar.tsx
│       └── methods/
│           ├── MethodRenderer.tsx
│           ├── CurlGenerator.tsx
│           ├── ParameterSection.tsx
│           ├── ParameterInput.tsx
│           ├── ResponseDisplay.tsx
│           ├── RequestHistory.tsx
│           ├── ToastContainer.tsx
│           ├── get/GetMethod.tsx
│           ├── post/PostMethod.tsx
│           ├── put/PutMethod.tsx
│           └── delete/DeleteMethod.tsx
├── services/
│   ├── appApi.ts              # axios instance, fixed backend (VITE_APP_API_URL)
│   └── explorer/
│       ├── explorerApi.ts     # axios instance, no baseURL (target API is user-supplied)
│       ├── openApiService.ts  # fetchOpenApiSpec
│       └── requestExecutor.ts # executeRequest — sends the actual "Try it" request
├── types/
│   ├── methodTypes.ts
│   ├── executPayload.ts
│   └── openApiType.ts
└── utils/
    └── openApiParser.ts
```

## Conventions already established — follow these for new code
- **New HTTP method component**: copy the shape of `GetMethod.tsx` (simplest)
  or `PostMethod.tsx` (if it needs a body editor). Every method component
  owns the same local state shape: `response`, `isRunning`, `paramValues`,
  `toasts`, `showCurl`, `activeTab`, `requestHistory`. Keep that consistent
  rather than inventing a new pattern per method.
- **Destructive methods** (see `DeleteMethod.tsx`) use a two-click confirm
  pattern (`confirmArmed`) rather than a modal — any edit to params re-arms
  it. Follow this for any other destructive verb you add.
- **Path/query param handling**: params come from the OpenAPI spec grouped
  by `in` (`path`/`query`/`header`/`cookie`) via `ParameterSection` /
  `ParameterInput`. Path params are substituted into `endpoint.path` with
  `encodeURIComponent`; query params are built via
  `Object.fromEntries(...).filter(v !== undefined && v !== "")`.
- **Toasts**: use the local `addToast(message, type)` / `removeToast(id)`
  pattern already in each method component — there's no global toast store.
- **Styling**: Tailwind utility classes inline, with a small set of shared
  CSS custom properties for method colors (`--color-get`, `--color-post`,
  etc. in `index.css`) and a `.method-pill-*` component class used by
  `Sidebar`. New method-specific UI should reuse these variables rather than
  hardcoding new colors.
- **Reset on endpoint change**: every method component resets its local
  state via a `useEffect` keyed on `endpoint.path` (wrapped in a
  `setTimeout(…, 0)` to dodge a render-order issue). Preserve this when
  editing these components.

## Known issues / tech debt (be aware of these, don't "fix" them silently)
1. **Two conflicting definitions each of `ParsedApiMethod` and
   `ExecutePayload`:**
   - `utils/openApiParser.ts` defines the "real" `ParsedApiMethod` (full
     OpenAPI data: tags, responses, requestBody, etc.) — this is what
     actually flows through the app.
   - `types/methodTypes.ts` defines a second, much thinner `ParsedApiMethod`
     (just `path`/`summary`/`description`), which is what the method
     components import and intersect with `{ parameters, responses }`.
   - `types/methodTypes.ts` also defines an `ExecutePayload` *without* a
     `body` field, while `types/executPayload.ts` defines a *different*
     `ExecutePayload` that includes `body`. This is exactly why
     `PostMethod`/`PutMethod` have to `as unknown as ExecutePayload`-cast
     their payload before calling `onExecute` — the thinner type would
     otherwise reject `body`.
   - **Don't paper over this with more casts.** If you touch this code,
     the fix is to pick one canonical definition per type (the richer ones)
     and delete the thin duplicates + update imports across method
     components.
2. **Sidebar active-item highlighting never actually works.**
   `ExplorerPage` does `onSelect={(ep) => setSelected({ ...ep })}`, spreading
   into a brand-new object each time. `Sidebar` then checks
   `const isActive = selected === ep` — reference equality against the
   original array item. Since `selected` is never the same reference as any
   `ep`, `isActive` is always `false`, so the blue "active" highlight never
   appears. Fix by either not spreading (`setSelected(ep)`), or comparing by
   `method + path` instead of object identity.
3. **`ResponseDisplay`'s "Request Details" tab hardcodes the method label as
   `GET`** regardless of what method was actually sent — it isn't passed the
   real method and should be.
4. **`services/appApi.ts` appears unused** in everything shown so far —
   confirm whether it's dead code or reserved for an upcoming
   auth/account feature before deleting it.
5. **`PATCH`/`HEAD`/`OPTIONS`** are recognized in the OpenAPI parser and
   type unions but have no method component / `MethodRenderer` case yet.
6. **Router state, not persisted state**: `/explorer` depends entirely on
   `location.state.endpoints`/`baseUrl`. A hard refresh or direct link to
   `/explorer` lands on an empty state with no redirect/guard back to `/`.

## Commands
> Scripts below are the standard Vite defaults — check `package.json` and
> adjust if this project customizes them.
```bash
npm install
npm run dev        # local dev server
npm run build       # production build (tsc + vite build)
npm run preview      # preview a production build
npm run lint          # eslint
```

## What "done" looks like for a task in this repo
1. New/changed code follows the existing method-component pattern (state
   shape, toast usage, reset-on-endpoint-change effect) rather than
   introducing a new one.
2. No new type duplication — reuse `ParsedApiMethod` from
   `utils/openApiParser.ts` and `ExecutePayload` from `types/executPayload.ts`
   rather than the thinner shadows in `types/methodTypes.ts`.
3. `npm run lint` and `tsc` (via `npm run build`) pass.
4. If you fix one of the known issues above, remove it from this list.
