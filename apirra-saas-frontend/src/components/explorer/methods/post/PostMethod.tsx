import { useState } from "react";
import type { ParsedApiMethod } from "../../../../utils/openApiParser";

type Parameter = {
  name: string;
  required?: boolean;
  description?: string;
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
};

const PostMethod: React.FC<Props> = ({ endpoint }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleTry = async () => {
    setIsRunning(true);
    setResponse(null);
    try {
      const res = await fetch(endpoint.path, { method: "POST" });
      setResponse(await res.text());
    } catch {
      setResponse("Request failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const params = (endpoint.parameters ?? []) as Parameter[];
  //   const responses = endpoint.responses ?? {};

  return (
    <div className="w-full mt-10 space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-3">
          <span
            style={{
              background: "var(--color-post)",
              color: "var(--color-post-text)",
            }}
            className="rounded-lg px-3 py-1 text-xs font-bold tracking-widest"
          >
            POST
          </span>
          <code className="font-mono text-sm text-gray-800">
            {endpoint.path}
          </code>
        </div>
        {endpoint.summary && (
          <p className="text-sm text-gray-500">{endpoint.summary}</p>
        )}
      </div>

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

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <button
          onClick={handleTry}
          disabled={isRunning}
          className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white"
        >
          {isRunning ? "Sending..." : "▶ Try POST"}
        </button>

        {response && (
          <pre className="mt-4 max-h-64 overflow-y-auto rounded-xl bg-gray-950 p-4 text-xs text-green-400">
            {response}
          </pre>
        )}
      </div>
    </div>
  );
};

export default PostMethod;
