import React, { useState } from "react";
import ExercisesPageList from "./ExercisesPagesList";
import ExercisesPageSearchbar from "./ExercisesPageSearchbar";
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";

const ExercisesPage = () => {
  const [exerciseQuery, setEequenceQuery] = useState("");

  
  return (
    <CenteredPageLayout title="Exercises">
      <ExercisesPageSearchbar
        exerciseQuery={exerciseQuery}
        setExerciseQuery={setEequenceQuery}
      />
      <ExercisesPageList />
    </CenteredPageLayout>

  )
};

export default ExercisesPage;


