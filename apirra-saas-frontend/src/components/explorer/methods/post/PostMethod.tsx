import { useState } from "react";
import type { ParsedApiMethod } from "../../../../utils/openApiParser";
import type { ExecutePayload } from "../../../../types/executPayload";

type Parameter = {
  name: string;
  required?: boolean;
  description?: string;
  schema?: {
    type?: string;
  };
};

type Props = {
  endpoint: ParsedApiMethod;
  onExecute: (payload: ExecutePayload) => Promise<unknown>;
  loading?: boolean;
  baseUrl: string;
};

const PostMethod: React.FC<Props> = ({
  endpoint,
  onExecute,
  loading,
  baseUrl,
}) => {
  const [response, setResponse] = useState<unknown>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [requestBody, setRequestBody] = useState(
    endpoint.requestExample !== undefined
      ? JSON.stringify(endpoint.requestExample, null, 2)
      : "",
  );

  const handleTry = async () => {
    setIsRunning(true);

    try {
      let parsedBody: unknown = undefined;

      // ✅ safe JSON parsing
      if (requestBody.trim()) {
        try {
          parsedBody = JSON.parse(requestBody);
        } catch {
          setResponse({
            success: false,
            error: "Invalid JSON body",
          });
          return;
        }
      }

      const res = await onExecute({
        method: "post",
        path: endpoint.path,
        baseUrl, // ✅ FIXED
        body: parsedBody,
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

  const params = (endpoint.parameters ?? []) as Parameter[];

  return (
    <div className="mx-auto w-full max-w-auto space-y-6 p-4">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <span
                style={{
                  background: "var(--color-post)",
                  color: "var(--color-post-text)",
                }}
                className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold tracking-widest text-white"
              >
                POST
              </span>

              <code className="truncate font-mono text-sm text-gray-900">
                {baseUrl}
                {endpoint.path}
              </code>
            </div>

            {endpoint.summary && (
              <p className="text-sm text-gray-500">{endpoint.summary}</p>
            )}
          </div>
        </div>
      </div>

      {/* PARAMETERS */}
      {params.length > 0 && (
        <div className="section-card">
          <p className="section-label">Parameters</p>

          {params.map((p, i) => (
            <div key={i} className="param-row">
              <code className="min-w-27.5 font-mono text-xs text-blue-700">
                {p.name}
              </code>

              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
                {p.schema?.type ?? "any"}
              </span>

              {p.required && (
                <span className="text-xs text-red-600">required</span>
              )}

              {p.description && (
                <span className="text-xs text-gray-400 truncate">
                  {p.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* BODY + EXECUTION */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <textarea
          value={requestBody}
          onChange={(e) => setRequestBody(e.target.value)}
          placeholder='{
            "key": "value"
          }'
          rows={10}
          className="w-full mt-3 p-4 rounded-lg border border-gray-300 bg-gray-50 text-sm font-mono text-gray-800 shadow-sm resize-y min-h-[320px] max-h-[600px] overflow-auto transition-all"
        />

        <button
          onClick={handleTry}
          disabled={loading || isRunning}
          className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white"
        >
          {loading || isRunning ? "Sending..." : "▶ Try POST"}
        </button>

        <pre className="mt-4 max-h-64 overflow-y-auto rounded-xl bg-gray-950 p-4 text-xs text-green-400">
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

export default PostMethod;
