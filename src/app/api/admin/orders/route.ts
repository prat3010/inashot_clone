import { NextRequest, NextResponse } from 'next/server';
import { shippingService } from '@/services/adapters/shipping.adapter';

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status are required' }, { status: 400 });
    }

    const success = await shippingService.updateOrderStatus(orderId, status);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
