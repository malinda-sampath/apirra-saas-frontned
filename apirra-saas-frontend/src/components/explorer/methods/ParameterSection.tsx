import React from "react";
import ParameterInput from "../ParameterInput";
import type { Parameter } from "../../../types/methodTypes";

type ParameterSectionProps = {
  title: string;
  params: Parameter[];
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
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
        {title}
      </h3>
      {params.map((p, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:border-gray-300"
        >
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm font-semibold text-blue-700">
              {p.name}
            </code>
            {p.required && (
              <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                REQUIRED
              </span>
            )}
            <div className="ml-auto flex gap-2">
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                {p.in}
              </span>
              <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                {p.schema?.type ?? p.type ?? "string"}
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
            <p className="text-xs text-gray-600">{p.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParameterSection;
