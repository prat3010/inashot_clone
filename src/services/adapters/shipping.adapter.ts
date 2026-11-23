import { IShippingService, TrackingStep } from './types';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

const ALL_STATUSES: Array<'Order Placed' | 'Packed' | 'Shipped' | 'Out for Delivery'> = [
  'Order Placed',
  'Packed',
  'Shipped',
  'Out for Delivery',
];

export class MockShippingAdapter implements IShippingService {
  async getTracking(orderId: string): Promise<TrackingStep[]> {
    const order = db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .get();

    const currentStatus = order?.orderStatus || 'Order Placed';
    const createdAt = order?.createdAt || new Date().toISOString();
    const currentIndex = ALL_STATUSES.indexOf(currentStatus as any);

    return [
      {
        status: 'Order Placed',
        label: 'Order Placed',
        timestamp: createdAt,
        completed: currentIndex >= 0,
        description: 'Your order has been confirmed and sent to our fulfillment center.',
      },
      {
        status: 'Packed',
        label: 'Packed & Dispatched',
        timestamp: currentIndex >= 1 ? 'Within 2 hours' : 'Pending',
        completed: currentIndex >= 1,
        description: 'Fresh batch sealed and packed in eco-friendly protective cartons.',
      },
      {
        status: 'Shipped',
        label: 'In Transit with Express Courier',
        timestamp: currentIndex >= 2 ? 'In Transit' : 'Pending',
        completed: currentIndex >= 2,
        description: 'Handed over to BlueDart / Delhivery Express with live tracking.',
      },
      {
        status: 'Out for Delivery',
        label: 'Out for Delivery',
        timestamp: currentIndex >= 3 ? 'Today by 7:00 PM' : 'Pending',
        completed: currentIndex >= 3,
        description: 'Assigned to your local delivery partner for doorstep drop-off.',
      },
    ];
  }

  async updateOrderStatus(
    orderId: string,
    status: 'Order Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered'
  ): Promise<boolean> {
    const timestamp = new Date().toISOString();
    const result = db
      .update(schema.orders)
      .set({
        orderStatus: status,
        updatedAt: timestamp,
      })
      .where(eq(schema.orders.id, orderId))
      .run();

    return result.changes > 0;
  }
}

export const shippingService = new MockShippingAdapter();
