import { IAuthService } from './types';

export class MockAuthAdapter implements IAuthService {
  async requestOtp(phoneNumber: string): Promise<{ success: boolean; mockCode: string }> {
    return {
      success: true,
      mockCode: '123456',
    };
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<{ success: boolean; token?: string }> {
    if (code === '123456' || code.length === 6) {
      return {
        success: true,
        token: `mock_jwt_${Buffer.from(phoneNumber).toString('base64')}`,
      };
    }
    return {
      success: false,
    };
  }
}

export const authService = new MockAuthAdapter();
