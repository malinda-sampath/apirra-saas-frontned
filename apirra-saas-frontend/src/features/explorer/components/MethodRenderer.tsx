import type { ParsedApiMethod, ExecutePayload } from "../types";
import DeleteMethod from "./methods/DeleteMethod";
import GetMethod from "./methods/GetMethod";
import PostMethod from "./methods/PostMethod";
import PutMethod from "./methods/PutMethod";

type Props = {
  endpoint: ParsedApiMethod;
  onExecute: (payload: ExecutePayload) => Promise<unknown>;
  loading?: boolean;
  baseUrl?: string;
};

const MethodRenderer: React.FC<Props> = ({
  endpoint,
  onExecute,
  loading,
  baseUrl,
}) => {
  switch (endpoint.method) {
    case "get":
      return (
        <GetMethod
          endpoint={endpoint}
          onExecute={onExecute}
          loading={loading}
          baseUrl={baseUrl ?? ""}
        />
      );
    case "post":
      return (
        <PostMethod
          endpoint={endpoint}
          onExecute={onExecute}
          loading={loading}
          baseUrl={baseUrl ?? ""}
        />
      );
    case "put":
      return (
        <PutMethod
          endpoint={endpoint}
          onExecute={onExecute}
          loading={loading}
          baseUrl={baseUrl ?? ""}
        />
      );
    case "delete":
      return (
        <DeleteMethod
          endpoint={endpoint}
          onExecute={onExecute}
          loading={loading}
          baseUrl={baseUrl ?? ""}
        />
      );
    default:
      return (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <p className="text-sm text-slate-400">
            Method <code className="font-mono">{endpoint.method}</code> is not
            yet supported.
          </p>
        </div>
      );
  }
};

export default MethodRenderer;
