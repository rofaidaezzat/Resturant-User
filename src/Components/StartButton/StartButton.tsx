import { useState, useRef } from "react";
import "./StartButton.css";

interface StartButtonProps {
  onclick: () => void;
  children?: React.ReactNode;
}

const StartButton = ({ onclick, children }: StartButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleTouchStart = () => {
    setIsActive(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // نحافظ على التأثير ظاهر لمدة 600ms بعد اللمس
    timeoutRef.current = window.setTimeout(() => {
      setIsActive(false);
    }, 600);
  };

  return (
    <button
      className={`start-button ${isActive ? "hover-effect" : ""}`}
      onClick={onclick}
      onTouchStart={handleTouchStart}
    >
      <span className="main-text-start">
        {children}
        <span>
          {" "}
          <span>→</span>{" "}
        </span>
      </span>
    </button>
  );
};

export default StartButton;
