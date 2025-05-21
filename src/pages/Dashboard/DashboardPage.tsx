import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button"
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <CenteredPageLayout title="Dashboard">
      <div className="flex flex-col space-y-4">
        
        <Button onClick={() => navigate("/new")} className="bg-blue-600 text-white px-4 py-2 rounded">
          Create a new sequence. 
        </Button>

        <Button onClick={() => navigate("/saved")} className="bg-green-600 text-white px-4 py-2 rounded">
          View my saved sequences.
        </Button>

        <Button onClick={() => navigate("/exercises")} className="bg-purple-600 text-white px-4 py-2 rounded">
          View exercises.
        </Button>
       
    </div>
    </CenteredPageLayout>
  )
};

export default DashboardPage;
