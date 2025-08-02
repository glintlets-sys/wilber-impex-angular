export interface User {
  id: string;
  mobile: string;
  firstName: string;
  lastName: string;
  email?: string;
  isNewUser: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: any;
  invoiceUrl?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  packagingType?: string;
} 