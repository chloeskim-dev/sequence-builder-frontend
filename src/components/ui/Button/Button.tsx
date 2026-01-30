import styles from "./Button.module.scss";

//  button that appears raised and bordered

type ButtonProps = {
    buttonType?: ButtonType;
    className?: string;
    form?: string;
    onClick?: () => void;
    text?: string;
    type?: Type;
};

type Type = "submit" | "reset" | "button" | undefined;

export type ButtonType = "standard" | "compact";

export default function Button({
    buttonType,
    className,
    form,
    onClick,
    text,
    type,
}: ButtonProps) {
    const stylesByButtonType = buttonType ? styles[buttonType] : "";

    return (
        <button
            type={type ?? "button"}
            className={`${styles.myButton} ${stylesByButtonType}
             ${className && className}`}
            onClick={onClick}
            form={form}
        >
            {text}
        </button>
    );
}
