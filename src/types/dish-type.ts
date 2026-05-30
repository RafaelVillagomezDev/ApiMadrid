interface DishInterface {
    id: string;
    restaurant_id: string;
    menu_id?: string;
    name: string;
    price: number;
    description: string;
    category: 'entrantes' | 'principal' | 'postres' | 'bebidas';
}

export { DishInterface };