import React from "react";
import CenteredListLayout from "../../components/layouts/CenteredListLayout";

const ExercisesPageList = () => {
  return (
    <div>
      <h2>ExercisesPageList Component</h2>
        <CenteredListLayout title="Available Exercises">
          <li>Push-ups</li>
          <li>Squats</li>
          <li>Plank</li>
        </CenteredListLayout>
    </div>
  )
};

export default ExercisesPageList;