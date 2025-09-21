"use server";

import { z } from 'zod';
import { createSupabaseServerClient } from './supabase/server';
import type { CartItem } from './types';
import type { Database } from './supabase/types';

const checkoutSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit phone number." }),
  cart: z.string() // JSON string of cart items
});

export async function placeOrder(formData: FormData): Promise<{ orderId?: string, error?: string }> {
  const rawFormData = Object.fromEntries(formData.entries());
  
  const validatedFields = checkoutSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.flatten().fieldErrors.phone?.[0] || 'Invalid data provided.';
    console.error("Server-side validation failed:", validatedFields.error);
    return { error: errorMessage };
  }
  
  const { phone, cart } = validatedFields.data;
  const cartItems: CartItem[] = JSON.parse(cart);
  const total = cartItems.reduce((acc, { item, quantity }) => acc + item.price * quantity, 0);

  const supabase = createSupabaseServerClient();

  try {
    // 1. Create a new `orders` record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        ordered_by_phone: phone,
        status: 'New',
        total: total,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Supabase order insert error:", orderError);
      return { error: "Could not create your order in the database." };
    }

    const orderId = orderData.id;

    // 2. Create `order_items` records for each item in the cart
    const orderItemsToInsert = cartItems.map(({ item, quantity }) => ({
      order_id: orderId,
      menu_item_id: item.id,
      quantity: quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      // In a real app, you might want to roll back the order creation here.
      console.error("Supabase order_items insert error:", itemsError);
      return { error: "Could not save order items to the database." };
    }

    return { orderId };

  } catch (error) {
    console.error("Unexpected error placing order:", error);
    return { error: "An unexpected error occurred while placing your order." };
  }
}

export async function getOrderStatus(phone: string): Promise<{ id: string, status: Database['public']['Enums']['order_status'] } | null> {
    if (!phone) {
        return null;
    }
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('orders')
        .select('id, status')
        .eq('ordered_by_phone', phone)
        .order('order_time', { ascending: false })
        .limit(1)
        .single();
    if (error || !data) {
        return null;
    }
    return data;
}
