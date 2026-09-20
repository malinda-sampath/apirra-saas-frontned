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
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Request History
      </h2>
      <div className="space-y-2">
        {history.map((req, idx) => (
          <button
            key={idx}
            onClick={() => onSelectRequest(req.params)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-blue-400/40 hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label={`Restore request from ${req.timestamp}`}
          >
            <p className="text-xs font-medium text-slate-500">{req.timestamp}</p>
            <code className="block truncate text-sm font-mono text-white">
              {req.path}
            </code>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RequestHistory;
