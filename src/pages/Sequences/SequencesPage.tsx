import { useState, useEffect } from "react";
import { Sequence } from "../../constants/types";
import { FiPlus } from "react-icons/fi";
import { IconButton } from "../../components/ui/IconButton";
import Searchbar from "../../components/ui/Searchbar";
import { sampleInitialSequences } from "../../constants/exampleItems";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import SequenceDeleteConfirmModal from "../../components/sequences/SequenceDeleteConfirmModal";
import {
    getSequenceTotalDurationSecs,
    RawFullSequence,
    removeNullFieldsFromSequences,
} from "../../utils/sequenceHelpers";
import { useNavigate } from "react-router-dom";
import { ReusableTable } from "../../components/layouts/ReusableTable";
import {
    pageCreateNewButtonStyles,
    pageOutermostFlexColStyles,
} from "../../constants/tailwindClasses";
import Modal from "../../components/layouts/Modal";

const SequencesPage = () => {
    const [sequenceQuery, setSequenceQuery] = useState("");
    const [sequences, setSequences] = useState(sampleInitialSequences);
    const [createModalIsOpen, setcreateModalIsOpen] = useState(false);
    const [deleteConfirmModalIsOpen, setDeleteConfirmModalIsOpen] =
        useState(false);
    const [deleteItem, setDeleteItem] = useState<Sequence | null>(null);
    const [runDenyModalIsOpen, setRunDenyModalIsOpen] = useState(false);
    const [runItem, setRunItem] = useState<Sequence | null>(null);
    const [error, setError] = useState("");
    const { user } = useUser();
    const userId = user?.id ?? null;

    const navigate = useNavigate();

    const fetchSequences = async () => {
        try {
            const res = await api.get(`/v1/sequences/user/${userId}/full`);
            console.log("Fetched raw sequences from db:\n", res);
            return res;
        } catch (err: any) {
            console.error("Error fetching sequences: ", err);
            throw err;
        }
    };

    useEffect(() => {
        initializeSequences();
    }, [userId]);

    const filteredSequences = sequences.filter((sequence) =>
        sequence.name.toLowerCase().includes(sequenceQuery.toLowerCase())
    );

    const initializeSequences = async () => {
        try {
            const sequences: RawFullSequence[] = await fetchSequences();
            const cleanedSequences = removeNullFieldsFromSequences(sequences);
            setSequences(cleanedSequences);
            console.log("Set sequences to:", cleanedSequences);
        } catch (err: any) {
            console.error("Error initializing sequences:", err);
            setError(err.message);
        }
    };

    const handleViewItemClick = async (sequenceId: string) => {
        navigate(`/sequences/${sequenceId}`);
    };

    const handleEditItemClick = async (sequenceId: string) => {
        navigate(`/sequences/edit/${sequenceId}`);
    };

    const handleRunClick = async (index: number) => {
        const clickedSequence = filteredSequences[index];
        const sequenceTotalDurationSecs =
            getSequenceTotalDurationSecs(clickedSequence);
        console.log("total duration: ", sequenceTotalDurationSecs);
        setRunItem(clickedSequence);
        if (sequenceTotalDurationSecs === 0) {
            setRunDenyModalIsOpen(true);
        } else {
            navigate(`/sequences/run/${clickedSequence.id}`);
        }
    };

    const handleRunDenyModalClose = () => {
        setRunItem(null);
        setRunDenyModalIsOpen(false);
    };

    const handleDeleteItemClick = async (index: number) => {
        setDeleteItem(sequences[index]);
        setDeleteConfirmModalIsOpen(true);
    };

    const deleteSequence = async (sequenceId: string) => {
        try {
            const res = await api.delete(`/v1/sequences/${sequenceId}`);
            await initializeSequences();
            setDeleteConfirmModalIsOpen(false);
        } catch (err: any) {
            setError("Something went wrong.");
        }
    };

    return (
        <div>
            <div className={pageOutermostFlexColStyles}>
                <div>
                    <IconButton
                        onClick={() => navigate(`/sequences/create`)}
                        icon={<FiPlus size={14} />}
                        // className="bg-green-600 rounded-lg text-lg font-extrabold"
                        className={pageCreateNewButtonStyles}
                    >
                        Create New
                    </IconButton>
                </div>
                <Searchbar
                    placeholder="Search by name..."
                    query={sequenceQuery}
                    setQuery={setSequenceQuery}
                />
                <div>
                    <ReusableTable
                        items={filteredSequences}
                        standardFields={[
                            "name",
                            "description",
                            "notes",
                            "created_at",
                            "exercises",
                        ]}
                        getActionButtonsForItem={(item, index) => [
                            {
                                title: "View",
                                action: () => handleViewItemClick(item.id),
                            },
                            {
                                title: "Edit",
                                action: () => handleEditItemClick(item.id),
                            },
                            {
                                title: "Delete",
                                action: () => handleDeleteItemClick(index),
                            },
                            {
                                title: "Run",
                                action: () => handleRunClick(index),
                            },
                        ]}
                        actionsFieldWidthStyle="w-[210px]"
                    />
                </div>
            </div>
            {runItem && runDenyModalIsOpen && (
                <Modal
                    isOpen={runDenyModalIsOpen}
                    onClose={handleRunDenyModalClose}
                >
                    <div className="flex flex-col gap-y-2 break-words">
                        <p>Uh oh!</p>
                        <p>
                            Your sequence '
                            <span className="font-extrabold">
                                {runItem.name}
                            </span>
                            ' currently does not have any exercises with
                            durations.
                        </p>
                        <p>
                            Please add at least one to the sequence to run the
                            sequence player.
                        </p>
                    </div>
                </Modal>
            )}
            {deleteItem && deleteConfirmModalIsOpen && (
                <SequenceDeleteConfirmModal
                    isModalOpen={deleteConfirmModalIsOpen}
                    setIsModalOpen={setDeleteConfirmModalIsOpen}
                    deleteItem={deleteItem}
                    setDeleteItem={setDeleteItem}
                    deleteSequence={deleteSequence}
                />
            )}
        </div>
    );
};

export default SequencesPage;
