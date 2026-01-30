import { useEffect, useState } from "react";
import { CleanedFullSequence } from "../../constants/types";
import Searchbar from "../../components/ui/Searchbar";
import { useUser } from "../../contexts/UserContext";
import { getSequenceTotalDurationSecs } from "../../utils/cleanupHelpers";
import { useNavigate } from "react-router-dom";
import { CompactTable } from "../../components/layouts/CompactTable";
import {
  errorTextStyles,
  infoTextStyles,
  sequencesTableGridColStyles,
} from "../../constants/tailwindClasses";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { SortDirection } from "../../utils/listHelpers";
import { useSequences } from "../../hooks/useSequences";

import Button from "../../components/ui/Button/Button";
import RunModal from "./RunModal";

const SequencesPage = () => {
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const [itemToDelete, setItemToDelete] = useState<CleanedFullSequence | null>(
    null,
  );
  const [itemToRun, setRunItem] = useState<CleanedFullSequence | null>(null);

  const [deleteConfirmModalIsOpen, setDeleteConfirmModalIsOpen] =
    useState(false);
  const [runDenyModalIsOpen, setRunDenyModalIsOpen] = useState(false);
  const [runConfirmModalIsOpen, setRunConfirmModalIsOpen] = useState(false);

  const { user } = useUser();
  const userId = user?.id ?? null;

  const navigate = useNavigate();

  const {
    // fetch
    fetchSequences,
    fetchedSequences,
    // display
    displaySequences,
    setSequencesToDisplay,
    // delete
    deleteSequence,
    // error
    error,
  } = useSequences(userId!);

  useEffect(() => {
    if (!userId) return;
    fetchSequences();
  }, [userId, fetchSequences]);

  useEffect(() => {
    setSequencesToDisplay(sortBy, sortDirection, searchQuery);
  }, [
    sortBy,
    sortDirection,
    searchQuery,
    fetchedSequences,
    setSequencesToDisplay,
  ]);

  // convenience booleans

  const userHasNoSequences =
    fetchedSequences !== undefined && fetchedSequences.length === 0;

  const userHasSequencesButNoneMatchQuery =
    fetchedSequences !== undefined &&
    fetchedSequences.length !== 0 &&
    displaySequences !== undefined &&
    displaySequences.length === 0;

  const thereAreSequencesToDisplay =
    displaySequences !== undefined && displaySequences.length !== 0;

  // info and error texts

  const userHasNoSequencesInfoText =
    "There are no classes in your collection currently.";
  const userHasSequencesButNoneMatchQueryInfoText =
    "There are no classes in your collection that match your search.";

  // action button click handlers

  const handleViewItemClick = async (sequenceId: string) => {
    navigate(`/sequences/${sequenceId}`);
  };

  const handleEditItemClick = async (sequenceId: string) => {
    navigate(`/sequences/edit/${sequenceId}`);
  };

  const handleDeleteItemClick = (index: number) => {
    const sequence = displaySequences![index];
    setItemToDelete(sequence);
    setDeleteConfirmModalIsOpen(true);
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
      setRunConfirmModalIsOpen(true);
    }
  };

  // modal closure handlers

  const handleRunModalClose = () => {
    setRunItem(null);
    setRunDenyModalIsOpen(false);
    setRunConfirmModalIsOpen(false);
  };

  const deleteUponConfirmation = async () => {
    if (!itemToDelete) return;
    deleteSequence(itemToDelete.id, () => {
      setSearchQuery("");
      setDeleteConfirmModalIsOpen(false);
    });
  };

  // unique action button creator for sequences

  const getActionButtonsForSequences = (item: any, index: number) => [
    <Button
      text="view"
      buttonType="compact"
      onClick={() => handleViewItemClick(item.id)}
    />,
    <Button
      text="edit"
      buttonType="compact"
      onClick={() => handleEditItemClick(item.id)}
    />,
    <Button
      text="del"
      buttonType="compact"
      onClick={() => handleDeleteItemClick(index)}
    />,
    <Button
      text="start"
      buttonType="compact"
      onClick={() => handleRunClick(index)}
    />,
  ];

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mx-4 flex flex-col gap-4 items-center h-full">
        <div
          className={`flex flex-col gap-5 justify-between items-center w-full px-2`}
        >
          {/* Create New Button */}
          <Button
            className="-mt-[10px]"
            onClick={() => navigate(`/sequences/create`)}
            text="Create New"
            buttonType="standard"
          />

          {/* Searchbar */}
          <Searchbar
            placeholder="Search by name..."
            query={searchQuery}
            setQuery={setSearchQuery}
          />
          {error && <div className={`${errorTextStyles} mt-2`}>{error}</div>}
        </div>

        {/* Sequences Table */}
        {thereAreSequencesToDisplay && (
          <div className="w-full flex-1 px-2">
            <CompactTable
              items={displaySequences}
              standardFields={[
                "name",
                "description",
                "notes",
                "created_at",
                // "exercises",
                "total_duration",
              ]}
              getActionButtonsForItem={getActionButtonsForSequences}
              listType="sequences"
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              gridColStyles={sequencesTableGridColStyles}
            />
          </div>
        )}

        {/* No Sequences Added Message */}
        {userHasNoSequences && (
          <div className={`${infoTextStyles}`}>
            {userHasNoSequencesInfoText}
          </div>
        )}

        {/* No Sequences Matching Query Message */}
        {userHasSequencesButNoneMatchQuery && (
          <div className={`${infoTextStyles}`}>
            {userHasSequencesButNoneMatchQueryInfoText}
          </div>
        )}
      </div>

      {/* Run Deny Modal */}
      {itemToRun && runDenyModalIsOpen && (
        <RunModal
          isOpen={runDenyModalIsOpen}
          onClose={handleRunModalClose}
          runItem={itemToRun}
          type="deny"
        />
      )}

      {/* Run Confirm Modal */}
      {itemToRun && runConfirmModalIsOpen && (
        <RunModal
          isOpen={runConfirmModalIsOpen}
          onClose={handleRunModalClose}
          runItem={itemToRun}
          type="confirm"
        />
      )}

      {/* Delete Confirm Modal */}
      {itemToDelete && deleteConfirmModalIsOpen && (
        <DeleteConfirmModal
          isModalOpen={deleteConfirmModalIsOpen}
          setIsModalOpen={setDeleteConfirmModalIsOpen}
          deleteItem={itemToDelete}
          setDeleteItem={setItemToDelete}
          onDelete={deleteUponConfirmation}
          title="Delete class?"
        />
      )}
    </div>
  );
};

export default SequencesPage;
