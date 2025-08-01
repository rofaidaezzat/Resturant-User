import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, UtensilsCrossed, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useOrder } from "../contexts/useOrder";
import { Button } from "../Components/UI/Button";
import { Input } from "../Components/UI/Input";
import { Label } from "../Components/UI/label";
import { Card, CardContent } from "../Components/UI/card";
import { useTranslation } from "../utils/translations";
import ContinueButton from "../Components/ContinueButton/ContinueButton";
import BackButton from "../Components/BackButton/BackButton";

const OrderType = () => {
  const navigate = useNavigate();
  const {
    order,
    updateOrderType,
    updateDeliveryInfo,
    updateTableNumber,
    updateOrder,
  } = useOrder();
  const t = useTranslation(order.language);

  const [selectedType, setSelectedType] = useState<
    "delivery" | "dine-in" | "chatbot" | null
  >(order.type);
  const [address, setAddress] = useState(order.address || "");
  const [customerName, setcustomerName] = useState(order.customerName || "");
  const [phone, setPhone] = useState(order.phone || "");
  const [tableNumber, setTableNumber] = useState(order.tableNumber || "");

  const handleTypeSelect = (type: "delivery" | "dine-in" | "chatbot") => {
    setSelectedType(type);
    updateOrderType(type);
  };
  // Mutation for submitting the order
  // This will handle the API call to submit the order

  const handleContinue = () => {
    if (!selectedType) {
      toast.error("Please select an order type");
      return;
    }

    // ✅ تخطي الفاليديشن لو كان النوع "chatbot"
    if (selectedType !== "chatbot" && !validateForm()) {
      toast.error("Please correct the form errors.");
      return;
    }

    if (selectedType === "delivery") {
      updateDeliveryInfo(address.trim(), phone.trim());
    } else if (selectedType === "dine-in") {
      updateTableNumber(tableNumber.trim());
    }

    updateOrder({
      ...order,
      customerName: customerName.trim(),
    });

    updateOrderType(selectedType);

    if (selectedType === "chatbot") {
      navigate("/chatbot");
    } else {
      // ✅ إضافة التنقل لباقي الأنواع
      navigate("/menu");
    }
  };

  // 📝 Form Validation
  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
    phone?: string;
    tableNumber?: string;
  }>({});
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      address?: string;
      phone?: string;
      tableNumber?: string;
    } = {};

    // 🧍‍♀️ Name Validation (applies to both delivery and dine-in)
    if (!customerName.trim()) {
      newErrors.name = "Name is required.";
    } else if (customerName.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }

    // 📦 Delivery Validation
    if (selectedType === "delivery") {
      if (!address.trim()) {
        newErrors.address = "Delivery address is required.";
      }

      if (!phone.trim()) {
        newErrors.phone = "Phone number is required.";
      } else {
        const phoneRegex = /^(\+?\d{1,3})?[-.\s]?(\d{10,15})$/;
        if (!phoneRegex.test(phone)) {
          newErrors.phone = "Phone number is invalid.";
        }
      }
    }

    // 🍽️ Dine-in Validation
    if (selectedType === "dine-in") {
      if (!tableNumber?.trim()) {
        newErrors.tableNumber = "Table number is required.";
      } else if (!/^\d+$/.test(tableNumber.trim())) {
        newErrors.tableNumber = "Table number must be a valid number.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // go back
  const handleBack = () => {
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-6 px-4 ${
        order.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <BackButton onClick={handleBack} />

          <h1 className="text-2xl font-bold text-gray-900">
            {t.selectOrderType}
          </h1>
        </div>

        {/* Order Type Selection */}
        <div className="space-y-4 mb-8">
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedType === "delivery"
                ? "ring-2 ring-orange-500 bg-orange-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleTypeSelect("delivery")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedType === "delivery"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {t.delivery}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Delivered to your address
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedType === "dine-in"
                ? "ring-2 ring-orange-500 bg-orange-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleTypeSelect("dine-in")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedType === "dine-in"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {t.dineIn}
                  </h3>
                  <p className="text-gray-600 text-sm">Eat at the restaurant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedType === "chatbot"
                ? "ring-2 ring-orange-500 bg-orange-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleTypeSelect("chatbot")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedType === "chatbot"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {t.chatbot}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get help with your order
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information Forms */}
        {selectedType === "delivery" && (
          <form className="space-y-4 mb-8">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">
                {t.name} *
              </Label>
              <Input
                id="name"
                type="text"
                value={customerName}
                onChange={(e) => setcustomerName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="address" className="text-gray-700 font-medium">
                {t.deliveryAddress} *
              </Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="mt-1"
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                {t.phoneNumber} *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="mt-1"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </form>
        )}

        {selectedType === "dine-in" && (
          <form className="space-y-4 mb-8">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">
                {t.name} *
              </Label>
              <Input
                id="name"
                type="text"
                value={customerName}
                onChange={(e) => setcustomerName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="table" className="text-gray-700 font-medium">
                {t.tableNumber}
              </Label>
              <Input
                id="table"
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter table number (optional)"
                className="mt-1"
              />
              {errors.tableNumber && (
                <p className="text-red-500 text-sm">{errors.tableNumber}</p>
              )}
            </div>
          </form>
        )}

        {/* Continue Button */}
        <ContinueButton onclick={handleContinue} disabled={!selectedType}>
          {t.continue}
        </ContinueButton>
        <Button disabled={!selectedType}></Button>
      </div>
    </div>
  );
};

export default OrderType;
