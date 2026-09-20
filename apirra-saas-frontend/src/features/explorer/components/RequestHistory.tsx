import React from "react";

export type HistoryItem = {
  timestamp: string;
  path: string;
  params: Record<string, string>;
};

type RequestHistoryProps = {
  history: HistoryItem[];
  onSelectRequest: (params: Record<string, string>) => void;
};

const RequestHistory: React.FC<RequestHistoryProps> = ({
  history,
  onSelectRequest,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Request History
      </h2>
      <div className="space-y-2">
        {history.map((req, idx) => (
          <button
            key={idx}
            onClick={() => onSelectRequest(req.params)}
            className="w-full rounded-lg bg-gray-50 p-3 text-left transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Restore request from ${req.timestamp}`}
          >
            <p className="text-xs font-medium text-gray-500">{req.timestamp}</p>
            <code className="block truncate text-sm font-mono text-gray-900">
              {req.path}
            </code>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RequestHistory;
