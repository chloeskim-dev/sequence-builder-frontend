import React, { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  children?: ReactNode;
};

const CenteredPageLayout = ({ title, children }: Props) => {
  return (
    <div className="flex flex-col h-full w-full p-4 overflow-hidden">
      <div className="flex flex-col h-full overflow-auto bg-white rounded shadow">
        {/* Sticky title */}
        {title && (
          <div className="sticky top-0 z-10 bg-white p-4 border-b font-bold text-xl">
            {title}
          </div>
        )}

        {/* Scrollable content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};


export default CenteredPageLayout;
