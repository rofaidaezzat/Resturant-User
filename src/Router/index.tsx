import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import OrderType from "../Pages/OrderType";
import Menu from "../Pages/Menu";
import OrderSummary from "../Pages/OrderSummary";
import ThankYou from "../Pages/ThankYou";
import Chatbot from "../Pages/Chatbot";
import NotFound from "../Pages/NotFound";
import Index from "../Pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/order-type" element={<OrderType />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/summary" element={<OrderSummary />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default router;
