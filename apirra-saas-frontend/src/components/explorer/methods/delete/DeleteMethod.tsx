import { useEffect, useState } from "react";
import ParameterSection from "../ParameterSection";
import CurlGenerator from "../CurlGenerator";
import ResponseDisplay from "../ResponseDisplay";
import RequestHistory from "../RequestHistory";
import type { HistoryItem } from "../RequestHistory";
import ToastContainer from "../ToastContainer";
import type {
  Parameter,
  ResponseObject,
  Responses,
  Toast,
  ExecutePayload,
  ParsedApiMethod,
} from "../../../../types/methodTypes";

type DeleteMethodProps = {
  endpoint: ParsedApiMethod & {
    parameters?: Parameter[];
    responses?: Responses;
  };
  onExecute: (payload: ExecutePayload) => Promise<unknown>;
  loading?: boolean;
  baseUrl: string;
};

const DeleteMethod: React.FC<DeleteMethodProps> = ({
  endpoint,
  onExecute,
  loading,
  baseUrl,
}) => {
  // State Management
  const [response, setResponse] = useState<unknown>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showCurl, setShowCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<"request" | "response">(
    "response",
  );
  const [requestHistory, setRequestHistory] = useState<HistoryItem[]>([]);
  const [confirmArmed, setConfirmArmed] = useState(false);

  // Constants
  const params = endpoint.parameters ?? [];
  const responses = endpoint.responses ?? {};

  // Group parameters by location
  const groupedParams = {
    path: params.filter((p) => p.in === "path"),
    query: params.filter((p) => p.in === "query"),
    header: params.filter((p) => p.in === "header"),
    cookie: params.filter((p) => p.in === "cookie"),
  };

  // ==================== Handlers ====================

  const addToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Copied to clipboard", "success");
  };

  const handleParamChange = (paramName: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [paramName]: value,
    }));
    // Any param edit re-arms the confirmation requirement
    setConfirmArmed(false);
  };

  const handleReset = () => {
    setParamValues({});
    setResponse(null);
    setConfirmArmed(false);
    addToast("Parameters cleared", "info");
  };

  const executeDelete = async () => {
    setIsRunning(true);
    setActiveTab("response");

    try {
      // Replace path parameters
      let finalPath = endpoint.path;

      groupedParams.path.forEach((p) => {
        finalPath = finalPath.replace(
          `{${p.name}}`,
          encodeURIComponent(paramValues[p.name] ?? ""),
        );
      });

      // Collect query parameters
      const queryParams = Object.fromEntries(
        groupedParams.query
          .map((p) => [p.name, paramValues[p.name]])
          .filter(([, value]) => value !== undefined && value !== ""),
      );

      const res = await onExecute({
        method: "delete",
        path: finalPath,
        baseUrl,
        queryParams,
        headers: {},
      });

      setResponse(res);

      // Add to history
      setRequestHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          path: finalPath,
          params: paramValues,
        },
        ...prev.slice(0, 9), // Keep last 10 requests
      ]);

      addToast("Request successful", "success");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Request failed";
      setResponse({
        success: false,
        error: errorMsg,
      });
      addToast(errorMsg, "error");
    } finally {
      setIsRunning(false);
      setConfirmArmed(false);
    }
  };

  const handleTry = async () => {
    // Validate required parameters
    const missing = params.find(
      (p) => p.required && !paramValues[p.name]?.trim(),
    );

    if (missing) {
      addToast(`${missing.name} is required`, "error");
      setResponse({
        success: false,
        error: `${missing.name} is required.`,
      });
      return;
    }

    // DELETE is destructive — require an explicit second click to confirm.
    if (!confirmArmed) {
      setConfirmArmed(true);
      addToast("Click again to confirm deletion", "info");
      return;
    }

    await executeDelete();
  };

  const handleRestoreFromHistory = (params: Record<string, string>) => {
    setParamValues(params);
    setConfirmArmed(false);
    addToast("Parameters restored", "info");
  };

  // ==================== Build Final Path for cURL ====================

  let finalPathForCurl = endpoint.path;
  groupedParams.path.forEach((p) => {
    finalPathForCurl = finalPathForCurl.replace(
      `{${p.name}}`,
      encodeURIComponent(paramValues[p.name] ?? ""),
    );
  });

  const queryParams = Object.fromEntries(
    groupedParams.query
      .map((p) => [p.name, paramValues[p.name]])
      .filter(([, value]) => value !== undefined && value !== ""),
  );

  const resetState = () => {
    setResponse(null);
    setParamValues({});
    setConfirmArmed(false);
    setActiveTab("request");
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      resetState();
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint.path]);
  // ==================== Render ==================

  return (
    <div className="mx-auto w-full max-w-auto space-y-6 p-4">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-linear-to-br from-white to-gray-50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold tracking-widest"
                style={{ background: "var(--color-delete, #ef4444)" }}
              >
                DELETE
              </span>
              <code className="truncate font-mono text-sm text-gray-900">
                {baseUrl}
                {endpoint.path}
              </code>
            </div>
            {endpoint.summary && (
              <p className="text-sm text-gray-600">{endpoint.summary}</p>
            )}
          </div>
        </div>
      </div>

      {/* Parameters Section */}
      {params.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Parameters</h2>
            <button
              onClick={handleReset}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
              disabled={
                isRunning || loading || Object.keys(paramValues).length === 0
              }
              aria-label="Clear all parameters"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-6">
            {groupedParams.path.length > 0 && (
              <ParameterSection
                title="Path Parameters"
                params={groupedParams.path}
                paramValues={paramValues}
                onParamChange={handleParamChange}
                disabled={isRunning}
                loading={loading}
              />
            )}
            {groupedParams.query.length > 0 && (
              <ParameterSection
                title="Query Parameters"
                params={groupedParams.query}
                paramValues={paramValues}
                onParamChange={handleParamChange}
                disabled={isRunning}
                loading={loading}
              />
            )}
            {groupedParams.header.length > 0 && (
              <ParameterSection
                title="Headers"
                params={groupedParams.header}
                paramValues={paramValues}
                onParamChange={handleParamChange}
                disabled={isRunning}
                loading={loading}
              />
            )}
            {groupedParams.cookie.length > 0 && (
              <ParameterSection
                title="Cookies"
                params={groupedParams.cookie}
                paramValues={paramValues}
                onParamChange={handleParamChange}
                disabled={isRunning}
                loading={loading}
              />
            )}
          </div>
        </div>
      )}

      {/* Responses Documentation */}
      {Object.keys(responses).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Response Status Codes
          </h2>
          <div className="space-y-2">
            {Object.entries(responses).map(
              ([code, resp]: [string, ResponseObject]) => {
                const isSuccess = code.startsWith("2");
                return (
                  <div
                    key={code}
                    className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                  >
                    <span
                      className="rounded px-2.5 py-0.5 text-xs font-bold text-white"
                      style={{
                        background: isSuccess
                          ? "var(--color-post, #3b82f6)"
                          : "var(--color-delete, #ef4444)",
                      }}
                    >
                      {code}
                    </span>
                    <p className="text-sm text-gray-700">
                      {resp.description ?? "No description"}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}

      {/* Request Execution Section */}
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        {confirmArmed && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            This will permanently delete the resource. Click{" "}
            <span className="font-semibold">Confirm Delete</span> to proceed.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleTry}
            disabled={loading || isRunning}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 sm:flex-none ${
              confirmArmed
                ? "bg-red-700 hover:bg-red-800"
                : "bg-red-600 hover:bg-red-700"
            }`}
            aria-label={
              isRunning
                ? "Sending request"
                : confirmArmed
                  ? "Confirm delete"
                  : "Send request"
            }
          >
            {loading || isRunning ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
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
            ) : confirmArmed ? (
              <>⚠ Confirm Delete</>
            ) : (
              <>▶ Send Request</>
            )}
          </button>

          {confirmArmed && !isRunning && (
            <button
              onClick={() => setConfirmArmed(false)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>

        {/* cURL Generator Component */}
        <CurlGenerator
          method="DELETE"
          baseUrl={baseUrl}
          path={finalPathForCurl}
          queryParams={queryParams}
          headers={{}}
          onCopy={copyToClipboard}
          isVisible={showCurl}
          onToggle={() => setShowCurl(!showCurl)}
        />

        {/* Response Display Component */}
        <ResponseDisplay
          response={response}
          baseUrl={baseUrl}
          path={finalPathForCurl}
          paramValues={paramValues}
          onCopy={copyToClipboard}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Request History Component */}
      <RequestHistory
        history={requestHistory}
        onSelectRequest={handleRestoreFromHistory}
      />

      {/* Toast Container Component */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default DeleteMethod;
