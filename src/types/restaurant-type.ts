interface RestaurantInterface {
  id?: string;
  name?: string;
  address?: string;
  email?: string;
  description?: string | Text;
  phone?: string;
  type_food?: string[];
  web?: string;
  [key: string]: any;
  limit?: number;
  page?: number;
}

/**
 * El problema ocurre porque Record<string, unknown> de API RESPONSE INTERFACE implica que el objeto
 * puede tener cualquier clave de tipo string con valores de cualquier tipo (unknown),
 * mientras que RestaurantInterface tiene claves específicas y no acepta claves arbitrarias.
 */

interface RestaurantQueryInterface {
  name?: string;
  address?: string;
}

interface RestaurantRemoveQueryInterface {
  id: string;
}

interface RestaurantQueryPagination {
  id?: string;
  name?: string;
  address?: string;
  type_food?: string[];
  limit?: number;
  page?: number;
}
export {
  RestaurantInterface,
  RestaurantQueryInterface,
  RestaurantQueryPagination,
  RestaurantRemoveQueryInterface,
};
