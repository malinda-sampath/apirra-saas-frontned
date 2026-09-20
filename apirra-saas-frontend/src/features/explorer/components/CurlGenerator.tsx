import React, { useMemo } from "react";
import type { HttpMethod } from "../types";

type CurlGeneratorProps = {
  method: HttpMethod;
  baseUrl: string;
  path: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
  onCopy: (text: string) => void;
  isVisible: boolean;
  onToggle: () => void;
};

// Methods that conventionally carry a request body
const BODY_METHODS = new Set(["post", "put", "patch"]);

const CurlGenerator: React.FC<CurlGeneratorProps> = ({
  method,
  baseUrl,
  path,
  queryParams = {},
  headers = {},
  body,
  onCopy,
  isVisible,
  onToggle,
}) => {
  const curlCommand = useMemo(() => {
    const cleanBaseUrl = (url: string) => {
      try {
        const u = new URL(url);

        return `${u.protocol}//${u.host}`;
      } catch {
        return url;
      }
    };

    const base = cleanBaseUrl(baseUrl);

    const queryString =
      Object.keys(queryParams).length > 0
        ? "?" + new URLSearchParams(queryParams).toString()
        : "";

    const fullUrl = `${base}${path}${queryString}`;

    let curl = `curl -X ${method.toUpperCase()} "${fullUrl}"`;

    const normalizedMethod = method.toLowerCase();
    const supportsBody = BODY_METHODS.has(normalizedMethod);
    const hasBody =
      supportsBody &&
      body !== undefined &&
      body !== null &&
      !(typeof body === "string" && body.trim() === "");

    // Include a Content-Type header automatically when sending a JSON body,
    // unless the caller already specified one explicitly.
    const hasContentTypeHeader = Object.keys(headers).some(
      (key) => key.toLowerCase() === "content-type",
    );

    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        curl += ` \\\n  -H "${key}: ${value}"`;
      }
    });

    if (hasBody) {
      if (!hasContentTypeHeader) {
        curl += ` \\\n  -H "Content-Type: application/json"`;
      }

      const bodyString =
        typeof body === "string" ? body : JSON.stringify(body, null, 2);

      // Escape any double quotes so the payload stays valid inside the
      // single-quoted -d argument.
      const escapedBody = bodyString.replace(/'/g, `'\\''`);

      curl += ` \\\n  -d '${escapedBody}'`;
    }

    return curl;
  }, [method, baseUrl, path, queryParams, headers, body]);

  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        aria-expanded={isVisible}
        aria-controls="curl-command-section"
      >
        {isVisible ? "Hide cURL" : "Show cURL"}
      </button>

      {isVisible && (
        <div
          id="curl-command-section"
          className="rounded-lg border border-white/10 bg-black/40 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              cURL Command
            </p>
            <button
              onClick={() => onCopy(curlCommand)}
              className="rounded px-2 py-1 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Copy cURL command"
            >
              Copy
            </button>
          </div>

          <div className="overflow-x-auto">
            <code className="block whitespace-pre break-words font-mono text-xs text-emerald-400">
              {curlCommand}
            </code>
          </div>

          {/* Additional info */}
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-xs text-slate-500">
              Paste this command in your terminal to make the same request
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurlGenerator;
