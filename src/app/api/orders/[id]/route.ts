import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, or } from 'drizzle-orm';
import { shippingService } from '@/services/adapters/shipping.adapter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id).trim();

    // Flexible lookup by Order ID (with or without #, or numeric suffix) or Phone Number
    const idWithHash = decodedId.startsWith('#') ? decodedId : `#${decodedId}`;
    const idWithoutHash = decodedId.replace(/^#/, '');
    const cleanDigits = decodedId.replace(/[^0-9]/g, '');

    const allOrders = db.select().from(schema.orders).all();
    const order = allOrders.find((o) => {
      const dbIdUpper = o.id.toUpperCase();
      const queryUpper = decodedId.toUpperCase();
      const withHashUpper = idWithHash.toUpperCase();
      const withoutHashUpper = idWithoutHash.toUpperCase();

      // Direct order ID matches
      if (
        dbIdUpper === queryUpper ||
        dbIdUpper === withHashUpper ||
        dbIdUpper.replace(/^#/, '') === withoutHashUpper
      ) {
        return true;
      }

      // Suffix number match (e.g. '1042' matches '#INAS-1042')
      if (cleanDigits.length >= 4 && o.id.includes(cleanDigits)) {
        return true;
      }

      // Phone number match (exact, stripped digits, or substring)
      if (o.customerPhone.trim() === decodedId) {
        return true;
      }
      const dbPhoneDigits = o.customerPhone.replace(/[^0-9]/g, '');
      if (cleanDigits.length >= 7 && (dbPhoneDigits.includes(cleanDigits) || cleanDigits.includes(dbPhoneDigits))) {
        return true;
      }

      return false;
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get order items
    const items = db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id))
      .all();

    // Get 4-step tracking timeline via ShippingAdapter
    const trackingSteps = await shippingService.getTracking(order.id);

    return NextResponse.json({
      order,
      items,
      trackingSteps,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
