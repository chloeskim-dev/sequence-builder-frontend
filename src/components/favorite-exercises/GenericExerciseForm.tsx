import { useFormContext } from "react-hook-form";
import { FieldConfig } from "../../constants/types";
import {
    commonFlexColStyles,
    errorMessageStyles,
} from "../../constants/tailwindClasses";

const labelStyles = "font-extrabold";
const inputStyles = "text-sm p-2 w-full rounded";

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
                const isNumberField = field.type === "number";
                const isTextField =
                    field.type === "text" || field.type === "textarea";

                const fieldRules = {
                    ...(field.rules || {}),
                    ...(isNumberField && {
                        setValueAs: (v: any) => {
                            const result =
                                v === "" || v === undefined
                                    ? undefined
                                    : isNaN(Number(v))
                                    ? undefined
                                    : Number(v);

                            return result;
                        },
                    }),
                    ...(isTextField && {
                        setValueAs: (v: any) => {
                            const result =
                                v === "" || v === undefined ? undefined : v;
                            return result;
                        },
                    }),
                };
                const registerResult = register(field.name, fieldRules);

                return (
                    <div key={field.name}>
                        <label htmlFor={field.name} className={labelStyles}>
                            {field.label}
                            {field.rules?.required && (
                                <span className="text-red-500">*</span>
                            )}
                        </label>

                        {field.type === "textarea" ? (
                            <textarea
                                {...registerResult}
                                rows={field.rows || 3}
                                className={inputStyles}
                            />
                        ) : (
                            <input
                                {...registerResult}
                                type={field.type}
                                className={inputStyles}
                            />
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
