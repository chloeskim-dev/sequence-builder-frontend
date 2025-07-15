import { ReactNode } from "react";

interface ModalButton {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    form?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    buttons?: ModalButton[];
    showCloseButton?: boolean;
    title?: string;
}

const CloseIcon = ({ onClick }: { onClick: () => void }) => (
    <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 cursor-pointer hover:opacity-70"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
);

export default function Modal({
    isOpen,
    onClose,
    children,
    buttons = [],
    showCloseButton = true,
    title,
}: Props) {
    if (!isOpen) return null;

    const getButtonStyles = (variant: ModalButton["variant"] = "primary") => {
        const baseStyles =
            "px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

        switch (variant) {
            case "primary":
                return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 rounded`;
            case "secondary":
                return `${baseStyles} bg-gray-200 text-gray-800 hover:bg-gray-300 rounded`;
            case "danger":
                return `${baseStyles} bg-red-600 text-white hover:bg-red-700 rounded`;
            default:
                return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 rounded`;
        }
    };

    const defaultButtons: ModalButton[] = showCloseButton
        ? [{ label: "Close", onClick: onClose, variant: "secondary" }]
        : [];

    const modalButtons = buttons.length > 0 ? buttons : defaultButtons;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-xl bg-white w-[90%] md:w-[80%] xl:w-[60%] max-h-[95vh] overflow-y-auto shadow-lg">
                {title && (
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h2>
                        <CloseIcon onClick={onClose} />
                    </div>
                )}

                <div className="p-6">{children}</div>

                {modalButtons.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex gap-3">
                            {modalButtons.map((button, index) => (
                                <button
                                    key={index}
                                    type={button.type || "button"}
                                    onClick={button.onClick}
                                    disabled={button.disabled}
                                    className={getButtonStyles(button.variant)}
                                    form={button.form}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
