import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useOrder } from "../contexts/useOrder";
import { useTranslation } from "../utils/translations";
import { Button } from "../Components/UI/Button";
import { Input } from "../Components/UI/Input";
import { Card, CardContent } from "../Components/UI/card";
import { Badge } from "../Components/UI/badge";
import BackButton from "../Components/BackButton/BackButton";

const menuItems = [
  {
    id: "1",
    name: "Classic Burger",
    nameAr: "برجر كلاسيكي",
    description:
      "Juicy beef patty with lettuce, tomato, onion, and our special sauce",
    descriptionAr: "قطعة لحم طرية مع خس وطماطم وبصل وصلصتنا الخاصة",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    category: "Burgers",
  },
  {
    id: "2",
    name: "Chicken Caesar Salad",
    nameAr: "سلطة سيزر بالدجاج",
    description:
      "Grilled chicken breast with romaine lettuce, parmesan, and caesar dressing",
    descriptionAr: "صدر دجاج مشوي مع خس روماني وجبن بارميزان وصلصة سيزر",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop",
    category: "Salads",
  },
  {
    id: "3",
    name: "Margherita Pizza",
    nameAr: "بيتزا مارغريتا",
    description: "Fresh mozzarella, tomato sauce, and basil on thin crust",
    descriptionAr: "موتزاريلا طازجة وصلصة طماطم وريحان على عجينة رقيقة",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    category: "Pizza",
  },
  {
    id: "4",
    name: "Grilled Salmon",
    nameAr: "سلمون مشوي",
    description: "Atlantic salmon with lemon herbs and seasonal vegetables",
    descriptionAr: "سلمون أطلسي بالأعشاب والليمون مع خضار موسمية",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    category: "Seafood",
  },
  {
    id: "5",
    name: "Chocolate Brownie",
    nameAr: "براوني الشوكولاتة",
    description: "Rich chocolate brownie served with vanilla ice cream",
    descriptionAr: "براوني شوكولاتة غني يُقدم مع آيس كريم الفانيلا",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    category: "Desserts",
  },
  {
    id: "6",
    name: "Fresh Orange Juice",
    nameAr: "عصير برتقال طازج",
    description: "Freshly squeezed orange juice",
    descriptionAr: "عصير برتقال طازج معصور",
    price: 8,
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    category: "Beverages",
  },
];
export interface Category {
  key:
    | "All"
    | "Burgers"
    | "Pizza"
    | "Salads"
    | "Seafood"
    | "Desserts"
    | "Beverages";
}

const Menu = () => {
  const navigate = useNavigate();
  const { order, addItem } = useOrder();
  const t = useTranslation(order.language);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  // go back
  const handleBack = () => {
    navigate("/order-type");
  };
  // quantity
  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 1) + change),
    }));
  };

  const handleAddToOrder = (item: any) => {
    const quantity = quantities[item.id] || 1;
    const itemNotes = notes[item.id] || "";

    addItem(
      {
        id: item.id,
        name: order.language === "ar" ? item.nameAr : item.name,
        price: item.price,
        image: item.image,
        description:
          order.language === "ar" ? item.descriptionAr : item.description,
      },
      quantity,
      itemNotes
    );

    toast.success(
      `${quantity}x ${
        order.language === "ar" ? item.nameAr : item.name
      } added to order`
    );

    // Reset quantity and notes for this item
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    setNotes((prev) => ({ ...prev, [item.id]: "" }));
  };

  const handleGoToSummary = () => {
    if (order.items.length === 0) {
      toast.error("Please add items to your order first");
      return;
    }
    navigate("/summary");
  };
  // Category selection
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categoryList: Category["key"][] = [
    "All",
    "Burgers",
    "Pizza",
    "Salads",
    "Seafood",
    "Desserts",
    "Beverages",
  ];

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        order.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BackButton onClick={handleBack} />

              <h1 className="text-2xl font-bold text-gray-900">{t.menu}</h1>
            </div>
            {/* item button */}
            {order.items.length > 0 && (
              <Button
                onClick={handleGoToSummary}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6 mt-6">
        {categoryList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              selectedCategory === cat
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-300"
            } transition-colors`}
          >
            {t.categories[cat]}
          </button>
        ))}
      </div>
      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          {menuItems
            .filter((item) =>
              selectedCategory === "All"
                ? true
                : item.category === selectedCategory
            )
            .map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={order.language === "ar" ? item.nameAr : item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {order.language === "ar" ? item.nameAr : item.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">
                      {t.price}
                      {item.price}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {order.language === "ar"
                      ? item.descriptionAr
                      : item.description}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      {t.quantity}:
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={(quantities[item.id] || 1) <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {quantities[item.id] || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div className="mb-4">
                    <Input
                      placeholder={t.specialNotes}
                      value={notes[item.id] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNotes((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      className="text-sm"
                    />
                  </div>

                  {/* Add to Order Button */}
                  <Button
                    onClick={() => handleAddToOrder(item)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
                  >
                    {t.addToOrder} - {t.price}
                    {item.price * (quantities[item.id] || 1)}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
