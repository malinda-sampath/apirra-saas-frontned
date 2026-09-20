import { useEffect, useMemo, useRef, useState } from "react";
import type { HttpMethod, ParsedApiMethod } from "../types";

const METHOD_STYLES: Record<string, string> = {
  get: "method-pill method-pill-get",
  post: "method-pill method-pill-post",
  put: "method-pill method-pill-put",
  delete: "method-pill method-pill-delete",
  patch: "method-pill method-pill-patch",
};

const METHOD_ORDER: HttpMethod[] = [
  "get",
  "post",
  "put",
  "delete",
  "patch",
  "options",
  "head",
];

type Props = {
  endpoints: ParsedApiMethod[];
  onSelect: (ep: ParsedApiMethod) => void;
  selected: ParsedApiMethod | null;
};

const isSameEndpoint = (a: ParsedApiMethod | null, b: ParsedApiMethod) =>
  !!a && a.method === b.method && a.path === b.path;

const matchesQuery = (ep: ParsedApiMethod, query: string) => {
  if (!query) return true;
  return (
    ep.path.toLowerCase().includes(query) ||
    ep.method.toLowerCase().includes(query) ||
    ep.summary?.toLowerCase().includes(query) ||
    ep.description?.toLowerCase().includes(query) ||
    ep.operationId?.toLowerCase().includes(query) ||
    ep.tags?.some((tag) => tag.toLowerCase().includes(query))
  );
};

const Sidebar: React.FC<Props> = ({ endpoints, onSelect, selected }) => {
  const [query, setQuery] = useState("");
  const [activeMethods, setActiveMethods] = useState<Set<HttpMethod>>(
    new Set(),
  );
  const [collapsedTags, setCollapsedTags] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus the search box with "/" from anywhere on the page.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const availableMethods = useMemo(() => {
    const present = new Set(endpoints.map((ep) => ep.method));
    return METHOD_ORDER.filter((m) => present.has(m));
  }, [endpoints]);

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery !== "" || activeMethods.size > 0;

  const filtered = useMemo(
    () =>
      endpoints.filter(
        (ep) =>
          (activeMethods.size === 0 || activeMethods.has(ep.method)) &&
          matchesQuery(ep, normalizedQuery),
      ),
    [endpoints, activeMethods, normalizedQuery],
  );

  const grouped = filtered.reduce(
    (acc, ep) => {
      const tag = ep.tags?.[0] || "default";
      if (!acc[tag]) acc[tag] = [];
      acc[tag].push(ep);
      return acc;
    },
    {} as Record<string, ParsedApiMethod[]>,
  );

  const toggleMethod = (method: HttpMethod) => {
    setActiveMethods((prev) => {
      const next = new Set(prev);
      if (next.has(method)) next.delete(method);
      else next.add(method);
      return next;
    });
  };

  const toggleGroup = (tag: string) => {
    setCollapsedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return (
    <aside className="flex w-80 flex-col border-r border-white/10 bg-white/[0.02]">
      {/* SEARCH + HEADER */}
      <div className="border-b border-white/10 px-4 py-3">
        <div className="relative mt-1">
          <svg
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>

          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 py-2 pl-8 pr-7 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Search endpoints... (press /)"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-white/10 hover:text-white"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* METHOD FILTER CHIPS */}
        {availableMethods.length > 1 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {availableMethods.map((method) => {
              const isActive = activeMethods.has(method);
              return (
                <button
                  key={method}
                  onClick={() => toggleMethod(method)}
                  className={`${METHOD_STYLES[method] ?? "method-pill bg-white/10 text-slate-300"} cursor-pointer transition-opacity ${
                    activeMethods.size > 0 && !isActive
                      ? "opacity-35"
                      : "opacity-100"
                  } ${isActive ? "ring-2 ring-blue-400" : ""}`}
                >
                  {method.toUpperCase()}
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-2.5 text-[11px] text-slate-500">
          {isSearching
            ? `${filtered.length} of ${endpoints.length} endpoints`
            : `${endpoints.length} endpoints`}
        </p>
      </div>

      {/* LIST */}
      <nav className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <svg
              className="mb-2 h-8 w-8 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <p className="text-xs font-medium text-slate-400">
              No endpoints match
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Try a different search term or method filter.
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([tag, eps]) => {
          const isCollapsed = !isSearching && collapsedTags.has(tag);

          return (
            <div key={tag} className="mb-2">
              {/* GROUP HEADER */}
              <button
                onClick={() => toggleGroup(tag)}
                className="flex w-full items-center justify-between px-5 py-1.5 text-left hover:bg-white/5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {tag} ({eps.length})
                </p>
                <svg
                  className={`h-3 w-3 text-slate-500 transition-transform ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* ITEMS */}
              {!isCollapsed && (
                <div className="space-y-1 px-2 pt-1">
                  {eps.map((ep) => {
                    const isActive = isSameEndpoint(selected, ep);

                    return (
                      <button
                        key={`${ep.method}-${ep.path}`}
                        onClick={() => onSelect(ep)}
                        title={ep.summary || ep.path}
                        className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors
                      ${
                        isActive
                          ? "bg-blue-500/10 border-l-4 border-blue-400"
                          : "border-l-4 border-transparent hover:bg-white/5"
                      }`}
                      >
                        {/* METHOD */}
                        <span
                          className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-md ${
                            METHOD_STYLES[ep.method] ??
                            "bg-white/10 text-slate-300"
                          }`}
                        >
                          {ep.method.toUpperCase()}
                        </span>

                        {/* PATH */}
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate font-mono text-xs ${
                              isActive
                                ? "text-blue-300 font-medium"
                                : "text-slate-300"
                            }`}
                          >
                            {ep.path}
                          </span>
                          {ep.summary && (
                            <span className="block truncate text-[10px] text-slate-500">
                              {ep.summary}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
