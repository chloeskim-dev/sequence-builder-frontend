import { SetStateAction, useState } from "react";
import Modal from "../../components/layouts/Modal";
import { Exercise, Sequence } from "../../constants/types";

type SequenceDetailModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    detailItem: Sequence;
    setDetailItem: React.Dispatch<React.SetStateAction<Sequence | null>>;
};

const labelStyles = "block font-medium text-sm mb-1";
const textStyles = "text-sm";
const actionButtonsColumnWidth = "w-[200px]";

export default function SequenceDetailModal({
    isModalOpen,
    setIsModalOpen,
    detailItem,
    setDetailItem,
}: SequenceDetailModalProps) {
    useState(true);

    const closeDetailModal = () => {
        setIsModalOpen(false);
        setDetailItem(null);
    };
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeDetailModal}
            title={detailItem.name}
            buttons={[
                {
                    label: "Close",
                    onClick: () => setIsModalOpen(false),
                    variant: "secondary",
                },
            ]}
        >
            <div className="flex flex-col gap-y-4">
                {detailItem.description && detailItem.description !== "" && (
                    <div>
                        <label htmlFor="description" className={labelStyles}>
                            Description
                        </label>
                        <div id="description" className={textStyles}>
                            {detailItem.description}
                        </div>
                    </div>
                )}

                {detailItem.notes && detailItem.notes !== "" && (
                    <div>
                        <label htmlFor="notes" className={labelStyles}>
                            Notes
                        </label>
                        <div id="notes" className={textStyles}>
                            {detailItem.notes}
                        </div>
                    </div>
                )}
                <div>
                    <label htmlFor="notes" className={labelStyles}>
                        Exercises
                    </label>
                </div>
                {detailItem.exercises && detailItem.exercises.length > 0 && (
                    <div>
                        <div className="md:border border-gray-300 font-bold text-xs">
                            <div className="hidden md:flex flex-row gap-4 bg-gray-200">
                                <div className="flex-1 flex flex-row">
                                    <div className="flex-[2] p-2">Name</div>
                                    <div className="flex-1 p-2">Direction</div>
                                    <div className="flex-1 p-2">Duration</div>
                                    <div className="flex-1 p-2">Resistance</div>
                                    <div className="flex-[2] p-2">Notes</div>
                                </div>
                            </div>

                            {/* Exercise rows */}
                            {detailItem.exercises.map((exercise, i) => (
                                <div key={i} className="mb-4 md:mb-0">
                                    <DetailedExercisRow
                                        index={i}
                                        exercise={exercise}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {detailItem.exercises && detailItem.exercises.length === 0 && (
                    <div className="p-2 font-normal text-gray-400">
                        No favorite exercises have been added.
                    </div>
                )}

                {detailItem.created_at && detailItem.created_at !== "" && (
                    <div>
                        <label htmlFor="created_at" className={labelStyles}>
                            Created at
                        </label>
                        <div id="created_at" className={textStyles}>
                            {detailItem.created_at}
                        </div>
                    </div>
                )}

                {detailItem.updated_at && detailItem.updated_at !== "" && (
                    <div>
                        <label htmlFor="updated_at" className={labelStyles}>
                            Updated at
                        </label>
                        <div id="updated_at" className={textStyles}>
                            {detailItem.updated_at}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

type DetailedExercisRowProps = {
    index: number;
    exercise: Exercise;
};
// Note on styling:
// This row appears different from the SequenceRows (in SequencesList) in 2 ways:
// Here we can focus on the exercises of only one sequence (vs all of them in SequencesList), so even if exercise details get long, they are not truncated.
// Here we also don't need action buttons on each exercise row (ex. to view/edit/delete it). The rows in this modal are only for reading.
// Otherwise, styling was kept consistent with the other types of rows.
function DetailedExercisRow({ index, exercise }: DetailedExercisRowProps) {
    const rowContainerStyles =
        "flex flex-col md:flex-row  md:gap-4 py-4 p-2 md:p-0 bg-gray-100 md:border-t md:bg-white";
    const fieldsContainerStyles =
        "flex flex-col md:flex-row md:flex-wrap md:items-start gap-2 flex-1 min-w-0 overflow-hidden";
    const singleFieldContainerStyles = "px-2 md:p-2 min-w-0";
    const labelStyles = "font-bold md:hidden text-xs";
    const rowTextStyles = "text-xs flex-1 font-normal";

    return (
        <div id="rowContainer" className={rowContainerStyles}>
            <div id="fieldsContainer" className={fieldsContainerStyles}>
                <div className={`flex-[2] ${singleFieldContainerStyles}`}>
                    <div
                        className={`font-bold md:font-normal uppercase md:normal-case text-base md:text-xs`}
                    >
                        {exercise.name}
                    </div>
                </div>

                <div className={`flex-1 ${singleFieldContainerStyles}`}>
                    {exercise.direction !== "" && (
                        <>
                            <label className={labelStyles}>Direction</label>
                            <div className={rowTextStyles}>
                                {exercise.direction}
                            </div>
                        </>
                    )}
                </div>

                <div className={`flex-1 ${singleFieldContainerStyles}`}>
                    {exercise.duration_secs != null && (
                        <>
                            <label className={labelStyles}>Duration</label>
                            <div className="flex gap-2 md:-mt-2">
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-medium">
                                        min
                                    </label>
                                    <div className={rowTextStyles}>
                                        {exercise.duration_secs}
                                    </div>
                                </div>
                                <div className="text-[10px] self-end pb-0">
                                    :
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-medium">
                                        sec
                                    </label>
                                    <div className={rowTextStyles}>
                                        {exercise.duration_secs}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className={`flex-1 ${singleFieldContainerStyles}`}>
                    {exercise.resistance !== "" && (
                        <>
                            <label className={labelStyles}>Resistance</label>
                            <div className={rowTextStyles}>
                                {exercise.resistance}
                            </div>
                        </>
                    )}
                </div>

                <div className={`flex-[2] ${singleFieldContainerStyles}`}>
                    {exercise.notes !== "" && (
                        <>
                            <label className={labelStyles}>Notes</label>
                            <div className={rowTextStyles}>
                                {exercise.notes}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
