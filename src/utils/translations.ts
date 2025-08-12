export const translations = {
  en: {
    // Landing Page
    restaurantName: "Delicious Bites",
    startOrder: "Start Your Order",
    welcomeMessage: "Welcome to our restaurant",
    
    // Order Type
    selectOrderType: "Select Order Type",
    delivery: "Delivery",
    dineIn: "Dine In",
    chatbot: "Chat with AI Assistant",
    name: "Name",
    deliveryAddress: "Delivery Address",
    phoneNumber: "Phone Number",
    tableNumber: "Table Number (Optional)",
    continue: "Continue",
    back: "Back",
    
    // Menu
    menu: "Menu",
    addToOrder: "Add to Order",
    quantity: "Quantity",
    specialNotes: "Special Notes",
    price: "$",
    
    // Order Summary
    orderSummary: "Order Summary",
    total: "Total",
    confirmOrder: "Confirm Order",
    edit: "Edit",
    
    // Thank You
    thankYou: "Thank You!",
    orderProcessing: "Your order is being processed",
    orderNumber: "Order Number",
    newOrder: "Start New Order",
    
    // Chatbot
    chatbotTitle: "AI Assistant",
    chatbotWelcome: "Hi! I'm here to help you with your order. What would you like to eat today?",
    chatbotPlaceholder: "Type your message here...",
    send: "Send",
    
    // Common
    loading: "Loading...",
    error: "Error occurred",
    required: "This field is required",
    retry: "Try Again",
    noMenuItems: "No menu items available",

    // Categories
    categories: {
      All: "All",
      Burgers: "Burgers",
      Pizza: "Pizza",
      Salads: "Salads",
      Seafood: "Seafood",
      Desserts: "Desserts",
      Beverages: "Beverages",
      Sandwiches: "Sandwiches",
      "Main Course": "Main Course",
      Appetizers: "Appetizers",
      Drinks: "Drinks",
    },
  },
  ar: {
    // Landing Page
    restaurantName: "لقمة شهية",
    startOrder: "ابدأ طلبك",
    welcomeMessage: "مرحباً بك في مطعمنا",
    
    // Order Type
    selectOrderType: "اختر نوع الطلب",
    delivery: "توصيل",
    dineIn: "تناول في المطعم",
    chatbot: "المحادثة مع المساعد الذكي",
    deliveryAddress: "عنوان التوصيل",
    name: "الاسم",
    phoneNumber: "رقم الهاتف",
    tableNumber: "رقم الطاولة (اختياري)",
    continue: "متابعة",
    back: "رجوع",
    
    // Menu
    menu: "القائمة",
    addToOrder: "إضافة للطلب",
    quantity: "الكمية",
    specialNotes: "ملاحظات خاصة",
    price: "ريال",
    
    // Order Summary
    orderSummary: "ملخص الطلب",
    total: "المجموع",
    confirmOrder: "تأكيد الطلب",
    edit: "تعديل",
    
    // Thank You
    thankYou: "شكراً لك!",
    orderProcessing: "جاري تحضير طلبك",
    orderNumber: "رقم الطلب",
    newOrder: "طلب جديد",
    
    // Chatbot
    chatbotTitle: "المساعد الذكي",
    chatbotWelcome: "مرحباً! أنا هنا لمساعدتك في طلبك. ماذا تريد أن تأكل اليوم؟",
    chatbotPlaceholder: "اكتب رسالتك هنا...",
    send: "إرسال",
    
    // Common
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    required: "هذا الحقل مطلوب",
    retry: "حاول مرة أخرى",
    noMenuItems: "لا توجد عناصر في القائمة",

    // Categories
    categories: {
      All: "الكل",
      Burgers: "برجر",
      Pizza: "بيتزا",
      Salads: "سلطات",
      Seafood: "مأكولات بحرية",
      Desserts: "حلويات",
      Beverages: "مشروبات",
      Sandwiches: "ساندويتش",
      "Main Course": "الطبق الرئيسي",
      Appetizers: "مقبلات",
      Drinks: "مشروبات",
    },
  }
};

export const useTranslation = (language: 'en' | 'ar') => {
  return translations[language];
};