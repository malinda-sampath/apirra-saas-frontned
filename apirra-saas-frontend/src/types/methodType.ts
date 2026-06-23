export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export type ApiMethod = {
  method: HttpMethod;
  path: string;
  operationId?: string;
  summary?: string;
  tags?: string[];
};
