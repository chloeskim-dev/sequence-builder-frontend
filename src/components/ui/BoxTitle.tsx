import React from "react";

type Props = {
  title: string;
  position: string;
};

const BoxTitle = ({ title, position }: Props) => {
  return (
    <div className="flex w-100">
      {/* <div className="flex-grow border-t border-gray-400 ml-2"></div> */}
      <div className={`flex-1 font-bold text-${position} text-gray-500`}>
        {title}
      </div>
      {/* <div className="flex-grow border-t border-gray-400 mr-2"></div> */}
    </div>
  );
};

export default BoxTitle;
