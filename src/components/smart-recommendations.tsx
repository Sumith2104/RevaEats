"use client";

import { useState } from 'react';
import { Wand2, Loader2, PlusCircle } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { getSmartFoodRecommendations } from '@/ai/flows/smart-food-recommendations';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function SmartRecommendations() {
  const { cartItems, addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createSupabaseBrowserClient();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const currentCartItems = cartItems.map(ci => ci.item.name);
      const result = await getSmartFoodRecommendations({ cartItems: currentCartItems });
      
      const { data: allMenuItems, error: dbError } = await supabase.from('menu_items').select('*');

      if (dbError) throw dbError;

      const newRecommendations = result.recommendations.filter(
        rec => !currentCartItems.includes(rec) && allMenuItems.some(item => item.name === rec)
      ).map(recName => allMenuItems.find(item => item.name === recName)).filter(Boolean) as MenuItem[];


      setRecommendations(newRecommendations);
      if (newRecommendations.length > 0) {
        setIsDialogOpen(true);
      } else {
        toast({
          title: "You've got a great combo!",
          description: "No new recommendations to add at this time."
        });
      }
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      toast({
        variant: "destructive",
        title: "Oh no!",
        description: "Could not fetch smart recommendations. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecommendation = (itemToAdd: MenuItem) => {
    addToCart(itemToAdd);
    setRecommendations(prev => prev.filter(rec => rec.id !== itemToAdd.id));
  };

  return (
    <>
      <Button variant="outline" className="w-full bg-accent/50 hover:bg-accent text-accent-foreground" onClick={handleGetRecommendations} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Get Smart Recommendations
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">We think you'll love these!</DialogTitle>
            <DialogDescription>
              Based on your cart, here are a few suggestions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {recommendations.map(recItem => {
              if (!recItem) return null;
              
              return (
                <div key={recItem.id} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-secondary">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                       <Image src={recItem.image_url} alt={recItem.name} fill className="object-cover" data-ai-hint={recItem.name.split(' ').slice(0, 2).join(' ')} sizes="64px"/>
                    </div>
                    <div>
                      <h4 className="font-semibold">{recItem.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{recItem.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleAddRecommendation(recItem)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
