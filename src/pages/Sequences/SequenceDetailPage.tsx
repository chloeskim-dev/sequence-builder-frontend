import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { formatUtcToLocalTrimmed } from "../../utils/dateHelpers";
import { useSequence } from "../../hooks/useSequence";
import { ReusableList } from "../../components/layouts/ReusableList";

export const SequenceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { sequence, initializeSequence } = useSequence(id);

    const labelStyles = "block font-bold text-sm";
    const textStyles = "text-med break-all";

    useEffect(() => {
        if (id) {
            initializeSequence();
        }
    }, [id, initializeSequence]);

    const navigate = useNavigate();
    const onBackButtonClick = () => {
        navigate("/sequences");
    };

    const fieldStyles = "flex flex-col";

    if (!sequence) return <p>Loading...</p>;

    return (
        <div className="mx-4">
            <div className="flex flex-col gap-y-4">
                <div className={fieldStyles}>
                    <label htmlFor="description" className={labelStyles}>
                        Name
                    </label>
                    <div id="name" className={textStyles}>
                        {sequence!.name}
                    </div>
                </div>

                {sequence!.description && sequence!.description !== "" && (
                    <div className={fieldStyles}>
                        <label htmlFor="description" className={labelStyles}>
                            Description
                        </label>
                        <div id="description" className={textStyles}>
                            {sequence!.description}
                        </div>
                    </div>
                )}

                {sequence!.notes && sequence!.notes !== "" && (
                    <div className={fieldStyles}>
                        {" "}
                        <label htmlFor="notes" className={labelStyles}>
                            Notes
                        </label>
                        <div id="notes" className={textStyles}>
                            {sequence!.notes}
                        </div>
                    </div>
                )}
                <div className={fieldStyles}>
                    <label htmlFor="notes" className={labelStyles}>
                        Exercises
                    </label>
                    <div>
                        {sequence!.exercises.length > 0 ? (
                            <ReusableList
                                items={sequence.exercises}
                                getActionButtonsForItem={(item, index) => []}
                                standardFields={[
                                    "name",
                                    "direction",
                                    "duration",
                                    "resistance",
                                    "notes",
                                ]}
                                actionsFieldWidthStyle="w-[0px]"
                            />
                        ) : (
                            <div className="font-normal text-sm text-gray-400">
                                No exercises have been added.
                            </div>
                        )}
                    </div>
                </div>

                <div className={fieldStyles}>
                    <label htmlFor="created_at" className={labelStyles}>
                        Created at
                    </label>
                    <div id="created_at" className={textStyles}>
                        <div className={`flex flex-row gap-x-2`}>
                            <div>
                                {
                                    formatUtcToLocalTrimmed(
                                        sequence!.created_at
                                    ).date
                                }
                            </div>
                            <div>
                                {
                                    formatUtcToLocalTrimmed(
                                        sequence!.created_at
                                    ).time
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className={fieldStyles}>
                    <label htmlFor="updated_at" className={labelStyles}>
                        Updated at
                    </label>
                    <div id="updated_at" className={textStyles}>
                        <div className={`flex flex-row gap-x-2`}>
                            <div>
                                {
                                    formatUtcToLocalTrimmed(
                                        sequence!.updated_at
                                    ).date
                                }
                            </div>
                            <div>
                                {
                                    formatUtcToLocalTrimmed(
                                        sequence!.updated_at
                                    ).time
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button
                type="button"
                onClick={onBackButtonClick}
                className="bg-gray-300 text-black px-4 py-2 rounded font-extrabold mt-4"
            >
                Back
            </button>
        </div>
    );
};
