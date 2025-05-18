interface DishInterface {
  name: string;
  description?: string;
  price: number;
  category: string;
}

interface MenuInterface {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  dishes: DishInterface[];
}

export { MenuInterface ,DishInterface};
