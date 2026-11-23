import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { paymentService } from '@/services/adapters/payment.adapter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      items,
      subtotal,
      shippingFee = 0,
      total,
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    const orderNumber = Math.floor(1050 + Math.random() * 8900);
    const orderId = `#INAS-${orderNumber}`;
    const timestamp = new Date().toISOString();

    // Insert order in local.db
    db.insert(schema.orders)
      .values({
        id: orderId,
        customerName,
        customerEmail: customerEmail || `${customerPhone.replace(/[^0-9]/g, '')}@demo.inashot.life`,
        customerPhone,
        address,
        city: city || 'New Delhi',
        state: state || 'Delhi',
        pincode: pincode || '110001',
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        orderStatus: 'Order Placed',
        subtotal: parseFloat(subtotal) || 0,
        shippingFee: parseFloat(shippingFee) || 0,
        total: parseFloat(total) || 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .run();

    // Insert order items
    for (const item of items) {
      db.insert(schema.orderItems)
        .values({
          id: `item-${orderNumber}-${Math.random().toString(36).substring(2, 7)}`,
          orderId,
          productId: item.productId,
          productTitle: item.productTitle,
          variantTitle: item.tierTitle || `Pack of ${item.packCount}`,
          packCount: item.packCount,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })
        .run();
    }

    // Process through Payment Adapter
    const paymentResult = await paymentService.processPayment(
      orderId,
      total,
      paymentMethod as 'UPI' | 'Card' | 'COD'
    );

    return NextResponse.json({
      success: true,
      orderId,
      paymentResult,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}
