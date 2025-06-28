import React, { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
};

const CenteredPageLayout = ({ title, children, icon }: Props) => {
  return (
    <div className="bg-purple-300 flex flex-col h-full w-full p-1">
      {/* Top div - natural height, always visible */}
      <div className="bg-purple-200 p-1 border-b font-bold text-xl">
        <div className="flex items-center justify-center gap-2">
          {title}
          {icon && icon}
        </div>
      </div>

      {/* Bottom div - fills remaining space, scrolls if overflow */}
      <div className="bg-purple-100 flex-1 overflow-auto p-1">{children}</div>
    </div>
  );
};

export default CenteredPageLayout;
