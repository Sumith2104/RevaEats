
"use client";

import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
        <div className="relative w-full aspect-[4/3]">
            <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={item.name.split(' ').slice(0, 2).join(' ')}
            />
        </div>
        <CardContent className="p-4 flex flex-col flex-grow">
            <h3 className="text-base font-bold flex-grow">{item.name}</h3>
            <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-extrabold text-primary">₹{item.price.toFixed(2)}</p>
                {quantity === 0 ? (
                <Button onClick={handleAdd} size="icon" className="rounded-full h-9 w-9">
                    <Plus className="h-5 w-5" />
                </Button>
                ) : (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-primary text-primary" onClick={handleDecrease}>
                        {quantity === 1 ? <Trash2 className="h-4 w-4 text-destructive" /> : <Minus className="h-4 w-4" />}
                    </Button>
                    <span className="font-bold w-5 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-primary text-primary" onClick={handleIncrease}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                )}
            </div>
        </CardContent>
    </Card>
  );
}
