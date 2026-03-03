import { faker } from '@faker-js/faker';
import { MenuInterface } from 'menu-types';


export const menu: MenuInterface = {
    id: faker.string.uuid(),
    restaurant_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    dishes: [{
        name: faker.food.dish(),
        description: faker.food.description(),
        price: faker.number.float({ min: 10, max: 50, fractionDigits: 2 }),
        category: faker.food.ethnicCategory()
    }]
}

