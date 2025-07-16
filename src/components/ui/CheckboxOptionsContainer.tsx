type Option = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

type Props = {
    options: Option[];
    title?: string;
    containerClassName?: string;
    optionsClassName?: string;
    labelClassName?: string;
    textClassName?: string;
};

export default function CheckboxOptionsContainer({
    options,
    title = "",
    containerClassName = "",
    optionsClassName = "",
    labelClassName = "",
    textClassName = "",
}: Props) {
    return (
        <div className={containerClassName}>
            <div className="font-bold text-sm pb-2">{title}</div>
            <div className={optionsClassName}>
                {options.map((option, idx) => (
                    <label key={idx} className={labelClassName}>
                        <input
                            type="checkbox"
                            checked={option.checked}
                            onChange={(e) => option.onChange(e.target.checked)}
                        />
                        <span className={textClassName}>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
