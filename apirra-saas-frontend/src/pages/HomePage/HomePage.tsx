import { useEffect, useState, type JSX, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchOpenApiSpec } from "../../features/explorer/api/openApiService";
import { parseOpenApi } from "../../features/explorer/utils/openApiParser";
import type { ParsedApiMethod } from "../../features/explorer/types";
import UserInput from "../../shared/components/UserInput";
import Logo from "../../shared/components/Logo";

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
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500/20 to-violet-500/20 text-cyan-300 ring-1 ring-white/10">
      {icon}
    </div>
    <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
      {description}
    </p>
  </div>
);

const HomePage = () => {
  const [baseUrl, setBaseUrlState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Arriving via navigate("/#get-started") (e.g. from the Explorer page's
  // "New Spec" button) needs a manual scroll - the browser only does this
  // automatically on a full page load, not a client-side route change.
  useEffect(() => {
    if (!location.hash) return;

    document.querySelector(location.hash)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [location.hash]);

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
    <div className="min-h-screen bg-[#05070d]">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#05070d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 sm:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>
          </nav>
          <a
            href="#get-started"
            className="rounded-lg bg-linear-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_-6px_rgba(99,102,241,0.7)] transition hover:brightness-110"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* decorative grid + glow */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[-6rem] h-72 w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-4rem] top-24 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              100% client-side · no signup required
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Explore any REST API
              <br />
              <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                in seconds
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
              Apirra turns an OpenAPI or Swagger spec into a live, interactive
              workspace — browse every endpoint, send real requests, and
              inspect responses without leaving your browser.
            </p>
          </div>

          {/* Main Card */}
          <div
            id="get-started"
            className="relative mx-auto mt-10 w-full max-w-xl scroll-mt-24"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="h-1 bg-linear-to-r from-blue-500 via-cyan-400 to-violet-500" />

              <div className="space-y-5 p-5 sm:p-8">
                {/* Input section */}
                <div>
                  <UserInput
                    label="OpenAPI Specification URL"
                    placeholder="http://localhost:8081/v3/api-docs"
                    value={baseUrl}
                    onChange={(e) => setBaseUrlState(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLoad()}
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Example: http://localhost:8081/v3/api-docs
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={handleLoad}
                  disabled={loading || !baseUrl.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
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
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#0b0f1a] px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                      or
                    </span>
                  </div>
                </div>

                {/* No environment? Try the demo spec */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-sm font-medium text-white">
                    Don&apos;t have an API to test with?
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Launch a ready-made demo spec that exercises GET, POST, PUT
                    and DELETE against a public sandbox API — safe to
                    experiment with freely, no backend of your own required.
                  </p>

                  <button
                    onClick={handleLoadDemo}
                    disabled={loading}
                    className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? "Connecting…" : "Try the Demo API"}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              Supports OpenAPI 3.x • Swagger 2.x • JSON endpoints
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-16 border-t border-white/5 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Everything you need to test an API
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              No Postman collection to import, no Docker container to run.
              Just a spec URL and a browser tab.
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
        className="scroll-mt-16 border-t border-white/5 py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              How it works
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              From spec to your first request in three steps.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-white/10 sm:block" />
            <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
              {STEPS.map((item) => (
                <div key={item.step} className="text-center sm:text-left">
                  <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#05070d] ring-1 ring-white/10 sm:mx-0">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
            >
              Start exploring your API
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <Logo />
          <p className="text-xs text-slate-500">
            Apirra runs entirely in your browser — your API credentials and
            traffic never touch a server you don&apos;t control.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
