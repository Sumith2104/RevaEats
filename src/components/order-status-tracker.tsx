"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { ChefHat, ShoppingBasket, PartyPopper } from "lucide-react";

type OrderStatus = 'New' | 'Preparing' | 'Ready for Pickup';

const statuses: OrderStatus[] = ['New', 'Preparing', 'Ready for Pickup'];

const statusDetails: Record<OrderStatus, { icon: React.ElementType; label: string; description: string }> = {
    'New': { icon: ShoppingBasket, label: 'Order Placed', description: 'We have received your order.' },
    'Preparing': { icon: ChefHat, label: 'Preparing', description: 'Our chefs are working their magic.' },
    'Ready for Pickup': { icon: PartyPopper, label: 'Ready for Pickup', description: 'Your order is ready. Come and get it!' },
};

export function OrderStatusTracker() {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('New');
  const { clearCart } = useCart();
  
  useEffect(() => {
    // Clear the cart when the user lands on the confirmation page.
    clearCart();
  }, [clearCart]);

  // Simulate real-time status updates
  useEffect(() => {
    const updateStatus = (nextStatus: OrderStatus) => {
      const delay = Math.random() * 5000 + 3000; // 3-8 seconds
      const timer = setTimeout(() => {
        setCurrentStatus(nextStatus);
      }, delay);
      return timer;
    };

    let timers: NodeJS.Timeout[] = [];
    if (currentStatus === 'New') {
      timers.push(updateStatus('Preparing'));
    } else if (currentStatus === 'Preparing') {
      timers.push(updateStatus('Ready for Pickup'));
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentStatus]);

  const currentStatusIndex = statuses.indexOf(currentStatus);

  return (
    <div className="pt-6">
        <div className="relative flex flex-col gap-10">
            <div className="absolute left-6 top-6 bottom-6 w-1 bg-border rounded-full -z-10" />
            {statuses.map((status, index) => {
                const isActive = index <= currentStatusIndex;
                const { icon: Icon, label, description } = statusDetails[status];

                return (
                    <div key={status} className="flex items-start gap-5">
                        <div className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full border-4 transition-colors duration-500 flex-shrink-0",
                            isActive ? "bg-primary border-primary/20" : "bg-card border-border",
                        )}>
                            <Icon className={cn("w-6 h-6", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                        </div>
                        <div className="pt-1">
                            <h3 className={cn("font-semibold text-lg transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>{label}</h3>
                            <p className={cn("text-sm transition-colors", isActive ? "text-muted-foreground" : "text-muted-foreground/70")}>{description}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  );
}
