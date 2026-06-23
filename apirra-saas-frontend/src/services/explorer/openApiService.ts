import type { OpenAPISpec } from "../../types/openApiType";
import { explorerApi } from "./explorerApi";

export const fetchOpenApiSpec = async (): Promise<OpenAPISpec> => {
  const response = await explorerApi.get<OpenAPISpec>("/v3/api-docs");
  return response.data;
};
