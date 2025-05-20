import React from "react";
import ExercisesPageList from "./ExercisesPagesList";
import ExercisesPageSearchbar from "./ExercisesPageSearchbar";
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";

const ExercisesPage = () => {
  return (
    <CenteredPageLayout title="Exercises">
      <ExercisesPageSearchbar />
      <ExercisesPageList />
    </CenteredPageLayout>
  )
};

export default ExercisesPage;


