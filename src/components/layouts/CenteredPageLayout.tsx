import React, { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  children?: ReactNode;
};

const CenteredPageLayout = ({ title, children }: Props) => {
  return (
   <div className="bg-purple-300 flex flex-col h-full w-full p-1">
      {/* Top div - natural height, always visible */}
      <div>
        {title && (
          <div className="bg-purple-200 text-center p-1 border-b font-bold text-xl">
            {title}
          </div>
        )}
      </div>

      {/* Bottom div - fills remaining space, scrolls if overflow */}
      <div className="bg-purple-100 flex-1 overflow-auto p-1">
        {children}
      </div>
    </div>
  );
};


export default CenteredPageLayout;
