interface ApiResponseInterface<T = Record<string, unknown>> {
  message: string;
  data?: T | T[];
  code: number;
  count?: number;
}

export { ApiResponseInterface };
