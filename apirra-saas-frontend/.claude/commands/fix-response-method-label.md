Fix the hardcoded method label in `ResponseDisplay.tsx`'s "Request Details"
tab (see CLAUDE.md "Known issues" #3).

Root cause: `ResponseDisplay.tsx` renders a hardcoded `GET` string in the
"Method" block of the Request Details tab (around the `<code>GET</code>`
element), regardless of which method was actually sent.

Steps:
1. Add a `method` prop to `ResponseDisplayProps` in `ResponseDisplay.tsx`.
2. Render `{method.toUpperCase()}` in place of the hardcoded `GET` string.
3. Update every caller (`get/GetMethod.tsx`, `post/PostMethod.tsx`,
   `put/PutMethod.tsx`, `delete/DeleteMethod.tsx`) to pass their own method
   (e.g. `"get"`, `"post"`, `"put"`, `"delete"`) into `<ResponseDisplay />`.
4. Manually verify: try a POST/PUT/DELETE endpoint, send a request, open the
   "Request Details" tab, confirm the Method block shows the real verb
   instead of always `GET`.
5. Remove item 3 from CLAUDE.md's "Known issues" list once verified.
