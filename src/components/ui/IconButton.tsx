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
            className={`flex items-center gap-2 text-sm text-white pl-4 py-2 pr-6 transition ${className}`}
        >
            {icon}
            {children}
        </button>
    );
};
