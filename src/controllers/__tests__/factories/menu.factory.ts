import { faker } from '@faker-js/faker';
import { MenuInterface } from 'menu-types';

/**
 * Importante necesitamos crear una BBDD para testing si no esto seguira fallando
 */

export const menu: MenuInterface = {
    id: faker.string.uuid(), 
    restaurant_id: "9dbdb6cb-3942-4c68-a26c-94fc4beec8fe",// Usamos un id de un restaurante real para que no falle mi test
    name: faker.commerce.productName(),
    dishes: [{
        name: faker.food.dish(),
        description: "preciosa comida",
        price: faker.number.float({ min: 10, max: 50, fractionDigits: 2 }),
        category: faker.food.ethnicCategory()
    }]
}

