"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { placeOrder } from '@/lib/actions';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit Indian mobile number." }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutForm() {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      const cartString = JSON.stringify(cartItems);
      formData.append('cart', cartString);
      
      await placeOrder(formData);
      
      toast({
        title: "Order Placed!",
        description: "You will be redirected shortly.",
      });

      // The server action handles the redirect, but we clear the cart here.
      // This happens optimistically before the redirect completes.
      clearCart();

    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Could not place your order. Please try again."
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="9876543210" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>
    </Form>
  );
}
