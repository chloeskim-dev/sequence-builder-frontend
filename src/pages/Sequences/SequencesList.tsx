import { SetStateAction, useState } from "react";
import { Sequence } from "../../constants/types";
import { formatUtcToLocalTrimmed } from "../../utils/dateHelpers";
import Modal from "../../components/layouts/Modal";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";

type SequencesListTestProps = {
  sequences: Sequence[];
  handleEditItemClick: (index: number) => void;
  setSequences: React.Dispatch<SetStateAction<Sequence[]>>;
  setRunItem: React.Dispatch<SetStateAction<Sequence>>;
};

export default function SequencesList({
  sequences,
  handleEditItemClick,
  setSequences,
  setRunItem,
}: SequencesListTestProps) {
  return (
    <div className="border border-black mx-4 my-2">
      <div className="hidden md:flex bg-gray-200 p-2 font-bold text-xs">
        <div className="flex-[2] px-2">Name</div>
        <div className="flex-1 px-2">Description</div>
        <div className="flex-[2] px-2">Notes</div>
        <div className="flex-1 px-2">Created at</div>
        <div className="flex-1 px-2">Updated at</div>
        <div className="w-[128px] px-2">Actions</div>
      </div>

      {sequences &&
        sequences.map((sequence, i) => (
          <SequenceRow
            index={i}
            sequence={sequence}
            handleEditItemClick={handleEditItemClick}
            setSequences={setSequences}
            setRunItem={setRunItem}
          />
        ))}
    </div>
  );
}

type SequenceRowProps = {
  sequence: Sequence;
  handleEditItemClick: (index: number) => void;
  setSequences: React.Dispatch<SetStateAction<Sequence[]>>;
  setRunItem: React.Dispatch<SetStateAction<Sequence>>;
  index: number;
};
function SequenceRow({
  sequence,
  handleEditItemClick,
  index,
  setSequences,
  setRunItem,
}: SequenceRowProps) {
  const rowContainerStyles =
    "border-t border-black flex flex-col items-start md:flex-row  md:gap-4 p-2";
  const fieldsContainerStyles =
    "flex flex-col md:flex-row md:flex-wrap md:items-start gap-2 flex-1";
  const actionButtonsContainerStyle = "mt-2 md:mt-0";
  const actionButtonStyles = "text-xs font-bold p-2 border-2 border-black";
  const labelStyles = "text-xs font-bold md:hidden";
  const rowTextStyles = "text-xs";

  const { user, isAuthenticated } = useUser();
  const userId = user?.id ?? null;

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  const handleDeleteItemClick = async (sequenceId: string) => {
    console.log("user wants to delete sequence with id ", sequenceId);
    setIsDeleteConfirmModalOpen(true);
  };

  const deleteItem = async (sequenceId: string) => {
    const res = await api.delete(`/v1/sequences/${sequenceId}`);
    const updatedSequences = await api.get(`/v1/sequences/user/${userId}`);
    setSequences(updatedSequences);
    setIsDeleteConfirmModalOpen(false);
  };

  const handleRunItemClick = async (sequenceId: string) => {
    console.log(sequenceId);

    const res = await api.get(`/v1/sequences/${sequenceId}/full`);
    console.log(`fetched full sequence with id: ${sequenceId}`, res);
    setRunItem(res);
  };
  return (
    <div id="rowContainer" className={rowContainerStyles}>
      <div id="fieldsContainer" className={fieldsContainerStyles}>
        <div className="flex-[2] px-2">
          <label className={labelStyles}>Name*</label>
          <div className={rowTextStyles}>{sequence.name}</div>
        </div>
        <div className="flex-1 px-2">
          <label className={labelStyles}>Direction</label>
          <div className={rowTextStyles}>{sequence.description}</div>
        </div>
        <div className="flex-[2] px-2">
          <label className={labelStyles}>Notes</label>
          <div className={rowTextStyles}>{sequence.notes}</div>
        </div>
        <div className="flex-1 px-2">
          <label className={labelStyles}>Created at</label>
          <div className={rowTextStyles}>
            {formatUtcToLocalTrimmed(sequence.created_at)}
          </div>
        </div>
        <div className="flex-1 px-2">
          <label className={labelStyles}>Updated at</label>
          <div className={rowTextStyles}>
            {formatUtcToLocalTrimmed(sequence.updated_at)}
          </div>
        </div>
      </div>

      <div id="actionButtonsContainer" className={actionButtonsContainerStyle}>
        <div className="flex gap-2 justify-center">
          <button
            className={actionButtonStyles}
            onClick={() => handleEditItemClick(index)}
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteItemClick(sequence.id)}
            className={actionButtonStyles}
          >
            Delete
          </button>
          <button
            onClick={() => {
              handleRunItemClick(sequence.id);
            }}
            className={actionButtonStyles}
          >
            Run
          </button>
        </div>
      </div>

      {isDeleteConfirmModalOpen && (
        <Modal
          isOpen={isDeleteConfirmModalOpen}
          onClose={() => setIsDeleteConfirmModalOpen(false)}
          title={`Delete '${sequence.name}'?`}
          buttons={[
            {
              label: "Cancel",
              onClick: () => setIsDeleteConfirmModalOpen(false),
              variant: "secondary",
            },
            {
              label: "Delete",
              onClick: () => deleteItem(sequence.id),
              variant: "danger",
            },
          ]}
        >
          <div className="text-sm">
            <p>
              Are you sure you want to delete this sequence? This action cannot
              be undone.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
