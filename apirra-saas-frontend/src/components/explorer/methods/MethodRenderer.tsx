import type { ParsedApiMethod } from "../../../utils/openApiParser";
import DeleteMethod from "./delete/DeleteMethod";
import GetMethod from "./get/GetMethod";
import PostMethod from "./post/PostMethod";
import PutMethod from "./put/PutMethod";

type Props = {
  endpoint: ParsedApiMethod;
};

const MethodRenderer: React.FC<Props> = ({ endpoint }) => {
  switch (endpoint.method) {
    case "get":
      return <GetMethod endpoint={endpoint} />;
    case "post":
      return <PostMethod endpoint={endpoint} />;
    case "put":
      return <PutMethod endpoint={endpoint} />;
    case "delete":
      return <DeleteMethod endpoint={endpoint} />;
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
