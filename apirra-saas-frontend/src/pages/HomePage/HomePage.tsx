import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOpenApiSpec } from "../../features/explorer/api/openApiService";
import { parseOpenApi } from "../../features/explorer/utils/openApiParser";
import type { ParsedApiMethod } from "../../features/explorer/types";
import UserInput from "../../shared/components/UserInput";

// Hosted alongside this app (see public/test-doc.json) so anyone without
// their own OpenAPI-documented backend can still try every HTTP method.
// Its `paths` point at JSONPlaceholder, a public sandbox API, so requests
// must target that origin directly rather than the URL the spec itself was
// fetched from - see handleLoadDemo below.
const DEMO_SPEC_PATH = "/test-doc.json";
const DEMO_BASE_URL = "https://jsonplaceholder.typicode.com";

const HomePage = () => {
  const [baseUrl, setBaseUrlState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadExplorer = async (
    specUrl: string,
    requestBaseUrl: string,
    errorMessage: string,
  ) => {
    setError("");

    try {
      setLoading(true);

      const spec = await fetchOpenApiSpec(specUrl);

      // extra safety check (important)
      if (!spec) {
        throw new Error("Empty OpenAPI spec");
      }

      const parsed: ParsedApiMethod[] = parseOpenApi(spec);

      // only navigate if we actually got data
      if (parsed && parsed.length > 0) {
        navigate("/explorer", {
          state: {
            endpoints: parsed,
            baseUrl: requestBaseUrl,
          },
        });
      } else {
        throw new Error("No endpoints found in API spec");
      }
    } catch (err) {
      console.error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = () =>
    loadExplorer(
      baseUrl,
      baseUrl,
      "Failed to load API spec. Check the URL and try again.",
    );

  const handleLoadDemo = () =>
    loadExplorer(
      DEMO_SPEC_PATH,
      DEMO_BASE_URL,
      "Failed to load the demo API. Please try again.",
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            API<span className="text-blue-500">RRA</span>
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Explore your REST APIs instantly from an OpenAPI spec
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-blue-500" />

          <div className="p-8 space-y-5">
            {/* Input section */}
            <div>
              <UserInput
                label="OpenAPI Specification URL"
                placeholder="http://localhost:8081/v3/api-docs"
                value={baseUrl}
                onChange={(e) => setBaseUrlState(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLoad()}
              />

              <p className="mt-2 text-xs text-gray-400">
                Example: http://localhost:8081/v3/api-docs
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Button */}
            <button
              onClick={handleLoad}
              disabled={loading || !baseUrl.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Connecting…
                </>
              ) : (
                "Load API Explorer"
              )}
            </button>

            {/* Demo divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  or
                </span>
              </div>
            </div>

            {/* No environment? Try the demo spec */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="text-sm font-medium text-gray-800">
                Don&apos;t have an API to test with?
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Launch a ready-made demo spec that exercises GET, POST, PUT
                and DELETE against a public sandbox API — safe to experiment
                with freely, no backend of your own required.
              </p>

              <button
                onClick={handleLoadDemo}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Connecting…" : "Try the Demo API"}
              </button>

              <p className="mt-2 truncate text-[11px] text-gray-400">
                Demo spec:{" "}
                <code className="font-mono">
                  {window.location.origin}
                  {DEMO_SPEC_PATH}
                </code>
              </p>
            </div>

            {/* Footer hint */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-gray-400">
                Supports OpenAPI 3.x • Swagger 2.x • JSON endpoints
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
