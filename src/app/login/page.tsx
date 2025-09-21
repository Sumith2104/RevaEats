"use client";

import { useActionState, useEffect } from "react";
import { login } from "@/lib/auth-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { loginUser } = useCart();
  const router = useRouter();
  
  const initialState = { message: null, phone: null };
  const [state, dispatch] = useActionState(login, initialState);

  useEffect(() => {
    if (state.phone) {
      loginUser(state.phone);
      router.push('/menu');
    }
  }, [state, loginUser, router]);


  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Welcome</CardTitle>
          <CardDescription>
            Enter your phone number to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="9876543210"
                required
                type="tel"
              />
            </div>
            {state?.message && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <SubmitButton
              defaultText="Continue"
              loadingText="Please wait..."
              className="w-full"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}