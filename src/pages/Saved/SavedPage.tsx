import React, { useState } from "react";
import SavedPageList from "./SavedPageList";
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";
import SavedPageSearchbar from "./SavedPageSearchbar";

const SavedPage = () => {
  const [sequenceQuery, setSequenceQuery] = useState("");
  
  return (
    <CenteredPageLayout title="Saved">
      <SavedPageSearchbar
        sequenceQuery={sequenceQuery}
        setSequenceQuery={setSequenceQuery}
      />
      <SavedPageList />
    </CenteredPageLayout>
  )
};

export default SavedPage;

