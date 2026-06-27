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
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">
          Click "Send Request" to execute the API call and see the response here
        </p>
      </div>
    );
  }

  const responseText =
    typeof response === "string" ? response : JSON.stringify(response, null, 2);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => onTabChange("response")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "response"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-gray-900"
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
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
          aria-selected={activeTab === "request"}
          role="tab"
        >
          Request Details
        </button>
        <button
          onClick={() => onCopy(responseText)}
          className="ml-auto rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
          aria-label="Copy response"
        >
          Copy Response
        </button>
      </div>

      {activeTab === "response" ? (
        <pre className="max-h-96 min-h-48 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
          {responseText}
        </pre>
      ) : (
        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          {/* URL */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-gray-600">
              URL
            </p>
            <code className="block break-all rounded bg-white p-2 font-mono text-xs text-gray-900">
              {baseUrl}
              {path}
            </code>
          </div>

          {/* Method */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-gray-600">
              Method
            </p>
            <code className="inline-block rounded bg-blue-100 px-2 py-1 font-mono text-xs font-semibold text-blue-700">
              GET
            </code>
          </div>

          {/* Parameters */}
          {Object.keys(paramValues).length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-600">
                Parameters Sent
              </p>
              <pre className="overflow-auto rounded bg-white p-2 font-mono text-xs text-gray-900">
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
