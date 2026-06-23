import type { OpenAPIV3 } from "openapi-types";

/**
 * Allowed HTTP methods in OpenAPI
 */
export const httpMethods = [
  "get",
  "post",
  "put",
  "delete",
  "patch",
  "options",
  "head",
] as const;

export type HttpMethod = (typeof httpMethods)[number];

/**
 * UI-friendly API method model
 */
export type ParsedApiMethod = {
  path: string;
  method: HttpMethod;
  operationId?: string;
  summary?: string;
  description?: string;
  tags: string[];
  requestBody?: OpenAPIV3.RequestBodyObject;
  responses: Record<string, OpenAPIV3.ResponseObject>;
  parameters?: OpenAPIV3.ParameterObject[];
};

/**
 * Flatten OpenAPI paths into UI-ready methods
 */
export const parseOpenApi = (spec: OpenAPIV3.Document): ParsedApiMethod[] => {
  if (!spec?.paths) return [];

  const result: ParsedApiMethod[] = [];

  Object.entries(spec.paths).forEach(([path, pathItem]) => {
    if (!pathItem) return;

    const methods = extractMethods(path, pathItem);

    result.push(...methods);
  });

  return result;
};

/**
 * Extract all HTTP methods from a PathItem
 */
const extractMethods = (
  path: string,
  pathItem: OpenAPIV3.PathItemObject,
): ParsedApiMethod[] => {
  const methods: ParsedApiMethod[] = [];

  httpMethods.forEach((method) => {
    const operation = pathItem?.[method];

    if (!operation) return;

    methods.push({
      path,
      method,
      operationId: operation.operationId,
      summary: operation.summary,
      description: operation.description,
      tags: operation.tags || [],
      requestBody: operation.requestBody as OpenAPIV3.RequestBodyObject,
      responses:
        (operation.responses as Record<string, OpenAPIV3.ResponseObject>) || {},
      parameters: (operation.parameters as OpenAPIV3.ParameterObject[]) ?? [],
    });
  });

  return methods;
};
