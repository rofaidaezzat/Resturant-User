import { Toaster as Sonner } from "./Components/UI/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { OrderProvider } from "./contexts/OrderProvider";
import { TooltipProvider } from "./Components/UI/tooltip";
import { Toaster } from "./Components/UI/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <>
    
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OrderProvider>
            <RouterProvider router={router} />
          </OrderProvider>
        </TooltipProvider>
      </QueryClientProvider>
      ;
    </>
  );
}

export default App;
