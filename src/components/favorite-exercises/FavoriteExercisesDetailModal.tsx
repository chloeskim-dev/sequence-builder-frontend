import { SetStateAction } from "react";
import Modal from "../layouts/Modal";
import { FavoriteExercise } from "../../constants/types";
import ReusableDetailsList from "../layouts/ReusableDetailsList";
import { CleanedUpFavoriteExercise } from "../../utils/sequenceHelpers";

type FavoriteExerciseDetailModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    detailItem: CleanedUpFavoriteExercise;
    setDetailItem: React.Dispatch<
        React.SetStateAction<CleanedUpFavoriteExercise | null>
    >;
};

export default function FavoriteExerciseDetailModal({
    isModalOpen,
    setIsModalOpen,
    detailItem,
    setDetailItem,
}: FavoriteExerciseDetailModalProps) {
    const closeDetailModal = () => {
        setIsModalOpen(false);
        setDetailItem(null);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeDetailModal}
            title={"Favorite Exercise Details"}
            buttons={[
                {
                    label: "Close",
                    onClick: () => setIsModalOpen(false),
                    variant: "secondary",
                },
            ]}
        >
            <ReusableDetailsList
                fields={[
                    "name",
                    "direction",
                    "duration",
                    "resistance",
                    "notes",
                ]}
                item={detailItem}
            />
        </Modal>
    );
}
