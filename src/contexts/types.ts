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
  order_ID?: string; // ➕ ده اللي ضفناه
  customerName?: string;
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
  removeItem: (id: string, notes?: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearOrder: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  updateOrderID: (id: string) => void; // ➕ أضف دي هنا
  updateOrder: (updatedOrder: Partial<OrderData>) => void; // ➕ أضف دي هنا
  

}

