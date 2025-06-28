import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";
import { FiHeart } from "react-icons/fi";
import { FiList } from "react-icons/fi"; // common and clear

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <CenteredPageLayout title="Dashboard">
      <div className="flex flex-col space-y-4">
        {/* <Button
          onClick={() => navigate("/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center"
        >
          Create a new sequence.
        </Button> */}

        <Button
          onClick={() => navigate("/sequences")}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          My Sequences
          <FiList size={18} />
        </Button>

        <Button
          onClick={() => navigate("/favorite-exercises")}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          My Favorite Exercises
          <FiHeart size={18} />
        </Button>
      </div>
    </CenteredPageLayout>
  );
};

export default DashboardPage;
