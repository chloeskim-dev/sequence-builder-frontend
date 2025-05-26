import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";
import NewPageSequenceTable from "./NewPageSequenceTable";

const NewPage = () => {
  return (
    <CenteredPageLayout title="Create A New Sequence">
      <NewPageSequenceTable />
    </CenteredPageLayout>
  );
};

export default NewPage;
