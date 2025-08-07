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
import { useState, useEffect } from "react";

// Define the order status type
interface OrderStatus {
  status: string;
  orderId?: string;
  updatedAt?: string;
  order_ID?: string;
}

const ThankYou = () => {
  const navigate = useNavigate();
  const { order, clearOrder } = useOrder();
  const t = useTranslation(order.language);

  // State for order status tracking with proper typing
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false); // تغيير initial value لـ false
  const [statusError, setStatusError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch order status
  const fetchOrderStatus = async () => {
    console.log("=== fetchOrderStatus Function Called ===");

    // التحقق من وجود order_ID
    if (!order?.order_ID) {
      console.log("❌ No order ID available in fetchOrderStatus");
      setStatusError("Order ID not available");
      return;
    }

    // تنظيف order_ID من المسافات
    const cleanOrderId = order.order_ID.toString().trim();
    console.log("Clean Order ID:", cleanOrderId);

    if (!cleanOrderId) {
      console.log("❌ Order ID is empty after trimming");
      setStatusError("Order ID is empty");
      return;
    }

    // فحص axiosInstance
    console.log("Axios instance:", axiosInstance);
    console.log("Axios base URL:", axiosInstance.defaults.baseURL);

    try {
      setStatusLoading(true);
      setStatusError(null);

      console.log("🚀 Making API request...");
      console.log(
        "Request URL:",
        `/webhook/get-status?orderId=${encodeURIComponent(cleanOrderId)}`
      );
      console.log(
        "Full URL will be:",
        `${
          axiosInstance.defaults.baseURL
        }/webhook/get-status?orderId=${encodeURIComponent(cleanOrderId)}`
      );

      // محاولة الـ request مع تسجيل تفصيلي
      console.log("⏳ Sending request...");

      const response = await axiosInstance.get(
        `/webhook/get-status?orderId=${encodeURIComponent(cleanOrderId)}`
      );

      console.log("✅ Request completed successfully!");
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Response data:", response.data);

      // التحقق من الاستجابة
      if (response.status === 200 && response.data) {
        // إذا كان response.data array
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log("📦 Array response with data:", response.data[0]);
          setOrderStatus(response.data[0] as OrderStatus);
          setLastUpdated(new Date());
        }
        // إذا كان response.data object
        else if (
          !Array.isArray(response.data) &&
          typeof response.data === "object"
        ) {
          console.log("📦 Object response:", response.data);
          setOrderStatus(response.data as OrderStatus);
          setLastUpdated(new Date());
        } else {
          console.log("⚠️ No valid data in response");
          setStatusError("Order not found");
        }
      } else {
        console.log("❌ Invalid response status or no data");
        setStatusError("Failed to fetch order status");
      }
    } catch (error: any) {
      console.log("=== API Request Error ===");
      console.error("Full error object:", error);

      if (error.response) {
        console.error("❌ Server responded with error:");
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);

        switch (error.response.status) {
          case 404:
            setStatusError("Order not found");
            break;
          case 500:
            setStatusError("Server error - please try again later");
            break;
          case 400:
            setStatusError("Invalid order ID");
            break;
          default:
            setStatusError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error("❌ Network error - request was made but no response:");
        console.error("Request object:", error.request);
        console.error("Request readyState:", error.request.readyState);
        console.error("Request status:", error.request.status);
        setStatusError("Network error - check your connection");
      } else {
        console.error("❌ Error setting up request:");
        console.error("Error message:", error.message);
        setStatusError("Failed to fetch order status");
      }
    } finally {
      setStatusLoading(false);
      console.log("🏁 fetchOrderStatus completed");
    }
  };

  // useEffect للـ initial load والـ polling
  useEffect(() => {
    console.log("=== ThankYou Component useEffect Triggered ===");
    console.log("Full order object:", order);
    console.log("order.order_ID value:", order?.order_ID);
    console.log("order.order_ID type:", typeof order?.order_ID);
    console.log("order.order_ID exists:", !!order?.order_ID);

    // فحص شامل للـ order object
    if (!order) {
      console.log("❌ No order object found");
      setStatusError("No order data available");
      return;
    }

    if (!order.order_ID) {
      console.log("❌ No order_ID in order object");
      console.log("Available order keys:", Object.keys(order));
      setStatusError("Order ID missing from order data");
      return;
    }

    const cleanOrderId = order.order_ID.toString().trim();
    console.log("Cleaned order ID:", cleanOrderId);

    if (!cleanOrderId) {
      console.log("❌ Order ID is empty after cleaning");
      setStatusError("Order ID is empty");
      return;
    }

    console.log("✅ Order ID validation passed, calling fetchOrderStatus");

    // أول استدعاء مع timeout للتأكد
    setTimeout(() => {
      console.log("🚀 Initiating first fetchOrderStatus call");
      fetchOrderStatus();
    }, 100);

    // إعداد polling كل 30 ثانية
    const interval = setInterval(() => {
      console.log("⏰ Polling interval triggered");
      fetchOrderStatus();
    }, 30000);

    // تنظيف interval عند unmount أو تغيير order_ID
    return () => {
      console.log("🧹 Cleaning up polling interval");
      clearInterval(interval);
    };
  }, [order?.order_ID]);

  // Get status display info
  const getStatusInfo = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "";

    switch (normalizedStatus) {
      case "processing":
        return {
          icon: <Clock className="w-5 h-5 text-amber-600" />,
          text: "Order Received",
          description: "Your order is being processed",
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          progress: "25%",
        };
      case "preparing":
      case "pre":
        return {
          icon: <ChefHat className="w-5 h-5 text-blue-600" />,
          text: "Preparing",
          description: "Chef is preparing your order",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          progress: "50%",
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
          progress: "75%",
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
          progress: "100%",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-gray-600" />,
          text: "Unknown Status",
          description: "Checking order status...",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          progress: "0%",
        };
    }
  };

  const handleNewOrder = () => {
    clearOrder();
    navigate("/");
  };

  const handleRefreshStatus = () => {
    console.log("Manual refresh triggered");
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
              className={`mt-6 p-4 rounded-xl border-2 transition-all duration-300 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
            >
              <div className="flex items-center justify-center space-x-3 mb-3">
                {statusLoading ? (
                  <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                ) : statusError ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  statusInfo.icon
                )}
                <h4
                  className={`font-bold text-lg ${
                    statusError ? "text-red-600" : statusInfo.color
                  }`}
                >
                  {statusError ? "Error" : statusInfo.text}
                </h4>
              </div>

              <p
                className={`text-sm mb-3 ${
                  statusError ? "text-red-600" : statusInfo.color
                } opacity-80`}
              >
                {statusError || statusInfo.description}
              </p>

              {/* Status Progress Bar */}
              {!statusError && orderStatus && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500`}
                    style={{
                      width: statusInfo.progress,
                      backgroundColor: statusInfo.color.includes("amber")
                        ? "#f59e0b"
                        : statusInfo.color.includes("blue")
                        ? "#3b82f6"
                        : statusInfo.color.includes("green")
                        ? "#10b981"
                        : statusInfo.color.includes("emerald")
                        ? "#059669"
                        : "#6b7280",
                    }}
                  ></div>
                </div>
              )}

              {/* Refresh Button and Last Updated */}
              <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
                <button
                  onClick={handleRefreshStatus}
                  disabled={statusLoading}
                  className="flex items-center space-x-1 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 font-medium">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  )) || <span>No items</span>}
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t">
                <span>{t.total}:</span>
                <span>
                  {t.price}
                  {order.total?.toFixed(2) || "0.00"}
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
