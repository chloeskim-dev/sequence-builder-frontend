import React from "react";

interface IconButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  children,
  className = "",
  type = "button",
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`flex items-center gap-2 justify-center text-sm text-white font-bold pl-4 py-1 pr-6 transition ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};
