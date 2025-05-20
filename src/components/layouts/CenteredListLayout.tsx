import React, { ReactNode } from "react";


type Props = {
  title?: string;
  children: ReactNode;
};

const CenteredListLayout = ({ title, children }: Props) => (
  <div className="flex justify-center items-start min-h-screen pt-16 bg-gray-50">
    <div className="w-full max-w-md p-4 bg-white rounded shadow">
      {title && <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>}
      <ul className="space-y-2">{children}</ul>
    </div>
  </div>
);

export default CenteredListLayout;