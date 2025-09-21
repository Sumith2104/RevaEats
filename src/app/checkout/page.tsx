"use client";

import { useCart } from '@/hooks/use-cart';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { placeOrder } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, user, clearCart } = useCart();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // If user is not logged in or cart is empty, redirect to menu
    if (!user.phone || cartCount === 0) {
      const timer = setTimeout(() => router.push('/menu'), 1000);
      return () => clearTimeout(timer);
    }
  }, [user, cartCount, router]);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const formData = new FormData();
      if(user.phone) {
        formData.append('phone', user.phone);
      }
      const cartString = JSON.stringify(cartItems);
      formData.append('cart', cartString);
      
      const result = await placeOrder(formData);
      
      if(result?.orderId) {
        toast({
          title: "Order Placed!",
          description: "Redirecting to your order status page.",
        });
        clearCart();
        
        router.push(`/order/${result.orderId}/status`);

      } else {
        throw new Error(result?.error || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Could not place your order. Please try again."
      });
    } finally {
      setIsPlacingOrder(false);
    }
  }

  if (!user.phone || cartCount === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-2xl font-semibold mb-4 font-headline">{!user.phone ? "Please log in to continue." : "Your cart is empty"}</h2>
            <p className="text-muted-foreground mb-4">Redirecting you to the menu...</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-8 text-center">Checkout</h1>
        <div className="grid gap-12 items-start">
            <div>
                 <h2 className="text-xl font-semibold mb-4 font-headline">Order Summary</h2>
                 <Card>
                    <CardContent className="p-6 space-y-4">
                        {cartItems.map(({ item, quantity }) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                    <Image src={item.image_url} alt={item.name} fill className="object-cover" data-ai-hint={item.name.split(' ').slice(0, 2).join(' ')} sizes="64px"/>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                                </div>
                                <p className="font-semibold">₹{(item.price * quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="border-t pt-4 space-y-2">
                             <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
            </div>
             <Button onClick={handlePlaceOrder} className="w-full" disabled={isPlacingOrder}>
              {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPlacingOrder ? 'Placing Order...' : 'Place Order & Pay'}
            </Button>
        </div>
    </div>
  );
}
