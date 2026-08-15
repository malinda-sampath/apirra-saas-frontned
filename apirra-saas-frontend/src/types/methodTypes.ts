export type ApiMethod = {
  method: HttpMethod;
  path: string;
  operationId?: string;
  summary?: string;
  tags?: string[];
};

// Shared types for API endpoint tester components

export type Parameter = {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required?: boolean;
  description?: string;
  type?: string;
  schema?: {
    type?: string;
  };
};

export type ResponseObject = { description?: string };
export type Responses = Record<string, ResponseObject>;

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export type RequestDetails = {
  method: HttpMethod;
  path: string;
  baseUrl: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
};

export type ExecutePayload = {
  method: "get" | "post" | "put" | "delete" | "patch" | "head" | "options";
  path: string;
  baseUrl: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
};

export type ParsedApiMethod = {
  path: string;
  summary?: string;
  description?: string;
};
