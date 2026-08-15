export type ExecutePayload = {
  method: string;
  path: string;
  baseUrl: string;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  body?: unknown;
};
