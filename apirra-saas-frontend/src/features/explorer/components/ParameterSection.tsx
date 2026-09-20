import React from "react";
import type { OpenAPIV3 } from "openapi-types";
import ParameterInput from "./ParameterInput";

type ParameterSectionProps = {
  title: string;
  params: OpenAPIV3.ParameterObject[];
  paramValues: Record<string, string>;
  onParamChange: (paramName: string, value: string) => void;
  disabled?: boolean;
  loading?: boolean;
};

const ParameterSection: React.FC<ParameterSectionProps> = ({
  title,
  params,
  paramValues,
  onParamChange,
  disabled = false,
  loading = false,
}) => {
  if (params.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      {params.map((p, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/20"
        >
          <div className="flex flex-wrap items-center gap-2">
            <code className="font-mono text-sm font-semibold text-blue-300 break-all">
              {p.name}
            </code>
            {p.required && (
              <span className="rounded bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-300">
                REQUIRED
              </span>
            )}
            <div className="ml-auto flex gap-2">
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                {p.in}
              </span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                {(p.schema as OpenAPIV3.SchemaObject | undefined)?.type ??
                  "string"}
              </span>
            </div>
          </div>

          <ParameterInput
            param={p}
            value={paramValues[p.name] ?? ""}
            onChange={(value) => onParamChange(p.name, value)}
            disabled={disabled}
            loading={loading}
          />

          {p.description && (
            <p className="text-xs text-slate-400">{p.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParameterSection;
