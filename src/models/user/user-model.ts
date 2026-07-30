import { UserInterface } from '../../types/user-type';

import { pool } from '../../connection/bd';
import { ResultSetHeader } from 'mysql2';
import { createUser} from '../../queries/user-query';

const promisePool = pool.promise();

class User implements UserInterface {
  id?: string;
  email?: string;
  name?: string;
  surname?: string;
  password?: string | Text;
  role?: string;
  created_at?: string[];
  
  constructor({
    id,
    email,
    name,
    surname,
    password,
    role,
  }: UserInterface) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.role = role;
  }

   async createUser(): Promise<number> {
    const queryCreate = createUser();
    const [result] = await promisePool.query<ResultSetHeader>(queryCreate, [
      this.id,
      this.email,
      this.name,
      this.surname,
      this.password,
      this.role,
    ]);

    if (result.affectedRows === 0) {
      throw new Error('No se pudo crear el usuario');
    }

    return result.affectedRows;
  }

 
 
}

export { User };
