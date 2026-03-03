import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'; // 1. Añadimos Mock para tipado
import { Request, Response, NextFunction } from 'express';
import AnonymusController from '../../controllers/anonymous-controller';
import { tokenSign } from '../../utils/handle-jwt';
import { faker } from '@faker-js/faker';
import { UserData } from 'jwt-type';
import jsonwebtoken from 'jsonwebtoken';

// 2. CORRECCIÓN DE RUTA: Debe coincidir exactamente con el import de arriba
vi.mock('../../utils/handle-jwt', () => ({
    tokenSign: vi.fn(), // me devuelve
    /*
      vi.fn()
      Crea un espía en una función, pero también puede iniciarse sin él. Cada vez que se invoca una función, almacena sus argumentos de llamada, retornos e instancias.
       Además, se puede manipular su comportamiento con métodos . 
      Si no se especifica ninguna función, mock retornará undefinedal invocarse.
    */
}));

vi.mock('jsonwebtoken');

describe('AnonymusController - loginAnonymous', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {};
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        next = vi.fn();
    });

    it('Comprobacion de tokenSign', async () => {


        vi.clearAllMocks(); //limpiamos

        // Recuperamos la implementación real de jsonwebtoken para este test
        // Ignora los mocks que he creado y dame el contenido original del archivo en esta ruta
        // Lo hacemos por que estamos ignorando arroba del todo tokenSign
        
        const { tokenSign: tokenSignReal } = await vi.importActual('../../utils/handle-jwt') as any;

        const fakeToken = 'header.payload.signature';
        (jsonwebtoken.sign as Mock).mockReturnValue(fakeToken);
        process.env.JWT_SECRET = 'secret-de-prueba';

        const dataPayload: UserData = {
            "id_user": faker.string.uuid(),
            "email": `${faker.person.firstName || faker.person.fullName}@api.com`,
            "jti": faker.string.sample(),
            "rol": faker.helpers.arrayElement(['no_cliente'])
        }

        const result = await tokenSignReal(dataPayload, process.env.JWT_SECRET, {
            expiresIn: '30m', // Duración del Token de Acceso
        });


        expect(jsonwebtoken.sign).toHaveBeenCalledWith(
            expect.objectContaining({
                rol: 'no_cliente',
                email: expect.stringMatching(/@api.com$/)
            }),
            'secret-de-prueba', // El secret key
            expect.any(Object)  // Las opciones como expiresIn
        );

        expect(result).toBe(fakeToken);

    });

    it('debería responder con 200 y un token cuando el login es exitoso', async () => {
        const mockToken = 'fake-jwt-token';
        // Usamos casting a Mock para evitar errores de TypeScript
        (tokenSign as Mock).mockResolvedValue(mockToken);

        await AnonymusController.loginAnonymous(
            req as Request,
            res as Response,
            next
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 200,
                data: { user: { token: mockToken } },
            })
        );
    });

    it('debería llamar a next(error) si algo falla (ej. falla el JWT)', async () => {
        const error = new Error('JWT Error');
        // 3. Ahora que la ruta coincide, mockRejectedValue funcionará
        (tokenSign as Mock).mockRejectedValue(error);

        await AnonymusController.loginAnonymous(
            req as Request,
            res as Response,
            next
        );


        expect(next).toHaveBeenCalledWith(expect.any(Error)); // esperamos cualquier error
        expect(res.status).not.toHaveBeenCalled();

        /*  Flujo
         
            En el Test: Inyectas el "veneno" con mockRejectedValue(error).
        
            En el Controlador: La línea del await tokenSign explota (lanza la excepción).
            
            En el Controlador: El bloque try se congela. El res.status(200) nunca se llega a leer.
            
            En el Controlador: El catch atrapa el error y llama a next(error).
            
            En el Test: Los expect confirman que next fue llamado y que res.status se quedó vacío.
        */
    });



});