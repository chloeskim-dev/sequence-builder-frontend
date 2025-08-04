type Props = {
    onClick?: () => void;
    className?: string;
    form?: string;
    type?: "button" | "submit" | "reset" | undefined;
    text: string;
    appearance: "primary" | "secondary";
    disabled?: boolean;
};

const PageBottomButton = ({
    onClick,
    className,
    text,
    appearance,
    form,
    type,
    disabled,
}: Props) => {
    const secondaryButtonStyles = "bg-gray-100 hover:bg-gb-yellow ";
    const primaryButtonStyles = "bg-mt-yellow hover:bg-gb-yellow";

    return (
        <div className="flex flex-row gap-x-2 justify-center ">
            <button
                type={type ?? "button"}
                onClick={onClick}
                disabled={disabled}
                form={form}
                className={`font-extrabold px-4 py-2 rounded ${
                    className ?? ""
                } ${
                    appearance === "primary"
                        ? primaryButtonStyles
                        : secondaryButtonStyles
                }`}
            >
                <span className="text-sm">{text}</span>
            </button>
        </div>
    );
};

export default PageBottomButton;
