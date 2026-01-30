import { ReactNode } from "react";
import Button, { ButtonType } from "../ui/Button/Button";
import styles from "../../styles/global.module.scss";

interface ModalButton {
    label: string;
    onClick: () => void;
    buttonType?: ButtonType;
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

    const defaultButtons: ModalButton[] = showCloseButton
        ? [{ label: "Close", onClick: onClose, buttonType: "compact" }]
        : [];

    const modalButtons = buttons.length > 0 ? buttons : defaultButtons;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            // console.log("closing modal!");
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleOverlayClick}
        >
            <div
                className={`flex flex-col max-h-[80%] max-w-[90%] md:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] rounded-xl break-words p-4 ${styles["raised"]}`}
            >
                {/* Close Icon */}
                <div className="flex justify-end">
                    <CloseIcon onClick={onClose} />
                </div>

                {/* Note: Close icon has width of 24px (w-6 tailwind). The mx of the title and children should be this + a lil extra */}

                {/* Modal Title */}
                {title && (
                    <h2 className="text-xl font-semibold text-center mb-4 mx-8">
                        {title}
                    </h2>
                )}

                {/* Modal Content */}
                <div className="flex-1 scrollbar-padded scrollbar-custom overflow-y-auto mx-8">
                    <div className="">{children}</div>
                </div>

                {/* Modal Buttons */}
                {modalButtons.length > 0 && (
                    <div
                        className={`mb-2 mt-6 border-hmt-light-option3 flex justify-center`}
                    >
                        <div className="flex gap-3">
                            {modalButtons.map((button, index) => (
                                <Button
                                    type={button.type || "button"}
                                    onClick={button.onClick}
                                    buttonType={button.buttonType}
                                    text={button.label}
                                    form={button.form}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
