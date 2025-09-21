"use server";

import { z } from 'zod';
import { redirect } from 'next/navigation';

const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit phone number." }),
  cart: z.string() // JSON string of cart items
});

export async function placeOrder(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  
  const validatedFields = checkoutSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
    // In a real app with more complex state, you might return errors.
    // For this flow, we rely on client-side validation and the server action redirect.
    // A failed validation here implies a non-standard submission.
    console.error("Server-side validation failed:", validatedFields.error);
    // We could redirect back to checkout with an error query param.
    // For now, we'll just stop.
    return;
  }

  // In a real app, you would do the following with Supabase:
  // 1. Get the current user (if any)
  // 2. Parse `validatedFields.data.cart`
  // 3. Create a new `orders` record with user info, status 'New', and total price.
  // 4. Create `order_items` records for each item in the cart.
  // 5. Potentially, integrate with a payment gateway.

  // For this demo, we'll simulate a successful order and generate a random order ID.
  const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();

  // Redirect to the order status page
  redirect(`/order/${orderId}/status`);
}
