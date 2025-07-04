import Modal from "../../components/layouts/Modal";
import { FavoriteExercise } from "../../constants/types";
import { splitDuration, combineDuration } from "../../utils/timeHelpers";
import { SetStateAction } from "react";

type FavoriteExercisesDeleteConfirmModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    deleteItem: FavoriteExercise;
    setDeleteItem: React.Dispatch<
        React.SetStateAction<FavoriteExercise | null>
    >;
    deleteExercise: (exerciseId: string) => Promise<void>;
};

const FavoriteExercisesDeleteConfirmModal = ({
    isModalOpen,
    setIsModalOpen,
    deleteItem,
    setDeleteItem,
    deleteExercise,
}: FavoriteExercisesDeleteConfirmModalProps) => {
    const closeDeleteConfirmModal = () => {
        setIsModalOpen(false);
        setDeleteItem(null);
    };
    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeDeleteConfirmModal}
            title={`Delete '${deleteItem.name}'?`}
            buttons={[
                {
                    label: "Cancel",
                    onClick: closeDeleteConfirmModal,
                    variant: "secondary",
                },
                {
                    label: "Delete",
                    onClick: () => deleteExercise(deleteItem.id),
                    variant: "danger",
                },
            ]}
        >
            <div className="text-sm flex flex-col gap-y-2">
                <p>Are you sure you want to delete this favorite exercise?</p>
                <p>This action cannot be undone.</p>
            </div>
        </Modal>
    );
};

export default FavoriteExercisesDeleteConfirmModal;
