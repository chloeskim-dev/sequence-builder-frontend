import { useEffect } from "react";
import SequenceForm from "../../components/forms/SequenceForm";
import { SubmitHandler } from "react-hook-form";
import { SequenceFormInputs } from "../../constants/types";
import { makeSequencePayloadFromFormData } from "../../utils/formHelpers";
import { useUser } from "../../contexts/UserContext";
import { api } from "../../utils/api";

import { useNavigate, useParams } from "react-router-dom";
import { useSequence } from "../../hooks/useSequence";
import Button from "../../components/ui/Button/Button";

const SequenceEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { sequence, fetchSequence, error, setError } = useSequence(id);
  const { user } = useUser();
  const userId = user?.id ?? null;

  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchSequence();
  }, [id]);

  const onEditFormSubmit: SubmitHandler<SequenceFormInputs> = async (
    formData,
  ) => {
    try {
      const payload = makeSequencePayloadFromFormData(
        formData,
        userId as string,
      );
      const res = await api.put(`/v1/sequences/${sequence!.id}`, payload);
      navigate("/sequences");
    } catch (err: any) {
      setError(
        "Something went wrong while fetching your sequence.  Please try again later.",
      );
    }
    navigate("/sequences");
  };

  if (!sequence) return <p>Loading...</p>;

  return (
    <div className="h-full flex flex-col">
      <SequenceForm
        onSubmit={onEditFormSubmit}
        formId="edit-sequence-form"
        title="Edit Sequence"
        editSequence={sequence}
      />
      <div className="py-6 flex flex-col items-center justify-center">
        <div className="flex flex-row gap-x-2 justify-center">
          {/* <PageBottomButton
                        type="submit"
                        form="edit-sequence-form"
                        appearance="primary"
                        text="Submit"
                        // disabled={sequenceFormMethods.formState.isSubmitting}
                    />

                    <PageBottomButton
                        onClick={() => navigate("/sequences")}
                        appearance="secondary"
                        text="Cancel"
                    /> */}
          <Button
            text="submit"
            type="submit"
            buttonType="standard"
            form="edit-sequence-form"
          />
          <Button
            onClick={() => navigate("/sequences")}
            text="cancel"
            buttonType="standard"
          />
        </div>
      </div>
    </div>
  );
};

export default SequenceEditPage;
