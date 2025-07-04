import React, { useState, useEffect } from "react";
import { Sequence, SequenceFormInputs } from "../../constants/types";
import { FiPlus } from "react-icons/fi";
import { IconButton } from "../../components/ui/IconButton";
import Searchbar from "../../components/ui/Searchbar";
import SequencesList from "./SequencesList";
// import SequencesCreateModal from "./SequencesCreateModal";
// import SequencesEditModal from "./SequencesEditModal";
import WorkingGuidedSeqPlayer from "./WorkingGuidedSeqPlayer";
import { sampleInitialSequences } from "../../constants/exampleItems";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import Modal from "../../components/layouts/Modal";
import FavoriteExerciseDetailModal from "../FavoriteExercises/FavoriteExercisesDetailModal";
import SequenceDetailModal from "./SequenceDetailModal";
import SequenceDeleteConfirmModal from "./SequenceDeleteConfirmModal";
import { SubmitHandler } from "react-hook-form";
import { makeSequencePayloadFromFormData } from "../../utils/formHelpers";
import SequencesFormModalBase from "./SequenceFormModalBase";

const SequencesPage = () => {
    const [sequenceQuery, setSequenceQuery] = useState("");
    const [sequences, setSequences] = useState(sampleInitialSequences);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
        useState(false);
    const [detailItem, setDetailItem] = useState<Sequence | null>(null);
    const [editItem, setEditItem] = useState<Sequence | null>();
    const [deleteItem, setDeleteItem] = useState<Sequence | null>(null);
    const [runItem, setRunItem] = useState<Sequence | null>();
    const [error, setError] = useState("");
    const { user } = useUser();
    const userId = user?.id ?? null;

    const onCreateFormSubmit: SubmitHandler<SequenceFormInputs> = async (
        formData
    ) => {
        const payload = makeSequencePayloadFromFormData(
            formData,
            userId as string
        );

        console.log("submitting payload for creating new sequence: ", payload);
        try {
            const res = await api.post(`/v1/sequences/user/${userId}`, payload);
            console.log("API response:", res);
        } catch (err: any) {
            console.error("Error creating sequence:", err.message);
        }
        const updatedSequences = await api.get(`/v1/sequences/user/${userId}`);
        console.log(
            "fetched updated sequences for user after creation: ",
            updatedSequences
        );
        setSequences(updatedSequences);
        setIsCreateModalOpen(false);
    };

    const onEditFormSubmit: SubmitHandler<SequenceFormInputs> = async (
        formData
    ) => {
        const payload = makeSequencePayloadFromFormData(
            formData,
            userId as string
        );
        console.log(
            `submitting form data for editing sequence with id ${
                editItem!.id
            }: `,
            payload
        );
        try {
            const res = await api.put(`/v1/sequences/${editItem!.id}`, payload);
            console.log("API response:", res);
        } catch (err: any) {
            console.error("Error editing sequence:", err.message);
        }

        const updatedSequences = await api.get(`/v1/sequences/user/${userId}`);
        console.log(
            "fetched updated sequences for user after editing sequence: ",
            updatedSequences
        );
        setSequences(updatedSequences);
        setIsEditModalOpen(false);
    };

    const fetchSequences = async () => {
        try {
            const res = await api.get(`/v1/sequences/user/${userId}`);
            return res;
        } catch (err: any) {
            console.error("Error fetching sequences:", err);
            throw err;
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                const res = await fetchSequences();
                setSequences(res);
            } catch (err: any) {
                console.error("Error initializing sequences:", err);
                setError(err.message);
            }
        };
        initializeData();
    }, [userId]);

    const filteredSequences = sequences.filter((sequence) =>
        sequence.name.toLowerCase().includes(sequenceQuery.toLowerCase())
    );

    const handleViewItemClick = async (index: number) => {
        const sequenceId = sequences[index].id;
        const res = await api.get(`/v1/sequences/${sequenceId}/full`);
        setDetailItem(res);
        setIsDetailModalOpen(true);
    };

    const handleEditItemClick = async (index: number) => {
        const sequenceId = sequences[index].id;
        const res = await api.get(`/v1/sequences/${sequenceId}/full`);
        setEditItem(res);
        setIsEditModalOpen(true);
    };

    const deleteSequence = async (sequenceId: string) => {
        const res = await api.delete(`/v1/sequences/${sequenceId}`);
        console.log(`deleted full sequence with id: ${sequenceId}`, res);
        let updatedSequences = fetchSequences();
        setSequences(await updatedSequences);
        setIsDeleteConfirmModalOpen(false);
    };

    const handleDeleteItemClick = async (index: number) => {
        setDeleteItem(sequences[index]);
        setIsDeleteConfirmModalOpen(true);
    };

    return (
        <div>
            <div id="sequencesListHeader" className="mx-4">
                <div>
                    <text className="font-bold">My sequences</text>
                </div>
                <div className="mb-2 mt-1">
                    <IconButton
                        onClick={() => setIsCreateModalOpen(true)}
                        icon={<FiPlus size={14} />}
                        className="bg-green-600"
                    >
                        Add new
                    </IconButton>
                </div>
                <div className="w-full">
                    <Searchbar
                        placeholder="Search by name..."
                        query={sequenceQuery}
                        setQuery={setSequenceQuery}
                    />
                </div>
            </div>

            <SequencesList
                sequences={filteredSequences}
                handleViewItemClick={handleViewItemClick}
                handleEditItemClick={handleEditItemClick}
                handleDeleteItemClick={handleDeleteItemClick}
                setSequences={setSequences}
                setRunItem={
                    setRunItem as React.Dispatch<React.SetStateAction<Sequence>>
                }
            />

            {detailItem && isDetailModalOpen && (
                <SequenceDetailModal
                    isModalOpen={isDetailModalOpen}
                    setIsModalOpen={setIsDetailModalOpen}
                    detailItem={detailItem}
                    setDetailItem={setDetailItem}
                />
            )}

            <SequencesFormModalBase
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                setSequences={setSequences}
                title="Create a new sequence."
                formId="create-sequence-form"
                onSubmit={onCreateFormSubmit}
            />

            {editItem && isEditModalOpen && (
                <SequencesFormModalBase
                    isModalOpen={isEditModalOpen}
                    setIsModalOpen={setIsEditModalOpen}
                    setSequences={setSequences}
                    editItem={editItem}
                    title="Edit your sequence."
                    formId="edit-sequence-form"
                    onSubmit={onEditFormSubmit}
                />
            )}

            {deleteItem && isDeleteConfirmModalOpen && (
                <SequenceDeleteConfirmModal
                    isModalOpen={isDeleteConfirmModalOpen}
                    setIsModalOpen={setIsCreateModalOpen}
                    deleteItem={deleteItem}
                    setDeleteItem={setDeleteItem}
                    deleteSequence={deleteSequence}
                />
            )}
            {/* <SequencesCreateModal
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                setSequences={setSequences}
            /> */}

            {/* {editItem && isEditModalOpen && (
                <SequencesEditModal
                    isModalOpen={isEditModalOpen}
                    setIsModalOpen={setIsEditModalOpen}
                    setSequences={setSequences}
                    editItem={editItem}
                />
            )} */}
            {/* {runItem && <WorkingGuidedSeqPlayer sequence={runItem} />} */}
        </div>
    );
};

export default SequencesPage;
