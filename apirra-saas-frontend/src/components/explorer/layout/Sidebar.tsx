import type { ParsedApiMethod } from "../../../utils/openApiParser";

const METHOD_STYLES: Record<string, string> = {
  get: "method-pill method-pill-get",
  post: "method-pill method-pill-post",
  put: "method-pill method-pill-put",
  delete: "method-pill method-pill-delete",
  patch: "method-pill method-pill-patch",
};

type Props = {
  endpoints: ParsedApiMethod[];
  onSelect: (ep: ParsedApiMethod) => void;
  selected: ParsedApiMethod | null;
};

const Sidebar: React.FC<Props> = ({ endpoints, onSelect, selected }) => {
  const grouped = endpoints.reduce(
    (acc, ep) => {
      const tag = ep.tags?.[0] || "default";
      if (!acc[tag]) acc[tag] = [];
      acc[tag].push(ep);
      return acc;
    },
    {} as Record<string, ParsedApiMethod[]>,
  );

  return (
    <aside className="flex w-80 flex-col border-r border-gray-200 bg-white">
      {/* SEARCH + HEADER */}
      <div className="border-b border-gray-100 px-4 py-3">
        {/* <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          API Endpoints
        </p> */}

        <input
          className="w-full mt-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          placeholder="Search endpoints..."
        />
      </div>

      {/* LIST */}
      <nav className="flex-1 overflow-y-auto py-2">
        {Object.entries(grouped).map(([tag, eps]) => (
          <div key={tag} className="mb-6">
            {/* GROUP HEADER */}
            <div className="px-3 mb-2">
              <div className="flex items-center justify-between">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-700">
                  {tag} ({eps.length})
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="space-y-1 px-2">
              {eps.map((ep, i) => {
                const isActive = selected === ep;

                return (
                  <button
                    key={i}
                    onClick={() => onSelect(ep)}
                    className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                  >
                    {/* METHOD */}
                    <span
                      className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-md ${
                        METHOD_STYLES[ep.method] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ep.method.toUpperCase()}
                    </span>

                    {/* PATH */}
                    <span
                      className={`flex-1 truncate font-mono text-xs ${
                        isActive ? "text-blue-700 font-medium" : "text-gray-600"
                      }`}
                    >
                      {ep.path}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
