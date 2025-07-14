import { createContext } from "react";
import type { OrderContextType } from "./types";

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);
