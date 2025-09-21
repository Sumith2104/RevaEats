"use client";

import Link from "next/link";
import { Flame, ShoppingCart, Bell, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Header() {
  const { cartCount } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate the cart badge whenever the cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/menu" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Flame className="w-7 h-7" />
          <h1 className="text-xl font-bold font-headline tracking-tight">
            Campus Kitchen Express
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" className="relative h-10 w-10 rounded-full">
            <Link href="#">
              <Bell className="w-6 h-6" />
              <span className="sr-only">View Notifications</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="relative h-10 w-10 rounded-full">
            <Link href="#">
              <User className="w-6 h-6" />
              <span className="sr-only">View Profile</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" className="relative h-10 w-10 rounded-full">
            <Link href="/cart">
              <ShoppingCart className="w-6 h-6" />
              <span className="sr-only">View Cart</span>
              {cartCount > 0 && (
                <span 
                  key={cartCount}
                  className={cn(
                    "absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold transform-gpu transition-transform",
                    isAnimating ? "scale-125" : "scale-100"
                  )}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
