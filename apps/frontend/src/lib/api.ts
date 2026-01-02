const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * API client for backend communication
 */
class ApiClient {
    private baseUrl: string;
    private authToken: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setAuthToken(token: string) {
        this.authToken = token;
    }

    clearAuthToken() {
        this.authToken = null;
    }

    private async fetch<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Markets
    async getMarkets() {
        return this.fetch<any[]>('/api/markets');
    }

    async getMarket(marketId: string) {
        return this.fetch<any>(`/api/markets/${marketId}`);
    }

    async getOrderbook(marketId: string) {
        return this.fetch<any>(`/api/markets/${marketId}/orderbook`);
    }

    async getTrades(marketId: string, limit = 50) {
        return this.fetch<any[]>(`/api/markets/${marketId}/trades?limit=${limit}`);
    }

    // Positions
    async getPositions() {
        return this.fetch<any[]>('/api/positions');
    }

    async getOpenPositions() {
        return this.fetch<any[]>('/api/positions/open');
    }

    // Orders
    async createOrder(order: {
        marketId: string;
        side: 'LONG' | 'SHORT';
        type: 'MARKET' | 'LIMIT';
        size: string;
        price?: string;
        leverage: number;
    }) {
        return this.fetch<any>('/api/orders', {
            method: 'POST',
            body: JSON.stringify(order),
        });
    }

    async getOrders() {
        return this.fetch<any[]>('/api/orders');
    }

    async cancelOrder(orderId: string) {
        return this.fetch<any>(`/api/orders/${orderId}`, {
            method: 'DELETE',
        });
    }

    // Account
    async getAccountSummary() {
        return this.fetch<any>('/api/account/summary');
    }

    async getTradeHistory() {
        return this.fetch<any[]>('/api/account/trades');
    }
}

export const api = new ApiClient(API_URL);
