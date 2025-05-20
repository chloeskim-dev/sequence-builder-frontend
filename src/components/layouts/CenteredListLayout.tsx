import React, { ReactNode } from "react";


type Props = {
  title?: string;
  children: ReactNode;
};

const CenteredListLayout = ({ title, children }: Props) => (



<div className="bg-gray-400 flex flex-col h-full w-full p-1">
      {/* Top div - natural height, always visible */}
      
      {/* Sticky title */}
      <div>
        {title && (
          <div className="bg-gray-300 text-center font-bold text-xl p-1">
            {title}
          </div>
        )}
      </div>

      {/* Bottom div - fills remaining space, scrolls if overflow */}
      <div className="bg-gray-200 flex-1 overflow-auto p-1 text-center">
          {children}
      </div>
    
    </div>
);


export default CenteredListLayout;