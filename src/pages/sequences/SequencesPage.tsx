import { useState, useEffect } from "react";
import { CleanedFullSequence } from "../../constants/types";
import { FiPlus } from "react-icons/fi";
import { IconButton } from "../../components/ui/IconButton";
import Searchbar from "../../components/ui/Searchbar";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import { getSequenceTotalDurationSecs } from "../../utils/cleanupHelpers";
import { useNavigate } from "react-router-dom";
import { ReusableTable } from "../../components/layouts/ReusableTable";
import {
    createNewButtonStyles,
    pageOutermostFlexColStyles,
} from "../../constants/tailwindClasses";
import Modal from "../../components/layouts/Modal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { SortDirection } from "../../utils/listHelpers";
import { useSequences } from "../../hooks/useSequences.";

const SequencesPage = () => {
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteConfirmModalIsOpen, setDeleteConfirmModalIsOpen] =
        useState(false);
    const [deleteItem, setDeleteItem] = useState<CleanedFullSequence | null>(
        null
    );
    const [runDenyModalIsOpen, setRunDenyModalIsOpen] = useState(false);
    const [runItem, setRunItem] = useState<CleanedFullSequence | null>(null);
    const { user } = useUser();
    const userId = user?.id ?? null;

    const navigate = useNavigate();

    const {
        fetchedSequences,
        setFetchedSequences,
        fetchSequences,
        displaySequences,
        setDisplaySequences,
        setSequencesToDisplay,
        error,
        setError,
    } = useSequences(userId!);

    useEffect(() => {
        fetchSequences();
    }, []);

    useEffect(() => {
        setSequencesToDisplay(sortBy, sortDirection, searchQuery);
    }, [sortBy, sortDirection, searchQuery, fetchedSequences]);

    const fetchResultsAreEmpty =
        fetchedSequences !== undefined && fetchedSequences.length === 0;

    const thereAreNoSequencesMatchingQuery =
        fetchedSequences !== undefined &&
        fetchedSequences.length !== 0 &&
        displaySequences !== undefined &&
        displaySequences.length === 0;

    const thereAreSequencesToDisplay =
        displaySequences !== undefined && displaySequences.length !== 0;

    const handleViewItemClick = async (sequenceId: string) => {
        navigate(`/sequences/${sequenceId}`);
    };

    const handleEditItemClick = async (sequenceId: string) => {
        navigate(`/sequences/edit/${sequenceId}`);
    };

    const handleDeleteItemClick = async (index: number) => {
        if (!thereAreSequencesToDisplay) return;
        setDeleteItem(displaySequences[index]);
        setDeleteConfirmModalIsOpen(true);
    };

    const deleteSequence = async (sequenceId: string) => {
        try {
            const res = await api.delete(`/v1/sequences/${sequenceId}`);
            setSearchQuery("");
            fetchSequences();
            setDeleteConfirmModalIsOpen(false);
        } catch (err: any) {
            setError(
                "Something went wrong while deleting your sequence.  Please try again later."
            );
        }
    };

    const handleRunClick = async (index: number) => {
        if (!thereAreSequencesToDisplay) return;
        const clickedSequence = displaySequences[index];
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

    return (
        <div className="">
            <div className={pageOutermostFlexColStyles}>
                <div>
                    <IconButton
                        onClick={() => navigate(`/sequences/create`)}
                        icon={<FiPlus size={16} />}
                        className={createNewButtonStyles}
                    >
                        Create New
                    </IconButton>
                </div>
                <Searchbar
                    placeholder="Search by name..."
                    query={searchQuery}
                    setQuery={setSearchQuery}
                />
                {error && (
                    <div className="text-red-600 font-semibold mt-2">
                        {error}
                    </div>
                )}
                {thereAreSequencesToDisplay && (
                    <div>
                        <ReusableTable
                            items={displaySequences}
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
                            listType="sequences"
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            sortDirection={sortDirection}
                            setSortDirection={setSortDirection}
                        />
                    </div>
                )}
                {fetchResultsAreEmpty && (
                    <div className="text-white">
                        You have not added any sequences. Create a sequence by
                        clicking the button above.
                    </div>
                )}

                {thereAreNoSequencesMatchingQuery && (
                    <div>
                        There are no sequences that match your query by name.
                    </div>
                )}
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
                <DeleteConfirmModal
                    isModalOpen={deleteConfirmModalIsOpen}
                    setIsModalOpen={setDeleteConfirmModalIsOpen}
                    deleteItem={deleteItem}
                    setDeleteItem={setDeleteItem}
                    onDelete={deleteSequence}
                    title="Delete sequence?"
                />
            )}
        </div>
    );
};

export default SequencesPage;
