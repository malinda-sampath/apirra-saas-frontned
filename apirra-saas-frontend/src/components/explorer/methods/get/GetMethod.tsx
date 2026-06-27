import { useState } from "react";
import type { ParsedApiMethod } from "../../../../utils/openApiParser";
import type { ExecutePayload } from "../../../../types/executPayload";

type Parameter = {
  name: string;
  in: "query" | "path" | "header" | "cookie";
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
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  const handleTry = async () => {
    // Validate required parameters
    const missing = params.find(
      (p) => p.required && !paramValues[p.name]?.trim(),
    );

    if (missing) {
      setResponse({
        success: false,
        error: `${missing.name} is required.`,
      });
      return;
    }

    setIsRunning(true);

    try {
      // Replace path parameters
      let finalPath = endpoint.path;

      params
        .filter((p) => p.in === "path")
        .forEach((p) => {
          finalPath = finalPath.replace(
            `{${p.name}}`,
            encodeURIComponent(paramValues[p.name] ?? ""),
          );
        });

      // Collect only query parameters
      const queryParams = Object.fromEntries(
        params
          .filter((p) => p.in === "query")
          .map((p) => [p.name, paramValues[p.name]])
          .filter(([, value]) => value !== undefined && value !== ""),
      );

      const res = await onExecute({
        method: "get",
        path: finalPath,
        baseUrl,
        queryParams,
        headers: {},
      });

      setResponse(res);
    } catch (err: unknown) {
      setResponse({
        success: false,
        error: err instanceof Error ? err.message : "Request failed",
      });
    } finally {
      setIsRunning(false);
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
                {p.required && (
                  <span className="ml-2 rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                    REQUIRED
                  </span>
                )}
              </code>
              {p.schema?.type === "boolean" ? (
                <select
                  className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  value={paramValues[p.name] ?? ""}
                  onChange={(e) =>
                    setParamValues((prev) => ({
                      ...prev,
                      [p.name]: e.target.value,
                    }))
                  }
                >
                  <div className="flex items-center gap-2">
                    <option className="text-green-700" value="true">
                      true
                    </option>
                    <option className="text-red-700" value="false">
                      false
                    </option>
                  </div>
                </select>
              ) : (
                <input
                  type={
                    p.schema?.type === "integer" || p.schema?.type === "number"
                      ? "number"
                      : "text"
                  }
                  placeholder={p.description ?? `Enter ${p.name}`}
                  className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required={p.required}
                  value={paramValues[p.name] ?? ""}
                  onChange={(e) =>
                    setParamValues((prev) => ({
                      ...prev,
                      [p.name]: e.target.value,
                    }))
                  }
                />
              )}
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
                  {p.in}
                </span>

                <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                  {p.schema?.type ?? p.type ?? "any"}
                </span>
              </div>

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
