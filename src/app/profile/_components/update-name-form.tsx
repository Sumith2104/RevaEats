"use client";

import { useActionState } from "react";
import { updateUserName } from "@/lib/auth-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";

export function UpdateNameForm({ currentName }: { currentName: string }) {
  const [state, dispatch] = useActionState(updateUserName, null);

  return (
    <form action={dispatch} className="flex items-end gap-4">
      <div className="flex-grow space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" name="name" defaultValue={currentName} />
      </div>
      <SubmitButton
        defaultText="Update"
        loadingText="Updating..."
        className="h-10"
      />
      {state?.error && (
        <Alert variant="destructive" className="mt-2">
          <Terminal className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state?.success && (
        <Alert className="mt-2 border-green-500 text-green-700">
           <CheckCircle className="h-4 w-4 text-green-700" />
           <AlertDescription>Name updated successfully!</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
