import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { useOrder } from "../contexts/useOrder";
import { Button } from "../Components/UI/Button";
import { Input } from "../Components/UI/Input";
import { useTranslation } from "../utils/translations";
import { axiosInstance } from "../config/axios.config";
import { v4 as uuidv4 } from "uuid";
import Pusher from "pusher-js";

// =================== Pusher Configuration ===================
const PUSHER_KEY = "4b8ce5bea9c546484b04";
const PUSHER_CLUSTER = "eu";
const CHANNEL_NAME = "new-orders";
const EVENT_NAME = "order-created";
const UPDATE_EVENT_NAME = "order-updated";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface PusherOrderData {
  orderId: string;
  message: string;
  sessionId: string;
  timestamp: string;
  // Add other order fields as needed
}

const Chatbot = () => {
  const navigate = useNavigate();
  const { order } = useOrder();
  const t = useTranslation(order.language);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: t.chatbotWelcome,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(uuidv4());
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // =================== Pusher Setup ===================
  useEffect(() => {
    // Initialize Pusher
    pusherRef.current = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
    });

    // Subscribe to the channel
    channelRef.current = pusherRef.current.subscribe(CHANNEL_NAME);

    // Listen for order created events
    channelRef.current.bind(EVENT_NAME, (data: PusherOrderData) => {
      console.log("Pusher order-created event:", data);

      // Only process if it's for this session or if it's a general notification
      if (data.sessionId === sessionIdRef.current || !data.sessionId) {
        const newBotMessage: Message = {
          id: Date.now().toString(),
          text: data.message || "Your order has been created successfully!",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newBotMessage]);
      }
    });

    // Listen for order update events
    channelRef.current.bind(UPDATE_EVENT_NAME, (data: PusherOrderData) => {
      console.log("Pusher order-updated event:", data);

      if (data.sessionId === sessionIdRef.current || !data.sessionId) {
        const newBotMessage: Message = {
          id: Date.now().toString(),
          text: data.message || "Your order has been updated!",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newBotMessage]);
      }
    });

    // Cleanup function
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        channelRef.current.unsubscribe();
      }
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, []);

  const handleBack = () => {
    navigate("/order-type");
  };

  const simulateBotResponse = async (userMessage: string) => {
    setIsTyping(true);

    try {
      // Send the message with session ID for Pusher integration
      const response = await axiosInstance.post("webhook/chatbot", {
        message: userMessage,
        timestamp: new Date().toISOString(),
        sessionId: sessionIdRef.current,
        // Add additional data for Pusher workflow
        pusherData: {
          channel: CHANNEL_NAME,
          event: EVENT_NAME,
          sessionId: sessionIdRef.current,
        },
      });

      console.log("Full bot response:", response.data);

      // Handle different response structures
      let botText;

      if (typeof response.data === "string") {
        botText = response.data;
      } else if (response.data?.[0]?.output) {
        botText = response.data[0].output;
      } else if (response.data?.output) {
        botText = response.data.output;
      } else if (response.data?.message) {
        botText = response.data.message;
      } else {
        botText =
          typeof response.data === "object"
            ? JSON.stringify(response.data)
            : "Sorry, no response from server.";
      }

      const newBotMessage: Message = {
        id: Date.now().toString(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Bot error:", error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "An error occurred while getting a response.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    simulateBotResponse(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // =================== Quick Action Handlers ===================
  const handleQuickAction = (message: string) => {
    setInputMessage(message);
    setTimeout(() => handleSendMessage(), 100); // Small delay to ensure state is updated
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
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t.chatbotTitle}
              </h1>
              {/* Connection Status Indicator */}
              <div className="ml-3 flex items-center">
                <div
                  className={`w-2 h-2 rounded-full ${
                    pusherRef.current?.connection.state === "connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="ml-1 text-xs text-gray-500">
                  {pusherRef.current?.connection.state === "connected"
                    ? "Live"
                    : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow min-h-96 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputMessage(e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder={t.chatbotPlaceholder}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-600 font-medium">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/menu")}
              className="text-sm"
            >
              View Menu
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickAction("What are your most popular dishes?")
              }
              className="text-sm"
            >
              Popular Items
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickAction("Do you have vegetarian options?")
              }
              className="text-sm"
            >
              Vegetarian Options
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("What are your delivery times?")}
              className="text-sm"
            >
              Delivery Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("Check my order status")}
              className="text-sm"
            >
              Order Status
            </Button>
          </div>
        </div>

        {/* Debug Info (Remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>Session ID: {sessionIdRef.current}</p>
            <p>Pusher State: {pusherRef.current?.connection.state}</p>
            <p>Channel: {CHANNEL_NAME}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
