import { UserInterface } from '../../types/user-type';

import { pool } from '../../connection/bd';
import { ResultSetHeader } from 'mysql2';

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
    created_at,
  }: UserInterface) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.password = password;
    this.role = role;
    this.created_at = created_at;
  }

 
}

export { User };
