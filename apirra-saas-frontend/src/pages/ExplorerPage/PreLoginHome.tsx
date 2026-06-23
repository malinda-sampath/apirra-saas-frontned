import { useState } from "react";
import { fetchOpenApiSpec } from "../../services/explorer/openApiService";
import { parseOpenApi } from "../../utils/openApiParser";
import type { ParsedApiMethod } from "../../utils/openApiParser";
import UserInput from "../../components/explorer/UserInput";
import { useNavigate } from "react-router-dom";

const PreLoginHome = () => {
  const [baseUrl, setBaseUrlState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoad = async () => {
    setError("");

    try {
      setLoading(true);

      const spec = await fetchOpenApiSpec(baseUrl);
      const parsed: ParsedApiMethod[] = parseOpenApi(spec);

      // ✅ CORRECT: navigate with state
      navigate("/explorer", { state: { endpoints: parsed } });
    } catch (err) {
      console.error(err);
      setError("Failed to load API spec. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            API<span className="text-blue-500">RRA</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Paste an OpenAPI spec URL to explore your API
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4">
            <UserInput
              label="OpenAPI Spec URL"
              placeholder="https://petstore.swagger.io/v2/swagger.json"
              value={baseUrl}
              onChange={(e) => setBaseUrlState(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoad()}
            />
          </div>

          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
            onClick={handleLoad}
            disabled={loading || !baseUrl.trim()}
          >
            {loading ? (
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
                Loading…
              </>
            ) : (
              "Load API"
            )}
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Supports OpenAPI 3.x and Swagger 2.x
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreLoginHome;
