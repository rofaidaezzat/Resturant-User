import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "success" | "danger";
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          confirmButtonClass: "bg-green-500 hover:bg-green-600 text-white",
        };
      case "danger":
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
          confirmButtonClass: "bg-red-500 hover:bg-red-600 text-white",
        };
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-orange-500" />,
          confirmButtonClass: "bg-orange-500 hover:bg-orange-600 text-white",
        };
    }
  };

  const { icon, confirmButtonClass } = getIconAndColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 shadow-2xl border-0 bg-white">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex justify-center mb-4">
            {icon}
          </div>
          
          <CardTitle className="text-xl font-bold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center pb-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {message}
          </p>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            
            <Button
              onClick={onConfirm}
              className={`flex-1 ${confirmButtonClass}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationModal; 