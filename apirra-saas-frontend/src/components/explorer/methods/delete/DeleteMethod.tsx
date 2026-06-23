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

const DeleteMethod: React.FC<Props> = ({ endpoint }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleTry = async () => {
    setIsRunning(true);
    setResponse(null);
    try {
      const res = await fetch(endpoint.path, { method: "DELETE" });
      setResponse(await res.text());
    } catch {
      setResponse("Request failed.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-3">
          <span
            style={{
              background: "var(--color-delete)",
              color: "var(--color-delete-text)",
            }}
            className="rounded-lg px-3 py-1 text-xs font-bold tracking-widest"
          >
            DELETE
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
          className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white"
        >
          {isRunning ? "Sending..." : "▶ Try DELETE"}
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

export default DeleteMethod;
