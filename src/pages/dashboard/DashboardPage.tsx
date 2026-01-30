import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button/Button";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col sm:grid grid-cols-2 gap-4 mx-2">
        <Button
          text="Classes"
          onClick={() => navigate("/sequences")}
          buttonType="standard"
        />
        <Button
          text="Favorite Exercises"
          onClick={() => navigate("/favorite-exercises")}
          buttonType="standard"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
