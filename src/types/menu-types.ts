interface MenuInterface {
    id?: string;
    restaurant_id?: string;
    dish_name?: string;
    description?: string;
    price?:number;
    category?:string;
    [key: string]: any;
  }
  
  export { MenuInterface };
  