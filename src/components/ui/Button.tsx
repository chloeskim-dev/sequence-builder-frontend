import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
};

export const Button = ({
    className = "",
    variant = "primary",
    ...props
}: Props) => {
    const base = "px-4 py-2 rounded font-semibold transition";
    const variants = {
        primary: "bg-mt-green text-white hover:bg-gb-green",
        secondary: "bg-gray-200 text-black hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className ?? ""}`}
            {...props}
        />
    );
};
