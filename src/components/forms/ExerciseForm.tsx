import { useFormContext } from "react-hook-form";
import { FieldConfig } from "../../constants/types";
import {
    errorMessageStyles,
    formFieldsFlexColStyles,
    formTextInputStyles,
    formTextAreaInputStyles,
    commonLabelStyles,
    responsiveTextStyles,
} from "../../constants/tailwindClasses";

interface Props {
    id: string;
    onSubmit: (data: any) => void;
    fieldConfigs: FieldConfig[];
}

// Define the duration field type
interface DurationField {
    type: "duration";
    minField: FieldConfig;
    secField: FieldConfig;
}

export function ExerciseForm({ id, onSubmit, fieldConfigs }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useFormContext();

    // Group duration fields together
    const processedFields: (FieldConfig | DurationField)[] = [];
    const processedFieldNames = new Set<string>();

    fieldConfigs.forEach((fc) => {
        if (processedFieldNames.has(fc.name)) return;

        if (fc.name === "duration_mins") {
            const secField = fieldConfigs.find(
                (f) => f.name === "duration_secs"
            );
            if (secField) {
                processedFields.push({
                    type: "duration",
                    minField: fc,
                    secField: secField,
                });
                processedFieldNames.add(fc.name);
                processedFieldNames.add(secField.name);
            } else {
                processedFields.push(fc);
                processedFieldNames.add(fc.name);
            }
        } else if (fc.name === "duration_secs") {
            const minField = fieldConfigs.find(
                (f) => f.name === "duration_mins"
            );
            if (minField) {
                processedFields.push({
                    type: "duration",
                    minField: minField,
                    secField: fc,
                });
                processedFieldNames.add(fc.name);
                processedFieldNames.add(minField.name);
            } else {
                processedFields.push(fc);
                processedFieldNames.add(fc.name);
            }
        } else {
            processedFields.push(fc);
            processedFieldNames.add(fc.name);
        }
    });

    const createFieldRules = (fc: FieldConfig) => {
        const isNumberField = fc.type === "number";
        const isTextField = fc.type === "text" || fc.type === "textarea";

        return {
            ...(fc.rules || {}),
            ...(isNumberField && {
                setValueAs: (v: any) => {
                    // always maintain value as either a valid number OR undefined
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
                    // always maintain value as either a non-empty string OR undefined
                    const result = v === "" || v === undefined ? undefined : v;
                    return result;
                },
            }),
        };
    };

    // Type guard to check if field is a duration field
    const isDurationField = (
        field: FieldConfig | DurationField
    ): field is DurationField => {
        return "type" in field && field.type === "duration";
    };

    return (
        <form
            id={id}
            onSubmit={handleSubmit(onSubmit)}
            className={responsiveTextStyles}
        >
            <div className={formFieldsFlexColStyles}>
                {processedFields.map((field, index) => {
                    // Handle duration fields
                    if (isDurationField(field)) {
                        const { minField, secField } = field;
                        const minError = errors[minField.name as string];
                        const secError = errors[secField.name as string];
                        const hasError = minError || secError;

                        const minRules = createFieldRules(minField);
                        const secRules = createFieldRules(secField);

                        return (
                            <div key={`duration-${index}`}>
                                <label
                                    className={`${commonLabelStyles} text-hmt-dark-option4`}
                                >
                                    Duration
                                    {(minField.rules?.required ||
                                        secField.rules?.required) && (
                                        <span className="text-my-red">*</span>
                                    )}
                                </label>

                                <div className="flex flex-row gap-x-3 items-center">
                                    <div className="w-[70px] text-center">
                                        <input
                                            {...register(
                                                minField.name as string,
                                                minRules
                                            )}
                                            type={minField.type}
                                            className={`text-center text-gb-bg border-b-hmt-dark-option4 ${formTextInputStyles}`}
                                        />
                                    </div>
                                    <span className="text-my-bg text-sm mr-3">
                                        min
                                    </span>
                                    <div className="w-[70px] ">
                                        <input
                                            {...register(
                                                secField.name as string,
                                                secRules
                                            )}
                                            type={secField.type}
                                            className={`text-center text-gb-bg border-b-hmt-dark-option4 ${formTextInputStyles}`}
                                        />
                                    </div>
                                    <span className="text-my-bg text-sm">
                                        sec
                                    </span>
                                </div>

                                {hasError && (
                                    <div className="space-y-1">
                                        {minError && (
                                            <p className={errorMessageStyles}>
                                                Minutes:{" "}
                                                {minError.message as string}
                                            </p>
                                        )}
                                        {secError && (
                                            <p className={errorMessageStyles}>
                                                Seconds:{" "}
                                                {secError.message as string}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Handle regular fields
                    const fc = field;
                    const error = errors[fc.name as string];
                    const fieldRules = createFieldRules(fc);
                    const registerResult = register(
                        fc.name as string,
                        fieldRules
                    );

                    return (
                        <div key={fc.name}>
                            <label
                                htmlFor={fc.name}
                                className={`${commonLabelStyles} text-hmt-dark-option4`}
                            >
                                {fc.label}
                                {fc.rules?.required && (
                                    <span className="text-my-red">*</span>
                                )}
                            </label>

                            {fc.type === "textarea" ? (
                                <textarea
                                    {...registerResult}
                                    rows={fc.rows || 3}
                                    className={`${formTextAreaInputStyles} text-gb-bg border-b-hmt-dark-option4`}
                                    placeholder={fc.placeholder}
                                />
                            ) : (
                                <input
                                    {...registerResult}
                                    type={fc.type}
                                    className={`${formTextInputStyles} text-gb-bg border-b-hmt-dark-option4`}
                                    placeholder={fc.placeholder}
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
            </div>
        </form>
    );
}
