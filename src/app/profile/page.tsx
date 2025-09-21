import { getUserDetails, getOrderHistory } from "@/lib/auth-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, ShoppingBag, Edit, MapPin, Phone } from "lucide-react";
import { UpdateNameForm } from "./_components/update-name-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';

export default async function ProfilePage() {
  const { user, error: userError } = await getUserDetails();
  const { orders, error: ordersError } = await getOrderHistory();

  if (userError || !user) {
    return <p>Error loading user details: {userError}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold font-headline tracking-tight lg:text-5xl">
          Your Profile
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your details and view your order history.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <User className="w-6 h-6" /> Personal Details
          </CardTitle>
          <CardDescription>
            Your personal information and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">{user.phone}</span>
          </div>
          <UpdateNameForm currentName={user.name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <ShoppingBag className="w-6 h-6" /> Order History
          </CardTitle>
          <CardDescription>
            A list of all your past orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ordersError ? (
            <p className="text-destructive">{ordersError}</p>
          ) : orders && orders.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {orders.map((order) => (
                <AccordionItem value={order.id} key={order.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4 items-center">
                      <div className="text-left">
                        <p className="font-semibold">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                            {format(parseISO(order.order_time), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                       <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'} 
                              className={order.status === 'Completed' ? 'bg-green-600' : ''}>
                        {order.status}
                       </Badge>
                      <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-4 border-l-2 ml-2 py-2">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                           <span>{item.menu_items?.name} x <span className="font-bold">{item.quantity}</span></span>
                          <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p>You haven't placed any orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
