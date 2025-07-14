import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { CheckCircle, Clock, Home } from "lucide-react";
import { Button } from "../Components/UI/Button";
import { useTranslation } from "../utils/translations";
import { Card, CardContent } from "../Components/UI/card";
import { useOrder } from "../contexts/useOrder";

const ThankYou = () => {
  const navigate = useNavigate();
  const { order, clearOrder } = useOrder();
  const t = useTranslation(order.language);
  const [orderNumber] = useState(() =>
    Math.random().toString(36).substr(2, 8).toUpperCase()
  );

  useEffect(() => {
    // Auto redirect after 30 seconds
    const timer = setTimeout(() => {
      handleNewOrder();
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleNewOrder = () => {
    clearOrder();
    navigate("/");
  };

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
                  #{orderNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-gray-600">
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
                <span className="font-medium">{order.items.length}</span>
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

          <p className="text-xs text-gray-500 text-center">
            You will be automatically redirected in 30 seconds
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-4 w-16 h-16 bg-green-200/30 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-8 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default ThankYou;
