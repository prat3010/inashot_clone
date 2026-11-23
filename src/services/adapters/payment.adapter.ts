import { IPaymentService, MockPaymentResult } from './types';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

export class MockPaymentAdapter implements IPaymentService {
  async processPayment(
    orderId: string,
    amount: number,
    method: 'UPI' | 'Card' | 'COD'
  ): Promise<MockPaymentResult> {
    const transactionId = `txn_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // Update order payment status in local.db
    try {
      db.update(schema.orders)
        .set({
          paymentMethod: method,
          paymentStatus: method === 'COD' ? 'PENDING' : 'PAID',
          updatedAt: timestamp,
        })
        .where(eq(schema.orders.id, orderId))
        .run();
    } catch (e) {
      console.error('Error updating order payment status in local.db:', e);
    }

    return {
      success: true,
      orderId,
      transactionId,
      paymentMethod: method,
      timestamp,
    };
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    return true;
  }
}

export const paymentService = new MockPaymentAdapter();
