import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Minus,
  Plus,
  Trash2,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "../utils/translations";
import { useOrder } from "../contexts/useOrder";
import { Button } from "../Components/UI/Button";
import { Separator } from "../Components/UI/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../Components/UI/card";
import BackButton from "../Components/BackButton/BackButton";
import { axiosInstance } from "../config/axios.config";

const OrderSummary = () => {
  const { updateOrderID } = useOrder();

  const navigate = useNavigate();
  const { order, updateItemQuantity, removeItem } = useOrder();
  const t = useTranslation(order.language);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate("/menu");
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      toast.success("Item removed from order");
    } else {
      updateItemQuantity(itemId, newQuantity);
    }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);

    try {
      const orderData = {
        timestamp: new Date().toISOString(),
        orderType: order.type,
        customerInfo: {
          ...(order.type === "delivery" && {
            customerName: order.customerName,
            address: order.address,
            phone: order.phone,
          }),
          ...(order.type === "dine-in" &&
            order.tableNumber && {
              customerName: order.customerName,
              tableNumber: order.tableNumber,
            }),
        },
        items: order.items,
        total: order.total,
        language: order.language,
      };

      console.log("Order submitted:", orderData);

      // ✅ إرسال الطلب إلى الـ API
      const response = await axiosInstance.post("webhook/new-order", orderData);

      // ✅ تخزين الـ order_ID
      updateOrderID(response.data.order_ID);

      toast.success("Order confirmed successfully!");
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (order.items.length === 0) {
    return (
      <div
        className={`min-h-screen bg-gray-50 flex items-center justify-center ${
          order.language === "ar" ? "rtl" : "ltr"
        }`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your order is empty
          </h2>
          <Button onClick={() => navigate("/menu")}>Browse Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        order.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <BackButton onClick={handleBack} />
            <h1 className="text-2xl font-bold text-gray-900">
              {t.orderSummary}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Order Type Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {order.type === "delivery" ? (
                <>
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span>{t.delivery}</span>
                </>
              ) : (
                <>
                  <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                  <span>{t.dineIn}</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.type === "delivery" && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{order.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{order.phone}</span>
                </div>
              </div>
            )}
            {order.type === "dine-in" && order.tableNumber && (
              <p className="text-gray-700">Table: {order.tableNumber}</p>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item, index) => (
              <div key={`${item.id}-${index}`}>
                <div className="flex items-start space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        {item.notes && (
                          <p className="text-sm text-gray-600 italic">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id, item.notes)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              `${item.id}-${index}`,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              `${item.id}-${index}`,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {t.price}
                          {item.price} each
                        </p>
                        <p className="font-semibold text-gray-900">
                          {t.price}
                          {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {index < order.items.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Total */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>{t.total}:</span>
              <span className="text-orange-600">
                {t.price}
                {order.total.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 text-lg"
          >
            {isSubmitting ? t.loading : t.confirmOrder}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/menu")}
            className="w-full"
          >
            Add More Items
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
