import React, { useState } from "react";
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";
import SequencesSearchbar from "./SequencesSearchbar";
import SequencesList from "./SequencesList";
import { Exercise, Sequence } from "../../constants/types";
import Modal from "../../components/layouts/Modal";
import { SequenceEditForm } from "./SequenceEditForm";
import SequenceCreateForm from "./SequenceCreateForm";
import { FiList } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

const sampleExercise_1: Exercise = {
  id: "22222222-2222-2222-222222222222",
  name: "sequence 1 exercise 1 name",
  direction: "sequence 1 exercise 1 direction",
  durationSecs: 30,
  resistance: "sequence 1 exercise 1 resistance",
  notes: "sequence 1 exercise 1 notes",
  createdAt: "2025-06-13 21:38:17.099782",
  orderIndex: 1,
};
const sampleExercise_2: Exercise = {
  id: "33333333-3333-3333-333333333333",
  name: "sequence 1 exercise 2 name",
  direction: "sequence 1 exercise 2 direction",
  durationSecs: 30,
  resistance: "sequence 1 exercise 2 resistance",
  notes: "sequence 1 exercise 2 notes",
  createdAt: "2025-06-13 21:38:17.099782",
  orderIndex: 2,
};

const sampleSequence_1: Sequence = {
  id: "11111111-1111-1111-111111111111",
  userId: "aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa",
  name: "sample saved sequence 1 name",
  description: "sample saved sequence 1 description",
  notes: "sample saved sequence 1 notes",
  createdAt: "2025-06-13 21:38:17.099782",
  updatedAt: "2025-06-13 21:38:17.099782",
  exercises: [sampleExercise_1, sampleExercise_2],
};
const sampleExercise_3: Exercise = {
  id: "55555555-5555-5555-555555555555",
  name: "sequence 2 exercise 1 name",
  direction: "sequence 2 exercise 1 direction",
  durationSecs: 30,
  resistance: "sequence 2 exercise 1 resistance",
  notes: "sequence 2 exercise 1 notes",
  createdAt: "2025-06-13 21:38:17.099782",
  orderIndex: 1,
};
const sampleExercise_4: Exercise = {
  id: "66666666-6666-6666-666666666666",
  name: "sequence 2 exercise 2 name",
  direction: "sequence 2 exercise 2 direction",
  durationSecs: 30,
  resistance: "sequence 2 exercise 2 resistance",
  notes: "sequence 2 exercise 2 notes",
  createdAt: "2025-06-13 21:38:17.099782",
  orderIndex: 2,
};

const sampleSequence_2: Sequence = {
  id: "11111111-1111-1111-111111111111",
  userId: "aaaaaaaa-aaaa-aaaa-aaaaaaaaaaaa",
  name: "sample saved sequence 2 name",
  description: "sample saved sequence 2 description",
  notes: "sample saved sequence 2 notes",
  createdAt: "2025-06-13 21:38:17.099782",
  updatedAt: "2025-06-13 21:38:17.099782",
  exercises: [sampleExercise_3, sampleExercise_4],
};

const sampleInitialSequences = [sampleSequence_1, sampleSequence_2];

const SequencesPage = () => {
  const [sequenceQuery, setSequenceQuery] = useState("");
  const [sequences, setSequences] = useState(sampleInitialSequences);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(sampleSequence_1);

  const handleEditItemClick = (index: number) => {
    setEditItem(sequences[index]);
    setIsEditModalOpen(true);
  };

  const filteredSequences = sequences.filter((sequence) =>
    sequence.name.toLowerCase().includes(sequenceQuery.toLowerCase())
  );

  return (
    <CenteredPageLayout title="Sequences" icon={<FiList size={18} />}>
      <div className="max-w-md mx-auto my-4 px-4 space-y-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          <FiPlus size={18} />
          Create New
        </button>
        <div className="w-full">
          <SequencesSearchbar
            sequenceQuery={sequenceQuery}
            setSequenceQuery={setSequenceQuery}
          />
        </div>
      </div>
      <SequencesList
        sequences={filteredSequences}
        handleEditItemClick={handleEditItemClick}
      />
      {/* Edit modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit your sequence.</h2>
        <div className="text-gray-600">
          <SequenceEditForm editItem={editItem} />
        </div>
      </Modal>

      {/* Create modal */}
      <button></button>
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <h2 className="text-xl font-bold mb-4">Create a new sequence.</h2>
        <div className="text-gray-600">
          <SequenceCreateForm />
        </div>
      </Modal>
    </CenteredPageLayout>
  );
};

export default SequencesPage;
