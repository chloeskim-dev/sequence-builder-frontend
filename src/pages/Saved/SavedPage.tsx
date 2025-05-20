import React from "react";
import SavedPageList from "./SavedPageList";
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";

const SavedPage = () => {
  return (
    <CenteredPageLayout title="Saved">
      <SavedPageList />
    </CenteredPageLayout>
  )
};

export default SavedPage;

