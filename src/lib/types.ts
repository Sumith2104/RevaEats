import type { Database } from "./supabase/types";

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

// From: https://supabase.com/docs/guides/database/joins-and-nesting/javascript-joins-with-rpc#transforming-the-output
export type OrderWithItems = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    menu_items: Pick<Database['public']['Tables']['menu_items']['Row'], 'name'> | null;
  })[];
};
