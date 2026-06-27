import { useState } from "react";
import type { ParsedApiMethod } from "../../../../utils/openApiParser";
import type { ExecutePayload } from "../../../../types/executPayload";

type Parameter = {
  name: string;
  required?: boolean;
  description?: string;
  type?: string;
  schema?: {
    type?: string;
  };
};

type ResponseObject = { description?: string };
type Responses = Record<string, ResponseObject>;

type Props = {
  endpoint: ParsedApiMethod & {
    parameters?: Parameter[];
    responses?: Responses;
  };
  onExecute: (payload: ExecutePayload) => Promise<unknown>;
  loading?: boolean;
  baseUrl: string;
};

const GetMethod: React.FC<Props> = ({
  endpoint,
  onExecute,
  loading,
  baseUrl,
}) => {
  const [response, setResponse] = useState<unknown>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleTry = async () => {
    setIsRunning(true);

    try {
      const res = await onExecute({
        method: "get",
        path: endpoint.path,
        baseUrl, // ✅ FIXED
        queryParams: {},
        headers: {},
      });

      setResponse(res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";

      setResponse({
        success: false,
        error: message,
      });
    } finally {
      setIsRunning(false); // ✅ ALWAYS RESET
    }
  };

  const params = endpoint.parameters ?? [];
  const responses = endpoint.responses ?? {};

  return (
    <div className="w-full mt-10 space-y-4">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold tracking-widest"
            style={{
              background: "var(--color-get)",
              color: "var(--color-get-text)",
            }}
          >
            GET
          </span>
          <span className="flex-1 min-w-0">
            <code className="block truncate font-mono text-sm text-gray-800">
              {endpoint.path}
            </code>
          </span>
        </div>
        {endpoint.summary && (
          <p className="text-sm text-gray-500">{endpoint.summary}</p>
        )}
      </div>

      {/* Parameters */}
      {params.length > 0 && (
        <div className="section-card">
          <p className="section-label">Parameters</p>
          {params.map((p: Parameter, i: number) => (
            <div key={i} className="param-row">
              <code className="min-w-27.5 font-mono text-xs text-blue-700">
                {p.name}
              </code>
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
                {p.schema?.type ?? p.type ?? "any"}
              </span>
              {p.required && (
                <span className="rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-600">
                  required
                </span>
              )}
              {p.description && (
                <span className="truncate text-xs text-gray-400">
                  {p.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Responses */}
      {Object.keys(responses).length > 0 && (
        <div className="section-card">
          <p className="section-label">Responses</p>
          {Object.entries(responses).map(
            ([code, resp]: [string, ResponseObject]) => {
              const isSuccess = code.startsWith("2");
              return (
                <div key={code} className="param-row">
                  <span
                    className="rounded px-2 py-0.5 text-xs font-bold"
                    style={
                      isSuccess
                        ? {
                            background: "var(--color-post)",
                            color: "var(--color-post-text)",
                          }
                        : {
                            background: "var(--color-delete)",
                            color: "var(--color-delete-text)",
                          }
                    }
                  >
                    {code}
                  </span>
                  <span className="text-xs text-gray-500">
                    {resp.description ?? "—"}
                  </span>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* Try it out */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <button
          onClick={handleTry}
          disabled={loading || isRunning}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading || isRunning ? (
            <>
              <svg
                className="h-3.5 w-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sending…
            </>
          ) : (
            <>▶ Try it out</>
          )}
        </button>

        <pre className="mt-4 min-h-64 max-h-128 overflow-y-auto rounded-xl bg-gray-950 p-4 text-xs text-green-400">
          {response === null
            ? ""
            : typeof response === "string"
              ? response
              : JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default GetMethod;
