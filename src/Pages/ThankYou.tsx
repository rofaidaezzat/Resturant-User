import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Home,
  Loader2,
  AlertCircle,
  ChefHat,
  Package,
} from "lucide-react";
import { Button } from "../Components/UI/Button";
import { useTranslation } from "../utils/translations";
import { Card, CardContent } from "../Components/UI/card";
import { useOrder } from "../contexts/useOrder";
import { axiosInstance } from "../config/axios.config";
import { useState } from "react";

// Define the order status type
interface OrderStatus {
  status: string;
  orderId?: string;
  updatedAt?: string;
  // Add other properties that might come from your API
}

const ThankYou = () => {
  const navigate = useNavigate();
  const { order, clearOrder } = useOrder();
  const t = useTranslation(order.language);

  // State for order status tracking with proper typing
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch order status
  const fetchOrderStatus = async () => {
    // Debug logging
    console.log("Full Order object:", order);
    console.log("Order ID value:", order.order_ID);
    console.log("Order ID type:", typeof order.order_ID);
    console.log("Order ID exists:", !!order.order_ID);
    console.log("Order items:", order.items);
    console.log("Order total:", order.total);

    if (!order.order_ID || order.order_ID.trim() === "") {
      console.log("Order ID is missing, empty, or falsy");
      setStatusError(
        "Order ID not available - order may not have been submitted properly"
      );
      setStatusLoading(false);
      return;
    }

    try {
      console.log("Attempting to fetch status for order ID:", order.order_ID);
      const response = await axiosInstance.get(
        `webhook/get-status?orderId=${order.order_ID}`
      );
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);

      if (response.data && response.data.length > 0) {
        console.log("Order status found:", response.data[0]);
        setOrderStatus(response.data[0] as OrderStatus);
        setStatusError(null);
        setLastUpdated(new Date());
      } else {
        console.log("No order data returned from API");
        setStatusError("Order not found in system");
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setStatusError(
        `Failed to fetch order status: ${
          error.response?.status || "Network error"
        }`
      );
    } finally {
      setStatusLoading(false);
    }
  };

  // Auto-refresh status every 30 seconds
  // useEffect(() => {
  //   fetchOrderStatus();
  //   const interval = setInterval(fetchOrderStatus, 30000);
  //   return () => clearInterval(interval);
  // }, [order.order_ID]);

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return {
          icon: <Clock className="w-5 h-5 text-amber-600" />,
          text: "Order Received",
          description: "Your order is being processed",
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
      case "preparing":
        return {
          icon: <ChefHat className="w-5 h-5 text-blue-600" />,
          text: "Preparing",
          description: "Chef is preparing your order",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "ready":
        return {
          icon: <Package className="w-5 h-5 text-green-600" />,
          text: "Ready",
          description:
            order.type === "delivery"
              ? "Ready for delivery"
              : "Ready for pickup",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
          text: "Completed",
          description:
            order.type === "delivery"
              ? "Delivered successfully"
              : "Order completed",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-gray-600" />,
          text: "Processing",
          description: "Your order is being processed",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const handleNewOrder = () => {
    clearOrder();
    navigate("/");
  };

  const handleRefreshStatus = () => {
    setStatusLoading(true);
    fetchOrderStatus();
  };

  const statusInfo = orderStatus
    ? getStatusInfo(orderStatus.status)
    : getStatusInfo("processing");

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 ${
        order.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {t.thankYou}
          </h1>
          <p className="text-lg text-gray-600">{t.orderProcessing}</p>
        </div>

        {/* Order Details */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t.orderNumber}
              </h3>
              <div className="bg-gray-100 px-4 py-2 rounded-lg inline-block">
                <span className="text-2xl font-mono font-bold text-orange-600">
                  #{order.order_ID || "N/A"}
                </span>
              </div>
            </div>

            {/* Order Status Tracking */}
            <div
              className="mt-6 p-4 rounded-xl border-2 transition-all duration-300"
              style={{
                backgroundColor: statusInfo.bgColor,
                borderColor: statusInfo.borderColor,
              }}
            >
              <div className="flex items-center justify-center space-x-3 mb-3">
                {statusLoading ? (
                  <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                ) : statusError ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  statusInfo.icon
                )}
                <h4 className={`font-bold text-lg ${statusInfo.color}`}>
                  {statusError ? "Error" : statusInfo.text}
                </h4>
              </div>

              <p className={`text-sm ${statusInfo.color} opacity-80 mb-3`}>
                {statusError || statusInfo.description}
              </p>

              {/* Status Progress Bar */}
              {!statusError && orderStatus && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      orderStatus.status === "processing"
                        ? "bg-amber-500 w-1/4"
                        : orderStatus.status === "preparing"
                        ? "bg-blue-500 w-2/4"
                        : orderStatus.status === "ready"
                        ? "bg-green-500 w-3/4"
                        : orderStatus.status === "completed"
                        ? "bg-emerald-500 w-full"
                        : "bg-gray-400 w-1/4"
                    }`}
                  ></div>
                </div>
              )}

              {/* Refresh Button and Last Updated */}
              <div className="flex items-center justify-between text-xs text-gray-600">
                <button
                  onClick={handleRefreshStatus}
                  disabled={statusLoading}
                  className="flex items-center space-x-1 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  <Loader2
                    className={`w-3 h-3 ${statusLoading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
                {lastUpdated && (
                  <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-gray-600 mt-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Estimated preparation time: 15-20 minutes
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Type:</span>
                <span className="capitalize font-medium">
                  {order.type === "delivery" ? t.delivery : t.dineIn}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <div className="text-left space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 font-medium">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t">
                <span>{t.total}:</span>
                <span>
                  {t.price}
                  {order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleNewOrder}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            {t.newOrder}
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-4 w-16 h-16 bg-green-200/30 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-8 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default ThankYou;
