import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { useOrder } from "../contexts/useOrder";
import { Button } from "../Components/UI/Button";
import { Input } from "../Components/UI/Input";
import { useTranslation } from "../utils/translations";
import { axiosInstance } from "../config/axios.config";
import { v4 as uuidv4 } from "uuid"; // لإنتاج sessionId فريد
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
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
  const sessionIdRef = useRef(uuidv4()); // 🔐 يبقى ثابت طول الجلسة

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBack = () => {
    navigate("/order-type");
  };

  const simulateBotResponse = async (userMessage: string) => {
    setIsTyping(true);

    try {
      // Try using the same payload structure as the working code
      const response = await axiosInstance.post("webhook/chatbot", {
        message: userMessage,
        timestamp: new Date().toISOString(), // Instead of sessionId
        sessionId: sessionIdRef.current, // ✅ ثابت من أول الشات,
      });

      console.log("Full bot response:", response.data);

      // Handle different response structures
      let botText;

      if (typeof response.data === "string") {
        // Plain text response (like first code)
        botText = response.data;
      } else if (response.data?.[0]?.output) {
        // Array with output property
        botText = response.data[0].output;
      } else if (response.data?.output) {
        // Direct output property
        botText = response.data.output;
      } else if (response.data?.message) {
        // Message property
        botText = response.data.message;
      } else {
        // Fallback - try to stringify if it's an object
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
              onClick={() => {
                setInputMessage("What are your most popular dishes?");
                handleSendMessage();
              }}
              className="text-sm"
            >
              Popular Items
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputMessage("Do you have vegetarian options?");
                handleSendMessage();
              }}
              className="text-sm"
            >
              Vegetarian Options
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
