"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\d{10}$/,
      "Please enter a valid 10-digit phone number."
    ),
});

export async function login(prevState: any, formData: FormData): Promise<{ message: string | null, phone?: string | null }> {
  const supabase = createSupabaseServerClient();
  const validatedFields = loginSchema.safeParse({
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.phone?.[0] || null,
    };
  }

  const { phone } = validatedFields.data;

  try {
    const { data: user, error: selectError } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone)
      .maybeSingle();

    if (selectError) {
      console.error("Supabase select error:", selectError);
      return { message: "Database error. Could not check user." };
    }

    if (!user) {
      const { error: insertError } = await supabase
        .from("users")
        .insert({ name: "New User", phone: phone });

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return { message: "Database error. Could not create user." };
      }
    }
    
    // On successful login/creation, we don't redirect from the server action anymore.
    // Instead, we return the phone number to the client to update the state.
    return { message: null, phone: phone };

  } catch (error) {
    console.error("Unexpected error in login flow:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}