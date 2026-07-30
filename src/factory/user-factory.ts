
import { User } from '../models/user/user-model';
import { UserInterface } from '../types/user-type';



class UserFactory {
    static async createUser(obj: UserInterface):Promise<number> {
    const user = new User(obj);
    const rows = await user.createUser();
    return rows;
  }

}
export { UserFactory };
