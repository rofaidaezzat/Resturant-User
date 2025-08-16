import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Home,
  Loader2,
  AlertCircle,
  ChefHat,
  Package,
  X,
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
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // State for cancel functionality
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [orderCancelled, setOrderCancelled] = useState(false);

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

  // Function to cancel order
  const handleCancelOrder = async () => {
    console.log("=== handleCancelOrder Function Called ===");

    // التحقق من وجود order_ID
    if (!order?.order_ID) {
      console.log("❌ No order ID available for cancellation");
      setCancelError("Order ID not available");
      return;
    }

    // تنظيف order_ID من المسافات
    const cleanOrderId = order.order_ID.toString().trim();
    console.log("Clean Order ID for cancellation:", cleanOrderId);

    if (!cleanOrderId) {
      console.log("❌ Order ID is empty after trimming");
      setCancelError("Order ID is empty");
      return;
    }

    // التحقق من حالة الطلب - لا يمكن إلغاء الطلبات المكتملة
    if (orderStatus?.status === "completed") {
      setCancelError("Cannot cancel completed orders");
      return;
    }

    try {
      setCancelLoading(true);
      setCancelError(null);

      console.log("🚀 Making cancel API request...");

      // إعداد بيانات الإلغاء
      const cancelData = {
        orderId: cleanOrderId,
        newStatus: "cancelled",
      };

      console.log("Cancel request data:", cancelData);
      console.log("Request URL:", `/webhook/update-order`);

      // إرسال طلب الإلغاء
      const response = await axiosInstance.post(
        `/webhook/update-order`,
        cancelData
      );

      console.log("✅ Cancel request completed successfully!");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      // التحقق من الاستجابة
      if (response.status === 200 || response.status === 201) {
        console.log("🎉 Order cancelled successfully!");
        setOrderCancelled(true);

        // تحديث حالة الطلب محلياً
        setOrderStatus((prev) =>
          prev ? { ...prev, status: "cancelled" } : null
        );

        // إظهار رسالة نجح وإعادة توجيه بعد 3 ثواني
        setTimeout(() => {
          clearOrder();
          navigate("/");
        }, 3000);
      } else {
        console.log("❌ Invalid response status");
        setCancelError("Failed to cancel order");
      }
    } catch (error: any) {
      console.log("=== Cancel API Request Error ===");
      console.error("Full error object:", error);

      if (error.response) {
        console.error("❌ Server responded with error:");
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);

        switch (error.response.status) {
          case 404:
            setCancelError("Order not found");
            break;
          case 400:
            setCancelError("Cannot cancel this order");
            break;
          case 500:
            setCancelError("Server error - please try again later");
            break;
          default:
            setCancelError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error("❌ Network error - request was made but no response:");
        setCancelError("Network error - check your connection");
      } else {
        console.error("❌ Error setting up request:");
        console.error("Error message:", error.message);
        setCancelError("Failed to cancel order");
      }
    } finally {
      setCancelLoading(false);
      console.log("🏁 handleCancelOrder completed");
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

    // إعداد polling كل 30 ثانية (فقط إذا لم يتم إلغاء الطلب)
    const interval = setInterval(() => {
      if (!orderCancelled) {
        console.log("⏰ Polling interval triggered");
        fetchOrderStatus();
      }
    }, 30000);

    // تنظيف interval عند unmount أو تغيير order_ID
    return () => {
      console.log("🧹 Cleaning up polling interval");
      clearInterval(interval);
    };
  }, [order?.order_ID, orderCancelled]);

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
      case "cancelled":
        return {
          icon: <X className="w-5 h-5 text-red-600" />,
          text: "Cancelled",
          description: "Order has been cancelled",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          progress: "0%",
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
    if (!orderCancelled) {
      fetchOrderStatus();
    }
  };

  const statusInfo = orderStatus
    ? getStatusInfo(orderStatus.status)
    : getStatusInfo("processing");

  // Check if order can be cancelled
  const canCancelOrder =
    orderStatus?.status !== "completed" &&
    orderStatus?.status !== "cancelled" &&
    !orderCancelled;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 ${
        order.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-md w-full">
        {/* Success Animation or Cancellation Message */}
        <div className="text-center mb-8">
          {orderCancelled ? (
            <>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <X className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-red-600 mb-3">
                Order Cancelled
              </h1>
              <p className="text-lg text-gray-600">
                Your order has been successfully cancelled. Redirecting to
                home...
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {t.thankYou}
              </h1>
              <p className="text-lg text-gray-600">{t.orderProcessing}</p>
            </>
          )}
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
              {!statusError &&
                orderStatus &&
                orderStatus.status !== "cancelled" && (
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
              {!orderCancelled && (
                <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
                  <button
                    onClick={handleRefreshStatus}
                    disabled={statusLoading}
                    className="flex items-center space-x-1 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Loader2
                      className={`w-3 h-3 ${
                        statusLoading ? "animate-spin" : ""
                      }`}
                    />
                    <span>Refresh</span>
                  </button>
                  {lastUpdated && (
                    <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                  )}
                </div>
              )}
            </div>

            {!orderCancelled && (
              <div className="flex items-center justify-center space-x-2 text-gray-600 mt-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Estimated preparation time: 15-20 minutes
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cancel Error Display */}
        {cancelError && (
          <Card className="mb-4 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{cancelError}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4">
              {/* Order Type */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Order Type:</span>
                <span className="capitalize font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {order.type === "delivery" ? t.delivery : t.dineIn}
                </span>
              </div>

              {/* Items List */}
              <div>
                <span className="text-gray-600 mb-3 block">Items:</span>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {item.name}
                        </span>
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      {item.notes && (
                        <div className="text-xs text-gray-500 italic bg-white px-2 py-1 rounded border-l-2 border-orange-300">
                          Note: {item.notes}
                        </div>
                      )}
                      <div className="text-right text-sm text-gray-600">
                        {t.price}
                        {item.price} each
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-gray-500 py-4">
                      No items found
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold text-orange-600 pt-4 border-t border-gray-200">
                <span>{t.total}:</span>
                <span className="text-2xl">
                  {t.price}
                  {order.total?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {!orderCancelled && (
          <div className="space-x-3 flex flex-col sm:flex-row space-y-3 sm:space-y-0">
            <Button
              onClick={handleCancelOrder}
              disabled={cancelLoading || !canCancelOrder}
              className={`w-full font-semibold py-3 ${
                canCancelOrder
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {cancelLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </>
              )}
            </Button>
            <Button
              onClick={handleNewOrder}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              {t.newOrder}
            </Button>
          </div>
        )}

        {/* If order is cancelled, show only new order button */}
        {orderCancelled && (
          <div className="flex justify-center">
            <Button
              onClick={handleNewOrder}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              {t.newOrder}
            </Button>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-4 w-16 h-16 bg-green-200/30 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-8 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default ThankYou;
