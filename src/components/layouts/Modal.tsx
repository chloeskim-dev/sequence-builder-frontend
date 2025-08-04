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
    modalType?: string;
}

const CloseIcon = ({ onClick }: { onClick: () => void }) => (
    <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 cursor-pointer hover:opacity-70"
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
    modalType,
}: Props) {
    if (!isOpen) return null;

    const getButtonStyles = (variant: ModalButton["variant"] = "primary") => {
        const baseStyles =
            "px-4 py-2 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

        switch (variant) {
            case "primary":
                return `${baseStyles} bg-my-blue text-white hover:bg-mt-blue rounded `;
            case "secondary":
                return `${baseStyles} bg-gray-200 text-gray-800 hover:bg-gray-300 rounded `;
            case "danger":
                return `${baseStyles} bg-my-red text-white hover:bg-gb-red rounded `;
            default:
                return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 rounded `;
        }
    };

    const defaultButtons: ModalButton[] = showCloseButton
        ? [{ label: "Close", onClick: onClose, variant: "secondary" }]
        : [];

    const modalButtons = buttons.length > 0 ? buttons : defaultButtons;

    const topSectionColorStyles = "bg-my-yellow";
    const middleSectionColorStyles = "bg-my-yellow";
    const bottomSectionColorStyles = "bg-my-yellow";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className={`flex flex-col max-h-[80%] max-w-[80%] px-4 rounded-xl ${middleSectionColorStyles} break-words shadow-lg`}
            >
                {title && (
                    <div
                        className={`${topSectionColorStyles} text-my-bg py-4 border-hmt-light-option3 flex gap-x-8`}
                    >
                        {/* <h2 className="text-my-green text-xl font-semibold"> */}
                        <h2 className="text-xl font-semibold text-center flex-1 ml-2">
                            {title}
                        </h2>
                        <CloseIcon onClick={onClose} />
                    </div>
                )}

                <div className="py-2 flex-1 overflow-y-auto">
                    <div className="px-6">{children}</div>
                </div>

                {modalButtons.length > 0 && (
                    <div
                        className={`${bottomSectionColorStyles} py-4 border-hmt-light-option3 flex justify-center`}
                    >
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
