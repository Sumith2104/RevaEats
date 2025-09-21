import { CheckCircle2 } from "lucide-react";
import { OrderStatusTracker } from "@/components/order-status-tracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderStatusPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="max-w-2xl mx-auto py-10">
        <Card className="shadow-lg">
            <CardHeader className="text-center">
                <div className="flex flex-col items-center gap-4 mb-2">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                    <CardTitle className="text-3xl font-extrabold font-headline">Order Confirmed!</CardTitle>
                </div>
                <CardDescription className="text-base">
                    Thank you for your order. We're getting it ready for you.
                </CardDescription>
                <p className="text-lg font-semibold pt-2">
                    Order ID: <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">{params.orderId}</span>
                </p>
            </CardHeader>
            <CardContent>
                <OrderStatusTracker />
            </CardContent>
        </Card>
    </div>
  );
}
