export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  imageHint: string;
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
};
