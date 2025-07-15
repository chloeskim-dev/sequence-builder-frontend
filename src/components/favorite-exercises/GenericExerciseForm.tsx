import { useFormContext } from "react-hook-form";
import { FieldConfig } from "../../constants/types";
import {
    commonFlexColStyles,
    errorMessageStyles,
} from "../../constants/tailwindClasses";

const labelStyles = "font-extrabold";
const inputStyles = "text-sm border p-2 w-full rounded";

interface Props {
    id: string;
    onSubmit: (data: any) => void;
    fields: FieldConfig[];
}

export function GenericExerciseForm({ id, onSubmit, fields }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useFormContext();

    return (
        <form
            id={id}
            onSubmit={handleSubmit(onSubmit)}
            className={commonFlexColStyles}
        >
            {fields.map((field) => {
                const error = errors[field.name];
                const commonProps = {
                    id: field.name,
                    ...register(field.name, field.rules),
                    placeholder: field.placeholder,
                    className: field.inputClassName || inputStyles,
                };

                return (
                    <div key={field.name}>
                        <label htmlFor={field.name} className={labelStyles}>
                            {field.label}
                            {field.rules?.required && (
                                <span className="text-red-500">*</span>
                            )}
                        </label>

                        {field.type === "textarea" ? (
                            <textarea {...commonProps} rows={field.rows || 3} />
                        ) : (
                            <input type={field.type} {...commonProps} />
                        )}

                        {error && (
                            <p className={errorMessageStyles}>
                                {error.message as string}
                            </p>
                        )}
                    </div>
                );
            })}
        </form>
    );
}
