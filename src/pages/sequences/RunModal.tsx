import Modal from "../../components/layouts/Modal";
import { CleanedFullSequence } from "../../constants/types";
import { useNavigate } from "react-router-dom";
import { errorTextStyles } from "../../constants/tailwindClasses";

type RunModalProps = {
  isOpen: boolean;
  onClose: () => void;
  runItem: CleanedFullSequence | null;
  type: "deny" | "confirm";
  runItemIndex?: number;
};

const RunModal: React.FC<RunModalProps> = ({
  isOpen,
  onClose,
  runItem,
  type,
}) => {
  const navigate = useNavigate();

  const runDenyModalErrorText =
    "Please add at least one exercise with a duration to run the class.";
  const runConfirmModalInfoText =
    "Please note that all exercises without a duration will be omitted from the class player.";

  if (!runItem) return null;

  const isDeny = type === "deny";

  const buttons = [
    {
      label: isDeny ? "Edit Class" : "Continue",
      onClick: () =>
        navigate(
          isDeny
            ? `/sequences/edit/${runItem.id}`
            : `/sequences/run/${runItem.id}`,
        ),
      buttonType: "compact" as const,
      type: "button" as const,
    },
    {
      label: "Cancel",
      onClick: onClose,
      buttonType: "compact" as const,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} buttons={buttons}>
      <div className={errorTextStyles}>
        {isDeny ? runDenyModalErrorText : runConfirmModalInfoText}
      </div>
    </Modal>
  );
};

export default RunModal;
