export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  notes?: string;
}

export interface OrderData {
  type: 'delivery' | 'dine-in' | 'chatbot' | null;
  address?: string;
  phone?: string;
  tableNumber?: string;
  items: OrderItem[];
  total: number;
  language: 'en' | 'ar';
}

export interface OrderContextType {
  order: OrderData;
  updateOrderType: (type: 'delivery' | 'dine-in' | 'chatbot') => void;
  updateDeliveryInfo: (address: string, phone: string) => void;
  updateTableNumber: (tableNumber: string) => void;
  addItem: (item: Omit<OrderItem, 'quantity'>, quantity: number, notes?: string) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearOrder: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}
