import React, { ReactNode, SetStateAction } from "react";

interface DropdownProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  closedLabel?: string;
  openLabel?: string;
  children: ReactNode;
}

export default function Dropdown({
  closedLabel,
  openLabel,
  children,
  isOpen,
  setIsOpen,
}: DropdownProps) {
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 w-full py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
      >
        {isOpen ? minusIcon : plusIcon}
        {isOpen ? openLabel : closedLabel}
      </button>

      {isOpen && (
        <div className="left-0 right-0 bg-white border border-gray-200  shadow-lg z-50">
          {children}
        </div>
      )}
    </div>
  );
}

const minusIcon = (
  <svg
    className="w-4 h-4 ml-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const plusIcon = (
  <svg
    className="w-4 h-4 ml-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line
      x1="12"
      y1="5"
      x2="12"
      y2="19"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
