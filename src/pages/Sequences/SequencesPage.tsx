import React, { useState, useEffect } from "react";
import { Sequence } from "../../constants/types";
import { FiPlus } from "react-icons/fi";
import { IconButton } from "../../components/ui/IconButton";
import Searchbar from "../../components/ui/Searchbar";
import SequencesList from "./SequencesList";
import SequencesCreateModal from "./SequencesCreateModal";
import SequencesEditModal from "./SequencesEditModal";
import WorkingGuidedSeqPlayer from "./WorkingGuidedSeqPlayer";
import { sampleInitialSequences } from "../../constants/exampleItems";
import { api } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";

const SequencesPage = () => {
  const [sequenceQuery, setSequenceQuery] = useState("");
  const [sequences, setSequences] = useState(sampleInitialSequences);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Sequence | null>();
  const [runItem, setRunItem] = useState<Sequence | null>();
  const [error, setError] = useState("");
  const { user } = useUser();
  const userId = user?.id ?? null;
  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const res = await api.get(`/v1/sequences/user/${userId}`);
        console.log("fetched sequences for user: ", res);
        setSequences(res);
      } catch (err: any) {
        console.error("Error fetching sequences:", err);
        setError(err.message);
      }
    };

    fetchSequences();
  }, [userId]);

  const handleEditItemClick = async (index: number) => {
    console.log("clicked sequence with index ", index);
    console.log("user wants to edit: ", sequences[index]);
    const sequenceId = sequences[index].id;
    const res = await api.get(`/v1/sequences/${sequenceId}/full`);
    console.log(`fetched full sequence with id: ${sequenceId}`, res);
    setEditItem(res);
    setIsEditModalOpen(true);
  };

  const filteredSequences = sequences.filter((sequence) =>
    sequence.name.toLowerCase().includes(sequenceQuery.toLowerCase())
  );

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
        handleEditItemClick={handleEditItemClick}
        setSequences={setSequences}
        setRunItem={
          setRunItem as React.Dispatch<React.SetStateAction<Sequence>>
        }
      />

      {editItem && (
        <SequencesEditModal
          isModalOpen={isEditModalOpen}
          setIsModalOpen={setIsEditModalOpen}
          setSequences={setSequences}
          editItem={editItem}
        />
      )}
      <SequencesCreateModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        setSequences={setSequences}
      />

      {runItem && <WorkingGuidedSeqPlayer sequence={runItem} />}
    </div>
  );
};

export default SequencesPage;
