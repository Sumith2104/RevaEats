"use client";

import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <div className="relative w-full h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          data-ai-hint={item.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline">{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-bold text-primary">₹{item.price.toFixed(2)}</p>
        <Button onClick={() => addToCart(item)} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
