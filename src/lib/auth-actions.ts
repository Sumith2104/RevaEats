"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  phone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian mobile number."
    ),
});

export async function login(prevState: any, formData: FormData) {
  const supabase = createSupabaseServerClient();
  const validatedFields = loginSchema.safeParse({
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.phone?.[0],
    };
  }

  const { phone } = validatedFields.data;

  try {
    // 1. Check if user exists, without throwing an error
    const { data: user, error: selectError } = await supabase
      .from("users")
      .select("phone")
      .eq("phone", phone)
      .maybeSingle();

    // Handle unexpected database errors during select
    if (selectError) {
      console.error("Supabase select error:", selectError);
      return { message: "Database error. Could not check user." };
    }

    // 2. If user does not exist, create them
    if (!user) {
      const { error: insertError } = await supabase
        .from("users")
        .insert({ name: "New User", phone: phone });

      // Handle unexpected database errors during insert
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return { message: "Database error. Could not create user." };
      }
    }
  } catch (error) {
    console.error("Unexpected error in login flow:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }

  // 3. Redirect to the menu on success
  redirect("/menu");
}
