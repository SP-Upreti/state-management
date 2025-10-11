export interface OrderResponse {
    success: boolean;
    count: number;
    total: number;
    pagination: Pagination;
    data: {
        orders: Order[];
    };
}

export interface Pagination {
    page: number;
    limit: number;
    pages: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: string;
    discountedTotal: string;
    shippingCost: string;
    tax: string;
    totalProducts: number;
    totalQuantity: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentId: string | null;
    shippingAddress: string; // stored as JSON string
    billingAddress: string;  // stored as JSON string
    trackingNumber: string | null;
    estimatedDelivery: string;
    deliveredAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    userId: number;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    quantity: number;
    price: string;
    discountPercentage: string;
    discountedPrice: string;
    total: string;
    productSnapshot: string; // stored as JSON string
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    productId: number;
    orderId: number;
    product: Product;
}

export interface Product {
    id: number;
    title: string;
    thumbnail: string;
    brand: string;
}
