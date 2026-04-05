import { Request, Response, NextFunction } from 'express';
import { beforeEach, describe, test, vi, expect } from 'vitest';
import { menu } from './factories/menu.factory';
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

    test('Validamos todas las reglas de validaciones de nuestro Schema', async () => {

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

    });

    // Necesitamos crear BBDD de prueba para testing , o de lo contrario seguira fallando nuestros menu
    test.skip('Creacion de objeto menu y comprobacion (LOGICA REAL)', async () => {

        /* TIP
            Usas mockImplementation cuando quieres reprogramar una función que otro código va a llamar. 
            Usas importActual a secas cuando tú quieres usar la función original como una herramienta dentro de tu archivo de test.
        */

        // Extraemos la lógica real del archivo original
        const actualModule = await vi.importActual('../../factory/menu-factory') as any;
        const nextMock = vi.mocked(next);
        // Inyectamos esa lógica real en el mock para este test específico
        vi.mocked(MenuFactory.createMenu).mockImplementation(actualModule.MenuFactory.createMenu);

        // Cargamos los datos del body
        req.body = menu;


        // Ejecutamos el Schema de express-validator (imprescindible si el controlador lo chequea)
        await Promise.all(
            MenuSchema.create.map((validation: any) => validation.run(req))
        );


        await MenuController.createMenu(req as Request, res as Response, next);



        if (nextMock.mock.calls.length > 0) {
            const errorDetectado = nextMock.mock.calls[0][0];
            console.error('❌ EL CONTROLADOR ENVIÓ UN ERROR A NEXT():');
            console.error(errorDetectado); // Aquí verás si es un error de Base de Datos, etc.

            // Forzamos el fallo del test con el mensaje descriptivo
            throw new Error(`Fallo en lógica real: ${errorDetectado}`);
        }


        // Verificamos el status 200
        expect(res.status).toHaveBeenCalledWith(200);

        // Verificamos el contenido del JSON
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Menú creado con éxito'
        }));

        // Log opcional para ver qué devolvió exactamente la Factory real
        console.log('✅ Respuesta exitosa recibida:', (res.json as any).mock.calls[0][0]);
    });
})