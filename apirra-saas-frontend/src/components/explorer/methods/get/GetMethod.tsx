import { useState } from "react";
import type { ParsedApiMethod } from "../../../../utils/openApiParser";

type Parameter = {
  name: string;
  required?: boolean;
  description?: string;
  type?: string;
  schema?: {
    type?: string;
  };
};

type ResponseObject = {
  description?: string;
};

type Responses = Record<string, ResponseObject>;

type Props = {
  endpoint: ParsedApiMethod & {
    parameters?: Parameter[];
    responses?: Responses;
  };
};

const GetMethod: React.FC<Props> = ({ endpoint }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleTry = async () => {
    setIsRunning(true);
    setResponse(null);
    try {
      const res = await fetch(endpoint.path);
      const text = await res.text();
      setResponse(text);
    } catch {
      setResponse("Request failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const params = endpoint.parameters ?? [];
  const responses = endpoint.responses ?? {};

  return (
    <div className="w-full mt-10 space-y-4">
      {/* Header */}
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
          <code className="font-mono text-sm text-gray-800">
            {endpoint.path}
          </code>
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
          disabled={isRunning}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isRunning ? (
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

        {response && (
          <pre className="mt-4 h-auto overflow-y-auto rounded-xl bg-gray-950 p-4 text-xs text-green-400">
            {response}
          </pre>
        )}
      </div>
    </div>
  );
};

export default GetMethod;
