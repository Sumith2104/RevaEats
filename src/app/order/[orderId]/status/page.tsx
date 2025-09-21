import { getOrderDetails } from "@/lib/actions";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { OrderStatusTracker } from "@/components/order-status-tracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrderStatusPage({ params }: { params: { orderId: string } }) {
  const { order, error } = await getOrderDetails(params.orderId);

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center gap-4 mb-2">
              <AlertCircle className="w-16 h-16 text-destructive" />
              <CardTitle className="text-3xl font-extrabold font-headline">Order Not Found</CardTitle>
            </div>
            <CardDescription className="text-base">
              We couldn't retrieve your order details. Please check the order ID or try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 pt-4">
                  <p className="text-lg font-semibold">
                      Order ID: <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">{params.orderId}</span>
                  </p>
                  {order.order_otp && (
                    <p className="text-lg font-semibold">
                      Pickup OTP: <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">{order.order_otp}</span>
                    </p>
                  )}
                </div>
            </CardHeader>
            <CardContent>
                <OrderStatusTracker initialStatus={order.status} orderId={order.id} />
            </CardContent>
        </Card>
    </div>
  );
}
