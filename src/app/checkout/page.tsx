"use client";

import { useCart } from '@/hooks/use-cart';
import { CheckoutForm } from '@/components/checkout-form';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const router = useRouter();
  
  useEffect(() => {
    // Prevent access to checkout if cart is empty, redirect after a short delay
    if (cartCount === 0) {
      const timer = setTimeout(() => router.push('/menu'), 1000);
      return () => clearTimeout(timer);
    }
  }, [cartCount, router]);

  if (cartCount === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <h2 className="text-2xl font-semibold mb-4 font-headline">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Redirecting you to the menu...</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-8 text-center">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
                <h2 className="text-xl font-semibold mb-4 font-headline">Your Information</h2>
                <CheckoutForm />
            </div>
            <div>
                 <h2 className="text-xl font-semibold mb-4 font-headline">Order Summary</h2>
                 <Card>
                    <CardContent className="p-6 space-y-4">
                        {cartItems.map(({ item, quantity }) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" data-ai-hint={item.imageHint} sizes="64px"/>
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
        </div>
    </div>
  );
}
