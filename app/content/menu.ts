import menu from "../../content/data/menu.json";

export type MenuItem = {
  title: string;
  url: string;
  external?: boolean;
  children?: MenuItem[];
};

export type MenuData = {
  items: MenuItem[];
};

export function getMenu(): MenuData {
  return menu as MenuData;
}




