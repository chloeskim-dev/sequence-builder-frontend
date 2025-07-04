import { SetStateAction, useState } from "react";
import { Sequence } from "../../constants/types";
import { formatUtcToLocalTrimmed } from "../../utils/dateHelpers";
import Modal from "../../components/layouts/Modal";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";

type SequencesListTestProps = {
    sequences: Sequence[];
    handleViewItemClick: (index: number) => void;
    handleEditItemClick: (index: number) => void;
    handleDeleteItemClick: (index: number) => void;
    setSequences: React.Dispatch<SetStateAction<Sequence[]>>;
    setRunItem: React.Dispatch<SetStateAction<Sequence>>;
};

const actionButtonsColumnWidth = "w-[240px]";

export default function SequencesList({
    sequences,
    handleViewItemClick,
    handleEditItemClick,
    handleDeleteItemClick,
    setSequences,
    setRunItem,
}: SequencesListTestProps) {
    return (
        <div className="md:border border-gray-300 mx-4 my-2 font-bold text-xs">
            {/* Header row */}
            <div className="hidden md:flex flex-row gap-4 bg-gray-200">
                <div className="flex-1 flex flex-row">
                    <div className="flex-[2] p-2">Name</div>
                    <div className="flex-[2] p-2">Description</div>
                    <div className="flex-[2] p-2">Notes</div>
                    <div className="flex-1 p-2">Created at</div>
                    {/* <div className="flex-1 p-2">Updated at</div> */}
                    {/* <div className="w-[128px] px-2">Actions</div> */}
                </div>
                <div className={`${actionButtonsColumnWidth} p-2 pl-0`}>
                    Actions
                </div>
            </div>

            {/* Sequence rows */}
            {sequences &&
                sequences.map((sequence, i) => (
                    <div key={i} className="mb-4 md:mb-0">
                        <SequenceRow
                            index={i}
                            sequence={sequence}
                            setSequences={setSequences}
                            setRunItem={setRunItem}
                            handleViewItemClick={handleViewItemClick}
                            handleEditItemClick={handleEditItemClick}
                            handleDeleteItemClick={handleDeleteItemClick}
                        />
                    </div>
                ))}

            {sequences && sequences.length === 0 && (
                <div className="my-2 p-2 font-normal text-gray-400">
                    No sequences have been added.
                </div>
            )}
        </div>
    );
}

type SequenceRowProps = {
    sequence: Sequence;
    handleViewItemClick: (index: number) => void;
    handleEditItemClick: (index: number) => void;
    handleDeleteItemClick: (index: number) => void;
    setSequences: React.Dispatch<SetStateAction<Sequence[]>>;
    setRunItem: React.Dispatch<SetStateAction<Sequence>>;
    index: number;
};
function SequenceRow({
    sequence,
    handleViewItemClick,
    handleEditItemClick,
    handleDeleteItemClick,
    index,
    setSequences,
    setRunItem,
}: SequenceRowProps) {
    const rowContainerStyles =
        "flex flex-col md:flex-row  md:gap-4 py-4 p-2 md:p-0 bg-gray-100 md:border-t md:bg-white";

    const fieldsContainerStyles =
        "flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 flex-1 min-w-0 overflow-hidden";
    const singleFieldContainerStyles = "px-2 md:p-2 min-w-0";
    const actionButtonsContainerStyle = `mt-2 md:mt-0 ml-1 md:ml-0 ${actionButtonsColumnWidth}`;
    const actionButtonStyles = "text-xs font-bold p-2 text-white bg-red-500";
    const labelStyles = "font-bold md:hidden text-xs";
    const rowTextStyles = "text-xs flex-1 font-normal truncate";

    const { user, isAuthenticated } = useUser();
    const userId = user?.id ?? null;

    // const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    //     useState(false);

    // const handleDeleteItemClick = async (sequenceId: string) => {
    //     console.log("user wants to delete sequence with id ", sequenceId);
    //     setIsDeleteConfirmModalOpen(true);
    // };

    // const deleteItem = async (sequenceId: string) => {
    //     const res = await api.delete(`/v1/sequences/${sequenceId}`);
    //     const updatedSequences = await api.get(`/v1/sequences/user/${userId}`);
    //     setSequences(updatedSequences);
    //     setIsDeleteConfirmModalOpen(false);
    // };

    const handleRunItemClick = async (sequenceId: string) => {
        console.log(sequenceId);

        const res = await api.get(`/v1/sequences/${sequenceId}/full`);
        console.log(`fetched full sequence with id: ${sequenceId}`, res);
        setRunItem(res);
    };
    return (
        <div id="rowContainer" className={rowContainerStyles}>
            <div id="fieldsContainer" className={fieldsContainerStyles}>
                <div className={`flex-[2] ${singleFieldContainerStyles}`}>
                    <div
                        className={`font-bold md:font-normal uppercase md:normal-case text-base md:text-xs`}
                    >
                        <div className={rowTextStyles}>{sequence.name}</div>
                    </div>
                </div>

                <div className={`flex-[2] ${singleFieldContainerStyles}`}>
                    {sequence.description && sequence.description !== "" && (
                        <>
                            <label className={labelStyles}>Direction</label>
                            <div className={rowTextStyles}>
                                {sequence.description}
                            </div>
                        </>
                    )}
                </div>

                <div className={`flex-[2] ${singleFieldContainerStyles}`}>
                    {sequence.notes && sequence.notes !== "" && (
                        <>
                            <label className={labelStyles}>Notes</label>
                            <div className={rowTextStyles}>
                                {sequence.notes}
                            </div>
                        </>
                    )}
                </div>

                <div className={`flex-1 ${singleFieldContainerStyles}`}>
                    <label className={labelStyles}>Created at</label>
                    <div className={rowTextStyles}>
                        {formatUtcToLocalTrimmed(sequence.created_at)}
                    </div>
                </div>
                {/* <div className={`flex-1 ${singleFieldContainerStyles}`}>
                    <label className={labelStyles}>Updated at</label>
                    <div className={rowTextStyles}>
                        {formatUtcToLocalTrimmed(sequence.updated_at)}
                    </div>
                </div> */}
            </div>

            <div
                id="actionButtonsContainer"
                className={`${actionButtonsContainerStyle} ${singleFieldContainerStyles}`}
            >
                <div className="flex justify-center">
                    <button
                        className={`${actionButtonStyles} mr-2`}
                        onClick={() => handleViewItemClick(index)}
                    >
                        View Details
                    </button>
                    <button
                        className={`${actionButtonStyles} mr-2`}
                        onClick={() => handleEditItemClick(index)}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteItemClick(index)}
                        className={`${actionButtonStyles} mr-2`}
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => {
                            handleRunItemClick(sequence.id);
                        }}
                        className={`${actionButtonStyles} mr-2`}
                    >
                        Run
                    </button>
                </div>
            </div>
        </div>
    );
}
