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
      <div className="border-b border-gray-100 px-4 py-3">
        <p className="text-[12px] mt-2 mb-2 font-bold uppercase tracking-widest text-gray-600">
          Endpoints
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {Object.entries(grouped).map(([tag, eps]) => (
          <div key={tag} className="mb-5">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {tag}
            </p>
            {eps.map((ep, i) => {
              const isActive = selected === ep;
              return (
                <button
                  key={i}
                  onClick={() => onSelect(ep)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors ${
                    isActive ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={
                      METHOD_STYLES[ep.method] ??
                      "method-pill bg-gray-100 text-gray-600"
                    }
                  >
                    {ep.method.toUpperCase()}
                  </span>
                  <span
                    className={`truncate font-mono text-xs ${isActive ? "text-blue-700" : "text-gray-600"}`}
                  >
                    {ep.path}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
