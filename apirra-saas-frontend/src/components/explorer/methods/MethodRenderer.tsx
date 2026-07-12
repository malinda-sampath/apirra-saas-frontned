import type { ParsedApiMethod } from "../../../utils/openApiParser";
import type { ExecutePayload } from "../../../types/executPayload";
// import DeleteMethod from "./delete/DeleteMethod";
import GetMethod from "./get/GetMethod";
import PostMethod from "./post/PostMethod";
import PutMethod from "./put/PutMethod";

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
          endpoint={endpoint as Parameters<typeof GetMethod>[0]["endpoint"]}
          onExecute={onExecute}
          loading={loading}
          baseUrl={baseUrl ?? ""}
        />
      );
    case "post":
      return (
        <PostMethod
          endpoint={endpoint as Parameters<typeof PostMethod>[0]["endpoint"]}
          onExecute={onExecute}
          loading={loading}
          baseUrl={baseUrl ?? ""}
        />
      );
    case "put":
      return (
        <PutMethod
          endpoint={endpoint as Parameters<typeof PutMethod>[0]["endpoint"]}
          onExecute={onExecute}
          loading={loading}
          baseUrl={baseUrl ?? ""}
        />
      );
    // case "delete":
    //   return <DeleteMethod endpoint={endpoint} onExecute={onExecute} />;
    // case "patch":  return <PatchMethod endpoint={endpoint} />;
    default:
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Method <code className="font-mono">{endpoint.method}</code> is not
            yet supported.
          </p>
        </div>
      );
  }
};

export default MethodRenderer;
