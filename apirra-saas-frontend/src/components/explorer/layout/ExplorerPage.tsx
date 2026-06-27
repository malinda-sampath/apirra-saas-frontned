import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import type { ParsedApiMethod } from "../../../utils/openApiParser";
import MethodRenderer from "../methods/MethodRenderer";
import { executeRequest } from "../../../services/explorer/requestExecutor";
import type { ExecutePayload } from "../../../types/executPayload";

const ExplorerPage = () => {
  const location = useLocation();
  const endpoints: ParsedApiMethod[] = location.state?.endpoints || [];
  const baseUrl: string = location.state?.baseUrl || "";
  const [selected, setSelected] = useState<ParsedApiMethod | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (!selected) return;

    const fullUrl = buildUrl(baseUrl, selected.path);

    await navigator.clipboard.writeText(fullUrl);

    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const buildUrl = (baseUrl: string, path: string) => {
    if (!baseUrl) return path;

    const cleanBase = baseUrl.replace(/\/$/, ""); // remove trailing /
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${cleanBase}${cleanPath}`;
  };

  const handleExecute = async (payload: ExecutePayload) => {
    setLoading(true);

    try {
      const res = await executeRequest({
        baseUrl,
        method: payload.method,
        path: payload.path,
        queryParams: payload.queryParams,
        headers: payload.headers,
        body: payload.body,
      });

      return res;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const errorRes = { error: message };

      return errorRes;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        endpoints={endpoints}
        onSelect={setSelected}
        selected={selected}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-18 items-center border-b border-gray-200 bg-white px-6">
          {/* LEFT SIDE */}
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h1 className="text-base font-semibold tracking-tight text-[28px] text-gray-900">
              API<span className="text-blue-500">RRA</span>
            </h1>
          </div>

          {/* RIGHT SIDE */}
          {selected && (
            <div className="ml-8 flex flex-1 items-center min-w-0">
              <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 shadow-sm transition hover:bg-gray-50">
                {/* Badge */}
                <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  Endpoint
                </span>

                <span className="text-gray-200">|</span>

                {/* URL wrapper MUST be flex-1 + min-w-0 */}
                <span className="flex-1 min-w-0">
                  <span
                    className="block truncate font-mono text-sm text-gray-800"
                    title={buildUrl(baseUrl, selected.path)}
                  >
                    {buildUrl(baseUrl, selected.path)}
                  </span>
                </span>

                {/* Copy button fixed */}
                <button
                  onClick={handleCopy}
                  className="shrink-0 flex items-center justify-center rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-500"
                  title="Copy endpoint"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition ${
                      copied ? "scale-110 text-green-500" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {copied ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 16h8M8 12h8M9 8h6"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {selected ? (
            <MethodRenderer
              endpoint={selected}
              onExecute={handleExecute}
              loading={loading}
              baseUrl={baseUrl}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <svg
                  className="h-7 w-7 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">
                Select an endpoint
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Choose a route from the sidebar to inspect it
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExplorerPage;
