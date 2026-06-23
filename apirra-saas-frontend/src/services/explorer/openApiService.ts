import axios from "axios";
import type { OpenAPISpec } from "../../types/openApiType";

export const fetchOpenApiSpec = async (
  baseUrl: string,
): Promise<OpenAPISpec> => {
  const client = axios.create({
    baseURL: baseUrl.replace(/\/$/, ""),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await client.get<OpenAPISpec>("/v3/api-docs");
  return response.data;
};
