"use client";

import { useFormState } from "react-dom";
import { login } from "@/lib/auth-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";

export default function LoginPage() {
  const initialState = { message: null };
  const [state, dispatch] = useFormState(login, initialState);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
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
