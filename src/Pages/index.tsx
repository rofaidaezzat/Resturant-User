import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../Components/UI/Button";
import { ChefHat } from "lucide-react";
import { useOrder } from "../contexts/useOrder";
import { useTranslation } from "../utils/translations";
import StartButton from "../Components/StartButton/StartButton";

const Index = () => {
  const navigate = useNavigate();
  const { order, setLanguage } = useOrder();
  const t = useTranslation(order.language);

  const handleStartOrder = () => {
    navigate("/order-type");
  };

  const toggleLanguage = () => {
    const newLang = order.language === "en" ? "ar" : "en";
    setLanguage(newLang);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col ${
        order.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          {order.language === "en" ? "العربية" : "English"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Restaurant Logo */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {t.restaurantName}
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {t.welcomeMessage}
          </p>
        </div>

        {/* Start Order Button */}
        <StartButton onclick={handleStartOrder}>{t.startOrder}</StartButton>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-100/50 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-4 w-16 h-16 bg-orange-200/30 rounded-full blur-xl" />
      <div className="absolute top-1/3 right-8 w-20 h-20 bg-red-200/30 rounded-full blur-xl" />
    </div>
  );
};

export default Index;
