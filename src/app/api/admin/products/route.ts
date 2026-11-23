import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function PATCH(request: NextRequest) {
  try {
    const { id, title, price, compareAtPrice, inStock } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
    }

    const updatePayload: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updatePayload.title = title;
    if (price !== undefined) {
      updatePayload.price = parseFloat(price);
      // Synchronize default bundle tier price in SQLite
      db.update(schema.bundleTiers)
        .set({
          price: parseFloat(price),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        })
        .where(
          and(
            eq(schema.bundleTiers.productId, id),
            eq(schema.bundleTiers.isDefault, true)
          )
        )
        .run();
    }
    if (compareAtPrice !== undefined) updatePayload.compareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : null;
    if (inStock !== undefined) updatePayload.inStock = Boolean(inStock);

    db.update(schema.products)
      .set(updatePayload)
      .where(eq(schema.products.id, id))
      .run();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
