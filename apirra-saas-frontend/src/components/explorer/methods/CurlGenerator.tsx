import React, { useMemo } from "react";
import type { HttpMethod } from "../../../types/methodTypes";

type CurlGeneratorProps = {
  method: HttpMethod;
  baseUrl: string;
  path: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  onCopy: (text: string) => void;
  isVisible: boolean;
  onToggle: () => void;
};

const CurlGenerator: React.FC<CurlGeneratorProps> = ({
  method,
  baseUrl,
  path,
  queryParams = {},
  headers = {},
  onCopy,
  isVisible,
  onToggle,
}) => {
  const curlCommand = useMemo(() => {
    // Build the full URL with query parameters
    const queryString =
      Object.keys(queryParams).length > 0
        ? "?" + new URLSearchParams(queryParams).toString()
        : "";

    const fullUrl = baseUrl + path + queryString;

    // Build the cURL command
    let curl = `curl -X ${method} "${fullUrl}"`;

    // Add headers if present
    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        curl += ` \\\n  -H "${key}: ${value}"`;
      }
    });

    return curl;
  }, [method, baseUrl, path, queryParams, headers]);

  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        aria-expanded={isVisible}
        aria-controls="curl-command-section"
      >
        {isVisible ? "Hide cURL" : "Show cURL"}
      </button>

      {isVisible && (
        <div id="curl-command-section" className="rounded-lg bg-gray-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              cURL Command
            </p>
            <button
              onClick={() => onCopy(curlCommand)}
              className="rounded px-2 py-1 text-xs font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
              aria-label="Copy cURL command"
            >
              Copy
            </button>
          </div>

          <div className="overflow-x-auto">
            <code className="block whitespace-pre break-words font-mono text-xs text-green-400">
              {curlCommand}
            </code>
          </div>

          {/* Additional info */}
          <div className="mt-3 border-t border-gray-700 pt-3">
            <p className="text-xs text-gray-400">
              Paste this command in your terminal to make the same request
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurlGenerator;
