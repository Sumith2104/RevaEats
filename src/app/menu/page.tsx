import { MenuItemCard } from '@/components/menu-item-card';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { MenuItem } from '@/lib/types';

export default async function MenuPage() {
  const supabase = createSupabaseServerClient();
  const { data: menuItems, error } = await supabase.from('menu_items').select('*').eq('is_available', true);

  if (error) {
    return <div className="text-center py-20">
      <h2 className="text-2xl font-semibold mb-4 font-headline text-destructive">Could not load menu</h2>
      <p className="text-muted-foreground">Please try again later. Error: {error.message}</p>
    </div>
  }
  
  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight lg:text-5xl">Our Menu</h1>
        <p className="mt-4 text-lg text-muted-foreground">Fresh, fast, and flavorful food, right on campus.</p>
      </header>
      {categories.map(category => (
        <section key={category} id={category.toLowerCase()}>
          <h2 className="text-3xl font-bold font-headline mb-6 border-b-2 border-primary pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(menuItems as MenuItem[])
              .filter(item => item.category === category)
              .map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
