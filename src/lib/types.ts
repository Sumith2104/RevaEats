export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
};
