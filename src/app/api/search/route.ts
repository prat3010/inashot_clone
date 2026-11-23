import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const queryTerm = `%${q}%`;
  const matchingProducts = db
    .select({
      id: schema.products.id,
      title: schema.products.title,
      handle: schema.products.handle,
      price: schema.products.price,
      compareAtPrice: schema.products.compareAtPrice,
      featuredImage: schema.products.featuredImage,
      category: schema.products.category,
    })
    .from(schema.products)
    .where(
      or(
        like(schema.products.title, queryTerm),
        like(schema.products.description, queryTerm),
        like(schema.products.tags, queryTerm)
      )
    )
    .limit(8)
    .all();

  return NextResponse.json(matchingProducts);
}
