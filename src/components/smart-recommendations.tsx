"use client";

import { useState } from 'react';
import { Wand2, Loader2, PlusCircle } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { getSmartFoodRecommendations } from '@/ai/flows/smart-food-recommendations';
import { menuItems as allMenuItems } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import Image from 'next/image';

export function SmartRecommendations() {
  const { cartItems, addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const currentCartItems = cartItems.map(ci => ci.item.name);
      const result = await getSmartFoodRecommendations({ cartItems: currentCartItems });
      
      const newRecommendations = result.recommendations.filter(
        rec => !currentCartItems.includes(rec) && allMenuItems.some(item => item.name === rec)
      );

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

  const handleAddRecommendation = (itemName: string) => {
    const itemToAdd = allMenuItems.find(item => item.name === itemName);
    if (itemToAdd) {
      addToCart(itemToAdd);
      setRecommendations(prev => prev.filter(rec => rec !== itemName));
    }
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
            {recommendations.map(recName => {
              const recItem = allMenuItems.find(item => item.name === recName);
              if (!recItem) return null;
              
              return (
                <div key={recItem.id} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-secondary">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                       <Image src={recItem.image} alt={recItem.name} fill className="object-cover" data-ai-hint={recItem.imageHint} sizes="64px"/>
                    </div>
                    <div>
                      <h4 className="font-semibold">{recItem.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{recItem.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleAddRecommendation(recItem.name)}>
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
