"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { getOrderStatus } from '@/lib/actions';
import type { Database } from '@/lib/supabase/types';
import { Loader2, PackageSearch } from 'lucide-react';
import Link from 'next/link';

export function LiveOrderStatus() {
  const { user } = useCart();
  const [order, setOrder] = useState<{ id: string, status: Database['public']['Enums']['order_status'] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user.phone) {
      setIsLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const latestOrder = await getOrderStatus(user.phone!);
        setOrder(latestOrder);
      } catch (error) {
        console.error("Failed to fetch order status:", error);
      } finally {
        if(isLoading) setIsLoading(false);
      }
    };

    fetchStatus(); // Initial fetch
    const interval = setInterval(fetchStatus, 1000); // Poll every 1 second

    return () => clearInterval(interval);
  }, [user.phone, isLoading]);
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">Loading status...</p>
        </div>
    );
  }

  if (!order) {
    return (
        <div className="flex flex-col items-center justify-center p-4 text-center">
             <PackageSearch className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-semibold">No active order</h3>
            <p className="text-sm text-muted-foreground">You don't have any recent orders.</p>
        </div>
    );
  }
  
  return (
    <div className="grid gap-4">
       <div className="space-y-2">
        <h4 className="font-medium leading-none">Live Order Status</h4>
        <p className="text-sm text-muted-foreground">
          Here's the latest update on your order.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm">
            Order ID: <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded-sm">{order.id}</span>
        </div>
        <div className="text-sm">
            Status: <span className="font-semibold text-primary">{order.status}</span>
        </div>
        <Link href={`/order/${order.id}/status`} className="text-sm text-primary hover:underline mt-2">
            View full order details
        </Link>
      </div>
    </div>
  );
}
