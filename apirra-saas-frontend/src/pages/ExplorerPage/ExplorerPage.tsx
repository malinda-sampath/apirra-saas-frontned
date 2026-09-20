import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const endpoints: ParsedApiMethod[] = location.state?.endpoints || [];
  const baseUrl: string = location.state?.baseUrl || "";
  const [selected, setSelected] = useState<ParsedApiMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Guard against a hard refresh or a direct/back-button link landing here:
  // this page only makes sense with endpoints handed off via router state
  // from the HomePage loader, so send the user back to load a spec first.
  if (endpoints.length === 0) {
    return <Navigate to="/" replace />;
  }

  // Discards the loaded spec (it only ever lived in router state) and drops
  // the user back on the URL form to load a different one.
  const handleGoHome = () => navigate("/");
  const handleGoGetStarted = () => navigate("/#get-started");

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
      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <Sidebar
        endpoints={endpoints}
        onSelect={(ep) => {
          setSelected(ep);
          setSidebarOpen(false);
        }}
        selected={selected}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#05070d]/80 px-3 backdrop-blur-xl sm:h-18 sm:px-6">
          {/* LEFT SIDE */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="mr-1 flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white md:hidden"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <button
              onClick={handleGoHome}
              aria-label="Back to home"
              className="rounded-md transition hover:opacity-80"
            >
              <Logo />
            </button>
          </div>

          {/* RIGHT SIDE */}
          <button
            onClick={handleGoGetStarted}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 sm:text-sm"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">New Spec</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
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
