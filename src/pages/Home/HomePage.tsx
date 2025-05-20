import React from "react";
import { Button } from "../../components/ui/Button"
import CenteredPageLayout from "../../components/layouts/CenteredPageLayout";

const HomePage = () => (
  <CenteredPageLayout>
    <h1 className="text-2xl font-bold">Welcome Home!</h1>
    <p className="mt-2">You are now logged in.</p>
    <Button>Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="danger">Delete</Button>
    <Button variant="primary" className="w-full">Full Width</Button>
    <button className="bg-blue-600 text-white px-4 py-2 rounded">Test Button</button>
  </CenteredPageLayout>
);

export default HomePage;
