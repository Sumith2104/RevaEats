"use client";

import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { SmartRecommendations } from '@/components/smart-recommendations';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4 font-headline">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/menu">Start Ordering</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold font-headline">Your Cart</h1>
        {cartItems.map(({ item, quantity }) => (
          <Card key={item.id} className="flex items-center p-4">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden flex-shrink-0">
              <Image src={item.image_url} alt={item.name} fill className="object-cover" data-ai-hint={item.name.split(' ').slice(0, 2).join(' ')} sizes="96px" />
            </div>
            <div className="flex-grow ml-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, quantity - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold w-6 text-center">{quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="ml-2 sm:ml-4">
                <p className="font-bold w-20 text-right">₹{(item.price * quantity).toFixed(2)}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.id)}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </Card>
        ))}
      </div>
      
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal ({cartCount} items)</span>
              <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <SmartRecommendations />
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
