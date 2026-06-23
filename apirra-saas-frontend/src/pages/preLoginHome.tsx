import UserInput from "../components/ApiExplorerPage/UserInput";
import { useState } from "react";
import type { OpenAPISpec } from "../types/openApiType";
import { fetchOpenApiSpec } from "../services/explorer/openApiService";
import { setExplorerBaseUrl } from "../services/explorer/explorerApi";

function PreLoginHome() {
  const [baseUrl, setBaseUrl] = useState("");
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);

  const handleViewSpec = async () => {
    setExplorerBaseUrl(baseUrl);

    const data = await fetchOpenApiSpec();

    setSpec(data);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Welcome to APIRRA
        </h2>

        <UserInput
          label="Base URL"
          placeholder="Enter your base URL"
          className="mb-4"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />

        <div className="flex space-x-4">
          <button
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={handleViewSpec}
          >
            View API Spec
          </button>

          <button
            className="w-full rounded-md px-4 py-2 text-sm font-medium text-black ring-1 ring-blue-700"
            onClick={() => {
              setBaseUrl("");
              setSpec(null);
            }}
          >
            Clear
          </button>
        </div>

        {spec && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              API Spec
            </h3>

            <textarea
              value={JSON.stringify(spec, null, 2)}
              readOnly
              style={{
                width: "100%",
                height: "250px",
                fontFamily: "monospace",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PreLoginHome;
