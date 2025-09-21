
"use client";

import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItem = cartItems.find(ci => ci.item.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addToCart(item);
  };

  const handleIncrease = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };


  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <div className="relative w-full h-24 sm:h-32 md:h-48">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 33vw, 33vw"
          className="object-cover"
          data-ai-hint={item.name.split(' ').slice(0, 2).join(' ')}
        />
      </div>
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="font-headline text-sm sm:text-base">{item.name}</CardTitle>
        <CardDescription className="hidden sm:block text-xs">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0" />
      <CardFooter className="flex-col sm:flex-row justify-between items-center p-2 sm:p-4">
        <p className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-0">₹{item.price.toFixed(2)}</p>
        
        {quantity === 0 ? (
          <Button onClick={handleAdd} size="sm">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrease}>
              {quantity === 1 ? <Trash2 className="h-4 w-4 text-destructive" /> : <Minus className="h-4 w-4" />}
            </Button>
            <span className="font-bold w-6 text-center">{quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleIncrease}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

      </CardFooter>
    </Card>
  );
}
