import { useState } from "react";
import type { ParsedApiMethod } from "../../../../utils/openApiParser";

type Parameter = {
  name: string;
  required?: boolean;
  description?: string;
  type?: string;
  schema?: { type?: string };
};

type ResponseObject = { description?: string };

type Responses = Record<string, ResponseObject>;

type Props = {
  endpoint: ParsedApiMethod & {
    parameters?: Parameter[];
    responses?: Responses;
  };
};

const PutMethod: React.FC<Props> = ({ endpoint }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleTry = async () => {
    setIsRunning(true);
    setResponse(null);
    try {
      const res = await fetch(endpoint.path, { method: "PUT" });
      setResponse(await res.text());
    } catch {
      setResponse("Request failed.");
    } finally {
      setIsRunning(false);
    }
  };

  //   const params = endpoint.parameters ?? [];
  //   const responses = endpoint.responses ?? {};

  return (
    <div className="w-full mt-10 space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-3">
          <span
            style={{
              background: "var(--color-put)",
              color: "var(--color-put-text)",
            }}
            className="rounded-lg px-3 py-1 text-xs font-bold tracking-widest"
          >
            PUT
          </span>
          <code className="font-mono text-sm text-gray-800">
            {endpoint.path}
          </code>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <button
          onClick={handleTry}
          disabled={isRunning}
          className="rounded-xl bg-yellow-600 px-5 py-2 text-sm font-semibold text-white"
        >
          {isRunning ? "Sending..." : "▶ Try PUT"}
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

export default PutMethod;
