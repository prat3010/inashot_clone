import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ordersList = db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).all();
    const productsList = db.select().from(schema.products).all();

    const totalRevenue = ordersList.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : 0), 0);
    const totalOrders = ordersList.length;
    const activeProducts = productsList.filter((p) => p.inStock).length;
    const outOfStockCount = productsList.filter((p) => !p.inStock).length;

    return NextResponse.json({
      kpi: {
        totalRevenue,
        totalOrders,
        activeProducts,
        outOfStockCount,
      },
      orders: ordersList,
      products: productsList,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
