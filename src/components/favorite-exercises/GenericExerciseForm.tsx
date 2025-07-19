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
    fieldConfigs: FieldConfig[];
}

export function GenericExerciseForm({ id, onSubmit, fieldConfigs }: Props) {
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
            {fieldConfigs.map((fc) => {
                const error = errors[fc.name];
                const isNumberField = fc.type === "number";
                const isTextField =
                    fc.type === "text" || fc.type === "textarea";

                const fieldRules = {
                    ...(fc.rules || {}),
                    ...(isNumberField && {
                        setValueAs: (v: any) => {
                            const result =
                                v === "" || v === undefined
                                    ? undefined
                                    : isNaN(Number(v))
                                    ? undefined
                                    : Number(v);

                            console.log("VALUE: ", v);

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
                const registerResult = register(fc.name, fieldRules);

                return (
                    <div key={fc.name}>
                        <label htmlFor={fc.name} className={labelStyles}>
                            {fc.label}
                            {fc.rules?.required && (
                                <span className="text-red-500">*</span>
                            )}
                        </label>

                        {fc.type === "textarea" ? (
                            <textarea
                                {...registerResult}
                                rows={fc.rows || 3}
                                className={inputStyles}
                            />
                        ) : (
                            <input
                                {...registerResult}
                                type={fc.type}
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
