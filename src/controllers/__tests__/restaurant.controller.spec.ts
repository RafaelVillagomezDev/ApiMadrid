import { Request, Response, NextFunction } from "express";
import { describe, expect, vi, beforeEach, test } from "vitest";
import { restaurantFake } from "./factories/restaurant.factory";
import { RestaurantSchema } from "../../schemas/restaurant-schema";
import { validationResult } from "express-validator/lib";
import { RestaurantFactory } from "../../factory/restaurant-factory";


vi.mock("../../factory/restaurant-factory", () => ({
    // Retornamos un objeto que contiene la clase o constante Factory
    RestaurantFactory: {
        createRestaurant: vi.fn()
    }
}));


describe('Tests para restaurant Controller', () => {

    let req: Partial<Request>; // Transforma todo el objeto o campo en ocpional todos sus campos
    let res: Partial<Response>;
    let next: NextFunction;




    beforeEach(() => {
        vi.clearAllMocks();
        req = {
            body: {}
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),

        };
        next = vi.fn();
    });


    test('Validamos objeto restaurante', async () => {

        req.body = restaurantFake

        await Promise.all(
            RestaurantSchema.create.map((validation: any) => validation.run(req))
        );

        const errors = validationResult(req as Request);

        if (!errors.isEmpty()) {
            console.log('❌ Errores encontrados:', JSON.stringify(errors.array(), null, 2));
        } else {
            console.log('✅ Validación exitosa');
        }


        expect(errors.isEmpty()).toBe(true);
    });

    test('Validamos creacion de restaurante en BBDD', async () => {

        // Creamos el espía
        const spy = vi.spyOn(RestaurantFactory, 'createRestaurant');

        const data = restaurantFake;
        const result = await RestaurantFactory.createRestaurant(data);

        //  Validaciones (Asserts)
        // Primero verificamos que la función fue llamada con los datos correctos
        expect(spy).toHaveBeenCalledWith(data);

        // Verificamos que el resultado no sea nulo
        expect(result).toBeDefined();

        // Validamos que un campo específico coincida con lo que nos devuelve SQL es decir nuestra funcion RestaurantFactory.createRestaurant
        expect(result).toBe(1)

        // Limpieza: restauramos la función original , si no restauramos podria afectar al siguiente test
        spy.mockRestore();
    });


    test('Validamos creacion de coordenadas', async () => {

        const createMock = vi.mocked(RestaurantFactory.createRestaurant).mockResolvedValue(1);// Como devuelve promesa , usamos mockResolvedValue q es async

        const result = await RestaurantFactory.createRestaurant(restaurantFake);

        expect(createMock).toHaveBeenCalled();
        // VALIDAMOS 
        // En los tests no usamos "if", usamos "expect" para que el test falle si no se cumple
        expect(result).toBeGreaterThan(0);
        expect(result).toBe(1);
      
    });


})