import { SetStateAction, useEffect } from "react";
import Modal from "../../components/layouts/Modal";
import { FavoriteExercise } from "../../constants/types";
import { splitDuration, combineDuration } from "../../utils/timeHelpers";
import { useUser } from "../../contexts/UserContext";

type FavoriteExerciseDetailModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    detailItem: FavoriteExercise;
    setDetailItem: React.Dispatch<
        React.SetStateAction<FavoriteExercise | null>
    >;
};

const labelStyles = "block font-medium text-sm mb-1";
const textStyles = "text-sm";

export default function FavoriteExerciseDetailModal({
    isModalOpen,
    setIsModalOpen,
    detailItem,
    setDetailItem,
}: FavoriteExerciseDetailModalProps) {
    const { user, isAuthenticated } = useUser();
    const userId = user?.id ?? null;

    const { splitMinutes, splitSeconds } = splitDuration(
        detailItem.duration_secs
    );

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
                    label: "Cancel",
                    onClick: () => setIsModalOpen(false),
                    variant: "secondary",
                },
            ]}
        >
            <div className="flex flex-col gap-y-4">
                {detailItem.direction && detailItem.direction !== "" && (
                    <div>
                        <label htmlFor="direction" className={labelStyles}>
                            Direction
                        </label>
                        <div id="direction" className={textStyles}>
                            {detailItem.direction}
                        </div>
                    </div>
                )}

                {detailItem.duration_secs && (
                    <div>
                        <span className={labelStyles}>Duration</span>
                        <div className="flex items-end gap-4">
                            <div>
                                <label
                                    htmlFor="durationMinutes"
                                    className="block text-xs mb-1"
                                >
                                    Minutes
                                </label>
                                <div id="durationMin" className={textStyles}>
                                    {splitMinutes}
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="durationSeconds"
                                    className="block text-xs mb-1"
                                >
                                    Seconds
                                </label>
                                <div
                                    id="durationSeconds"
                                    className={textStyles}
                                >
                                    {splitSeconds}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {detailItem.resistance && detailItem.resistance !== "" && (
                    <div>
                        <label htmlFor="resistance" className={labelStyles}>
                            Resistance
                        </label>
                        <div id="resistance" className={textStyles}>
                            {detailItem.resistance}
                        </div>
                    </div>
                )}
                {detailItem.notes && detailItem.notes !== "" && (
                    <div>
                        <label htmlFor="notes" className={labelStyles}>
                            Notes
                        </label>
                        <div id="notes" className={textStyles}></div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
