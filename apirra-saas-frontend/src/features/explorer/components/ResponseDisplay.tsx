import React from "react";

type ResponseDisplayProps = {
  response: unknown;
  baseUrl: string;
  path: string;
  paramValues: Record<string, string>;
  onCopy: (text: string) => void;
  activeTab: "response" | "request";
  onTabChange: (tab: "response" | "request") => void;
};

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  response,
  baseUrl,
  path,
  paramValues,
  onCopy,
  activeTab,
  onTabChange,
}) => {
  if (response === null) {
    return (
      <div className="rounded-lg border-2 border-dashed border-white/10 p-8 text-center">
        <p className="text-sm text-slate-500">
          Click "Send Request" to execute the API call and see the response here
        </p>
      </div>
    );
  }

  const cleanBaseUrl = (url: string) => {
    try {
      const u = new URL(url);

      return `${u.protocol}//${u.host}`;
    } catch {
      return url;
    }
  };

  const responseText =
    typeof response === "string" ? response : JSON.stringify(response, null, 2);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => onTabChange("response")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "response"
              ? "bg-blue-500/15 text-blue-300"
              : "text-slate-400 hover:text-white"
          }`}
          aria-selected={activeTab === "response"}
          role="tab"
        >
          Response
        </button>
        <button
          onClick={() => onTabChange("request")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "request"
              ? "bg-blue-500/15 text-blue-300"
              : "text-slate-400 hover:text-white"
          }`}
          aria-selected={activeTab === "request"}
          role="tab"
        >
          Request Details
        </button>
        <button
          onClick={() => onCopy(responseText)}
          className="ml-auto rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Copy response"
        >
          Copy Response
        </button>
      </div>

      {activeTab === "response" ? (
        <pre className="max-h-96 min-h-48 overflow-auto rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-sm text-emerald-400">
          {responseText}
        </pre>
      ) : (
        <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.02] p-4">
          {/* URL */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
              URL
            </p>
            <code className="block break-all rounded bg-white/5 p-2 font-mono text-xs text-white">
              {cleanBaseUrl(baseUrl)}
              {path}
            </code>
          </div>

          {/* Method */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
              Method
            </p>
            <code className="inline-block rounded bg-blue-500/15 px-2 py-1 font-mono text-xs font-semibold text-blue-300">
              GET
            </code>
          </div>

          {/* Parameters */}
          {Object.keys(paramValues).length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                Parameters Sent
              </p>
              <pre className="overflow-auto rounded bg-white/5 p-2 font-mono text-xs text-white">
                {JSON.stringify(paramValues, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
