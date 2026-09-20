import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../features/explorer/components/Sidebar";
import MethodRenderer from "../../features/explorer/components/MethodRenderer";
import { executeRequest } from "../../features/explorer/api/requestExecutor";
import type {
  ParsedApiMethod,
  ExecutePayload,
} from "../../features/explorer/types";
import Logo from "../../shared/components/Logo";

const ExplorerPage = () => {
  const location = useLocation();
  const endpoints: ParsedApiMethod[] = location.state?.endpoints || [];
  const baseUrl: string = location.state?.baseUrl || "";
  const [selected, setSelected] = useState<ParsedApiMethod | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async (payload: ExecutePayload) => {
    setLoading(true);

    try {
      const res = await executeRequest({
        baseUrl,
        method: payload.method,
        path: payload.path,
        queryParams: payload.queryParams,
        headers: payload.headers,
        body: payload.body,
      });

      return res;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const errorRes = { error: message };

      return errorRes;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#05070d]">
      <Sidebar
        endpoints={endpoints}
        onSelect={(ep) => setSelected(ep)}
        selected={selected}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-18 items-center border-b border-white/10 bg-[#05070d]/80 px-6 backdrop-blur-xl">
          {/* LEFT SIDE */}
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <Logo />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {selected ? (
            <MethodRenderer
              key={`${selected.method}-${selected.path}`}
              endpoint={selected}
              onExecute={handleExecute}
              loading={loading}
              baseUrl={baseUrl}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <svg
                  className="h-7 w-7 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-white">
                Select an endpoint
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Choose a route from the sidebar to inspect it
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExplorerPage;
