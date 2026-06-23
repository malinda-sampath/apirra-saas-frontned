import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import type { ParsedApiMethod } from "../../../utils/openApiParser";
import MethodRenderer from "../methods/MethodRenderer";

const ExplorerPage = () => {
  const location = useLocation();

  const endpoints: ParsedApiMethod[] = location.state?.endpoints || [];

  const [selected, setSelected] = useState<ParsedApiMethod | null>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        endpoints={endpoints}
        onSelect={setSelected}
        selected={selected}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b border-gray-200 bg-white px-6">
          <button
            onClick={() => window.history.back()}
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
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
          <h1 className="text-base font-semibold tracking-tight text-[28px] mt-2 mb-2 text-gray-900">
            API<span className="text-blue-500">RRA</span>
          </h1>
          {selected && (
            <div className="ml-6 flex items-center gap-2 text-sm text-gray-500">
              <span className="font-mono text-gray-700">{selected.path}</span>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {selected ? (
            <MethodRenderer endpoint={selected} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
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
              <p className="text-sm font-medium text-gray-700">
                Select an endpoint
              </p>
              <p className="mt-1 text-xs text-gray-400">
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
