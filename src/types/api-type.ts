interface ApiResponseInterface<T = Record<string, unknown>> {
  message: string;
  data?: T | T[];
  code: number;
  count?: number;
  total_items?: number;
  page_items?: number;
  total_pages?: number;
}

export { ApiResponseInterface };
