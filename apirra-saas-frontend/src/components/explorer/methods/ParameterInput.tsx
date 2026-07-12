import React from "react";
import type { Parameter } from "../../../types/methodTypes";

type ParameterInputProps = {
  param: Parameter;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
};

const ParameterInput: React.FC<ParameterInputProps> = ({
  param,
  value,
  onChange,
  disabled = false,
  loading = false,
}) => {
  const isDisabled = disabled || loading;

  if (param.schema?.type === "boolean") {
    return (
      <select
        className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        aria-label={`${param.name} input`}
      >
        <option value="">Select value</option>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  const isNumeric =
    param.schema?.type === "integer" || param.schema?.type === "number";

  return (
    <input
      type={isNumeric ? "number" : "text"}
      placeholder={param.description ?? `Enter ${param.name}`}
      className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
      required={param.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onWheel={isNumeric ? (e) => e.currentTarget.blur() : undefined}
      disabled={isDisabled}
      aria-label={`${param.name} input`}
    />
  );
};

export default ParameterInput;
