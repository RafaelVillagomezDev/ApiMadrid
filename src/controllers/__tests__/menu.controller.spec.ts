import { Request, Response, NextFunction } from 'express';
import { beforeEach, describe, test, vi, expect } from 'vitest';
import { menu } from '../factories/menu.factory';
import { validationResult } from 'express-validator';
import { MenuSchema } from '../../schemas/menu-schema';
import { MenuFactory } from '../../factory/menu-factory';
import MenuController from '../menu-controller';


vi.mock('../../factory/menu-factory', () => ({
    MenuFactory: {
        createMenu: vi.fn() // Ahora es un espía que no hace nada real
    }
}));

describe('Test para Menu Controller', () => {

    let req: Partial<Request>;
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

    test('Creacion objeto menu y validacion mediante schema', async () => {

        vi.clearAllMocks(); //limpiamos

        req.body = menu; // LLamamos a nuestra factory

        /**A veces falla debido al nombre ya que la regex que tiene es muy estricta por ejemplo restaurante-paco falla 
         * Lo he  corregido 
         */

        // Ejecutamos el esquema contra nuestro objeto req
        // checkSchema devuelve un array de validaciones, por eso usamos el await Promise.all
        await Promise.all(
            MenuSchema.create.map((validation: any) => validation.run(req))
        );

        //  Obtenemos los resultados
        const errors = validationResult(req as Request);

        //  Logs para depuración
        if (!errors.isEmpty()) {
            console.log('❌ Errores encontrados:', JSON.stringify(errors.array(), null, 2));
        } else {
            console.log('✅ Validación exitosa');
        }

        // 5. Asertamos según lo que esperes (éxito en este caso)
        expect(errors.isEmpty()).toBe(true);

    })
    test('Creacion de objeto menu y comprobacion', async () => {
        const menuFake = menu;
        req.body = menuFake;

        vi.mocked(MenuFactory.createMenu).mockResolvedValue(menuFake as any);

        await MenuController.createMenu(req as Request, res as Response, next);

        // FIX: Asegúrate de pasar un número aquí, no el objeto
        expect(res.status).toHaveBeenCalledWith(200);
        // Aquí comparamos con lo que RECIBIMOS en el error anterior (el objeto con message)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Menú creado con éxito'
        }));
    });
})