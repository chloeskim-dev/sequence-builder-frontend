import React from "react";
import CenteredListLayout from "../../components/layouts/CenteredListLayout";

const SavedPageList = () => {
  return (
    <div>
      <h1>SavedPageList Component</h1>
        <CenteredListLayout title="Available Exercises">
          <li>Push-ups</li>
          <li>Squats</li>
          <li>Plank</li>
        </CenteredListLayout>
    </div>
  )
};

export default SavedPageList;