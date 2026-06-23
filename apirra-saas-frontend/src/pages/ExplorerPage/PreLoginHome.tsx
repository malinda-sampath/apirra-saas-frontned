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
      setError("");

      const spec = await fetchOpenApiSpec(baseUrl);

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
            baseUrl,
          },
        });
      } else {
        throw new Error("No endpoints found in API spec");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load API spec. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

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
                label="Base API URL"
                placeholder="http://localhost:8081/"
                value={baseUrl}
                onChange={(e) => setBaseUrlState(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLoad()}
              />

              <p className="mt-2 text-xs text-gray-400">
                Example: http://localhost:8081/ or https://api.yourservice.com/
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

export default PreLoginHome;
