import { fakerES as faker } from '@faker-js/faker';
import { RestaurantInterface } from "restaurant-type";


export const restaurantFake: RestaurantInterface = {
    id: faker.string.uuid(),
    name: "test",
    address:faker.location.direction(),
    email: faker.internet.email(),
    description: faker.lorem.text(),
    phone: faker.helpers.fromRegExp(/6[0-9]{8}/),
    type_food:faker.helpers.arrayElement(['española', 'japonesa', 'china', 'turca']),
    web: faker.internet.url({appendSlash:false}),
    limit: 0,
    offset: 1
}