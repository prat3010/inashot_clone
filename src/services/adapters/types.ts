export interface MockPaymentResult {
  success: boolean;
  orderId: string;
  transactionId: string;
  paymentMethod: 'UPI' | 'Card' | 'COD';
  timestamp: string;
}

export interface IPaymentService {
  processPayment(
    orderId: string,
    amount: number,
    method: 'UPI' | 'Card' | 'COD'
  ): Promise<MockPaymentResult>;
  verifyPayment(transactionId: string): Promise<boolean>;
}

export interface TrackingStep {
  status: 'Order Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  label: string;
  timestamp: string;
  completed: boolean;
  description: string;
}

export interface IShippingService {
  getTracking(orderId: string): Promise<TrackingStep[]>;
  updateOrderStatus(
    orderId: string,
    status: 'Order Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered'
  ): Promise<boolean>;
}

export interface IAuthService {
  requestOtp(phoneNumber: string): Promise<{ success: boolean; mockCode: string }>;
  verifyOtp(phoneNumber: string, code: string): Promise<{ success: boolean; token?: string }>;
}
