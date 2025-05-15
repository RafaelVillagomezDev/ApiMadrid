
import { MenuInterface } from 'menu-types';
import { Menu } from '../models/menu/menu-model';

class MenuFactory {
  static async createMenu(obj:MenuInterface ) {
    const menu = new Menu(obj);
    const rows = await menu.createMenu()
    return rows;
  }

}
export { MenuFactory };
