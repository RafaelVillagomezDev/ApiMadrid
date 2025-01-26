interface ApiResponseInterface<T = Record<string, unknown>> {
  message: string;
  data?: T | T[];
  code: number;
}


export { ApiResponseInterface };
