import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSequence } from "../../hooks/useSequence";
import ItemFieldsList from "../../components/layouts/ItemFieldsList";
import { defaultItemFieldsListLabelStyles } from "../../constants/tailwindClasses";
import Button from "../../components/ui/Button/Button";

const SequenceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { sequence, fetchSequence, error, setError } = useSequence(id);

  useEffect(() => {
    if (id) fetchSequence();
  }, [id]);

  const navigate = useNavigate();
  const onBackButtonClick = () => {
    navigate("/sequences");
  };

  if (!sequence) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center h-full">
      <div className="min-w-[60%] max-w-[95%] lg:max-w-[60%] rounded-xl scrollbar-rounded p-6">
        <ItemFieldsList
          fields={[
            "name",
            "description",
            "notes",
            "exercises",
            "created_at",
            "updated_at",
          ]}
          item={sequence}
          textStyles={"text-my-gb"}
          labelStyles={defaultItemFieldsListLabelStyles}
        />
      </div>
      <div className="py-6">
        <Button
          onClick={() => navigate("/sequences")}
          text="back"
          buttonType="standard"
        />
      </div>
    </div>
  );
};

export default SequenceDetailPage;
