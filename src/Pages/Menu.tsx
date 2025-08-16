import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useOrder } from "../contexts/useOrder";
import { useTranslation } from "../utils/translations";
import { Button } from "../Components/UI/Button";
import { Input } from "../Components/UI/Input";
import { Card, CardContent } from "../Components/UI/card";
import { Badge } from "../Components/UI/badge";
import BackButton from "../Components/BackButton/BackButton";
import MenuSkeleton from "../Components/MenuSkeleton";

export interface Category {
  key:
    | "All"
    | "Burgers"
    | "Pizza"
    | "Salads"
    | "Seafood"
    | "Desserts"
    | "Beverages"
    | "Sandwiches";
}

interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  image: string;
  category: string;
}

const Menu = () => {
  const navigate = useNavigate();
  const { order, addItem } = useOrder();
  const t = useTranslation(order.language);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryList: Category["key"][] = [
    "All",
    "Burgers",
    "Sandwiches",
    "Pizza",
    "Salads",
    "Seafood",
    "Desserts",
    "Beverages",
  ];

  // State to store all menu items fetched from API
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);

  // Fetch all menu items from API (only once)
  const fetchAllMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://primary-production-c413.up.railway.app/webhook/get-menu"
      );

      if (response.data && Array.isArray(response.data)) {
        setAllMenuItems(response.data);
        setMenuItems(response.data); // Show all items initially
      } else {
        setAllMenuItems([]);
        setMenuItems([]);
        toast.error("No menu items found");
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items");
      setAllMenuItems([]);
      setMenuItems([]);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on selected category (client-side filtering)
  const filterItemsByCategory = (category: string) => {
    if (category === "All") {
      setMenuItems(allMenuItems); // Show all items
    } else {
      // Filter items by category - handle both "Sandwich" and "Sandwiches"
      const filteredItems = allMenuItems.filter((item) => {
        const itemCategory = item.category.toLowerCase();
        const selectedCat = category.toLowerCase();

        // Handle both "sandwich" and "sandwiches"
        if (selectedCat === "sandwiches" && itemCategory === "sandwich") {
          return true;
        }
        if (selectedCat === "sandwich" && itemCategory === "sandwiches") {
          return true;
        }

        return itemCategory === selectedCat;
      });
      setMenuItems(filteredItems);
    }
  };

  // Handle category change (client-side filtering)
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterItemsByCategory(category);
  };

  // Load all menu items once on component mount
  useEffect(() => {
    fetchAllMenuItems();
  }, []);

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

  const handleAddToOrder = (item: MenuItem) => {
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
            {/* Cart button */}
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

      {/* Category Filter - Fixed */}
      <div className="bg-white shadow-sm sticky top-[73px] z-9 py-4">
        <div className="flex flex-wrap gap-2 justify-center px-4">
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {t.categories[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && <MenuSkeleton itemCount={6} />}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => fetchAllMenuItems()}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Menu Items */}
      {!loading && !error && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          {menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No items found for {selectedCategory}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {menuItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={order.language === "ar" ? item.nameAr : item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        // Fallback image if image fails to load
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop";
                      }}
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
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
