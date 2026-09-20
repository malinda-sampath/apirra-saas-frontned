import { useState, type JSX, type ReactNode } from "react";
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

const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.75}
  >
    {children}
  </svg>
);

const IconBolt = () => (
  <Icon>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"
    />
  </Icon>
);

const IconPlay = () => (
  <Icon>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.75 12 9.5 15.5v-7L14.75 12Z"
    />
    <circle cx="12" cy="12" r="9" strokeLinecap="round" />
  </Icon>
);

const IconCode = () => (
  <Icon>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9 8-4 4 4 4M15 8l4 4-4 4"
    />
  </Icon>
);

const IconTerminal = () => (
  <Icon>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m5 7 5 5-5 5M12 17h7"
    />
  </Icon>
);

const IconHistory = () => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.5 9A8.5 8.5 0 1 1 3 13.5M3.5 9V4M3.5 9h5"
    />
  </Icon>
);

const IconShield = () => (
  <Icon>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3.5 5 6v6c0 4.5 3 7 7 8.5 4-1.5 7-4 7-8.5V6l-7-2.5Z"
    />
  </Icon>
);

type Feature = { icon: JSX.Element; title: string; description: string };

const FEATURES: Feature[] = [
  {
    icon: <IconBolt />,
    title: "Zero setup",
    description:
      "Paste any OpenAPI or Swagger URL and start exploring in seconds — no install, no account, no config.",
  },
  {
    icon: <IconPlay />,
    title: "Try it out, for real",
    description:
      "Fill in parameters and a body, then fire an actual request straight from your browser and see what comes back.",
  },
  {
    icon: <IconCode />,
    title: "Smart example bodies",
    description:
      "POST, PUT and PATCH bodies are pre-filled from your schema, so you're never starting from a blank editor.",
  },
  {
    icon: <IconTerminal />,
    title: "Copy as cURL",
    description:
      "Every request you build can be copied as a ready-to-run cURL command for your terminal or docs.",
  },
  {
    icon: <IconHistory />,
    title: "Request history",
    description:
      "Every response is kept in a local history per endpoint, so you can compare runs and replay past requests.",
  },
  {
    icon: <IconShield />,
    title: "Private by design",
    description:
      "Requests go straight from your browser to your API. Nothing passes through a server you don't control.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Paste your spec URL",
    description:
      "OpenAPI 3.x, Swagger 2.x — any publicly reachable JSON spec works.",
  },
  {
    step: "02",
    title: "Browse your endpoints",
    description:
      "Every method, grouped by tag, in a searchable sidebar built for fast lookup.",
  },
  {
    step: "03",
    title: "Try it & inspect",
    description:
      "Send real requests and see status, headers and body come back instantly.",
  },
];

const FeatureCard = ({ icon, title, description }: Feature) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      {icon}
    </div>
    <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
      {description}
    </p>
  </div>
);

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
      A
    </div>
    <span className="text-lg font-bold tracking-tight text-gray-900">
      API<span className="text-blue-600">RRA</span>
    </span>
  </div>
);

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
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-500 sm:flex">
            <a href="#features" className="transition hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-gray-900">
              How it works
            </a>
          </nav>
          <a
            href="#get-started"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-50/70 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              100% client-side · no signup required
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Explore any REST API
              <br />
              <span className="text-blue-600">in seconds</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-gray-500 sm:text-lg">
              Apirra turns an OpenAPI or Swagger spec into a live, interactive
              workspace — browse every endpoint, send real requests, and inspect
              responses without leaving your browser.
            </p>
          </div>

          {/* Main Card */}
          <div
            id="get-started"
            className="mx-auto mt-10 w-full max-w-xl scroll-mt-24"
          >
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50">
              <div className="h-1 bg-linear-to-r from-blue-600 to-indigo-600" />

              <div className="space-y-5 p-8">
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
                  <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={handleLoad}
                  disabled={loading || !baseUrl.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="mt-3 w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Connecting…" : "Try the Demo API"}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Supports OpenAPI 3.x • Swagger 2.x • JSON endpoints
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-16 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Everything you need to test an API
            </h2>
            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              No Postman collection to import, no Docker container to run. Just
              a spec URL and a browser tab.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-16 border-t border-gray-100 bg-gray-50 py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              How it works
            </h2>
            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              From spec to your first request in three steps.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center sm:text-left">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white sm:mx-0">
                  {item.step}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Start exploring your API
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <Logo />
          <p className="text-xs text-gray-400">
            Apirra runs entirely in your browser — your API credentials and
            traffic never touch a server you don&apos;t control.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
