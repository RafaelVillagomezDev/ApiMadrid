interface RestaurantInterface {
  id: string;
  name: string;
  address: string;
  email: string;
  description:Text;
  [key: string]: any;
}

/**
 * El problema ocurre porque Record<string, unknown> de API RESPONSE INTERFACE implica que el objeto
 * puede tener cualquier clave de tipo string con valores de cualquier tipo (unknown),
 * mientras que RestaurantInterface tiene claves específicas y no acepta claves arbitrarias.
 */
export { RestaurantInterface };
