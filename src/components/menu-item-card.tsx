
"use client";

import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    <Card className="relative overflow-hidden aspect-[4/3] group">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          data-ai-hint={item.name.split(' ').slice(0, 2).join(' ')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-primary-foreground">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                     <h3 className="text-sm font-bold">{item.name}</h3>
                     <p className="text-base font-extrabold text-primary">₹{item.price.toFixed(2)}</p>
                </div>
                <div>
                    {quantity === 0 ? (
                        <Button onClick={handleAdd} size="icon" className="rounded-full h-9 w-9 bg-primary text-primary-foreground">
                            <Plus className="h-5 w-5" />
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full p-1">
                            <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 text-primary" onClick={handleDecrease}>
                                {quantity === 1 ? <Trash2 className="h-4 w-4 text-destructive" /> : <Minus className="h-4 w-4" />}
                            </Button>
                            <span className="font-bold w-5 text-center text-card-foreground">{quantity}</span>
                            <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 text-primary" onClick={handleIncrease}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Card>
  );
}

