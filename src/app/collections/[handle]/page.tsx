import { notFound } from 'next/navigation';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import CollectionBrowser from '@/components/CollectionBrowser';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { handle } = await params;

  const dbHandle =
    handle === 'roasted-edamame' ? 'nuts' : handle === 'seed-mix' ? 'edamame' : handle;

  // 1. Fetch collection info
  const collection = db
    .select()
    .from(schema.collections)
    .where(eq(schema.collections.handle, dbHandle))
    .get();

  let categoryFilter: string | null = null;
  let title = collection?.title || 'Collection';
  let description = collection?.description || null;

  if (handle === 'all') {
    categoryFilter = null;
    title = 'All Products';
  } else if (handle === 'combos') {
    categoryFilter = 'combo';
    title = 'Combos';
  } else if (handle === 'nuts' || handle === 'roasted-edamame') {
    categoryFilter = 'roasted-edamame';
    title = 'Roasted Edamame';
  } else if (handle === 'crunchy-edamame') {
    categoryFilter = 'crunchy-edamame';
    title = 'Crunchy Edamame';
  } else if (handle === 'edamame' || handle === 'seed-mix') {
    categoryFilter = 'seed-mix';
    title = 'Seed Mix';
  } else if (collection) {
    categoryFilter = collection.handle === 'combos' ? 'combo' : collection.handle;
    title = collection.title;
  } else {
    notFound();
  }

  // 2. Fetch products
  const rawProducts = categoryFilter
    ? db.select().from(schema.products).where(eq(schema.products.category, categoryFilter)).all()
    : db.select().from(schema.products).all();

  const formattedProducts = rawProducts.map((p) => {
    let parsedImages: string[] = [];
    try {
      parsedImages = JSON.parse(p.images);
    } catch {
      parsedImages = [p.featuredImage];
    }

    let parsedMacros = null;
    try {
      parsedMacros = p.macros ? JSON.parse(p.macros) : null;
    } catch {}

    return {
      id: p.id,
      handle: p.handle,
      title: p.title,
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      featuredImage: p.featuredImage,
      images: parsedImages,
      badge: p.badge,
      inStock: p.inStock,
      grams: p.grams || 270,
      description: p.description,
      macros: parsedMacros,
      ingredients: p.ingredients,
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <CollectionBrowser
        collectionTitle={title}
        collectionDescription={description}
        activeHandle={handle}
        products={formattedProducts}
      />
    </div>
  );
}
