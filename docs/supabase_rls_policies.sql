-- Supabase RLS Policies for Campus Kitchen Express

-- Enable RLS for all relevant tables
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can read menu items.
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to menu items" ON public.menu_items;
-- Create new policy
CREATE POLICY "Allow public read access to menu items"
ON public.menu_items
FOR SELECT
TO anon, authenticated
USING (true);


-- 2. Anyone can create a user record (sign-up).
-- This is for the frictionless login where a user is created if they don't exist.
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public insert access to users" ON public.users;
-- Create new policy
CREATE POLICY "Allow public insert access to users"
ON public.users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- 3. Anyone can read their own user record.
-- Since we are not using Supabase Auth JWTs, we can't use auth.uid().
-- The query in the login action handles selecting the user, so a broad
-- select policy is acceptable for this completely open application model.
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to users" ON public.users;
-- Create new policy
CREATE POLICY "Allow public read access to users"
ON public.users
FOR SELECT
TO anon, authenticated
USING (true);


-- 4. Anyone can create orders.
-- The `placeOrder` action is public and does not depend on a logged-in user.
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public insert access to orders" ON public.orders;
-- Create new policy
CREATE POLICY "Allow public insert access to orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- 5. Anyone can create order items.
-- This is required by the `placeOrder` action.
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public insert access to order_items" ON public.order_items;
-- Create new policy
CREATE POLICY "Allow public insert access to order_items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
