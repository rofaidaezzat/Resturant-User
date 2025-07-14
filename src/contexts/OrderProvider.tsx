import { useState, type ReactNode } from "react";
import { OrderContext } from "./OrderContext";
import type { OrderData, OrderItem } from "./types";

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<OrderData>({
    type: null,
    items: [],
    total: 0,
    language: "en",
  });

  const updateOrderType = (type: "delivery" | "dine-in" | "chatbot") => {
    setOrder((prev: OrderData) => ({ ...prev, type }));
  };

  const updateDeliveryInfo = (address: string, phone: string) => {
    setOrder((prev: OrderData) => ({ ...prev, address, phone }));
  };

  const updateTableNumber = (tableNumber: string) => {
    setOrder((prev: OrderData) => ({ ...prev, tableNumber }));
  };

  const addItem = (
    item: Omit<OrderItem, "quantity">,
    quantity: number,
    notes?: string
  ) => {
    setOrder((prev: OrderData) => {
      const existingItemIndex = prev.items.findIndex(
        (i) => i.id === item.id && i.notes === notes
      );
      let newItems;

      if (existingItemIndex >= 0) {
        newItems = [...prev.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [...prev.items, { ...item, quantity, notes }];
      }

      const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return {
        ...prev,
        items: newItems,
        total,
      };
    });
  };

  const removeItem = (id: string) => {
    setOrder((prev: OrderData) => {
      const newItems = prev.items.filter((item) => item.id !== id);
      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...prev,
        items: newItems,
        total,
      };
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setOrder((prev: OrderData) => {
      const newItems = prev.items
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...prev,
        items: newItems,
        total,
      };
    });
  };

  const clearOrder = () => {
    setOrder({
      type: null,
      items: [],
      total: 0,
      language: order.language,
    });
  };

  const setLanguage = (lang: "en" | "ar") => {
    setOrder((prev: OrderData) => ({ ...prev, language: lang }));
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        updateOrderType,
        updateDeliveryInfo,
        updateTableNumber,
        addItem,
        removeItem,
        updateItemQuantity,
        clearOrder,
        setLanguage,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
