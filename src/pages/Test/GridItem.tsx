import React from "react";

interface GridItemProps {
  col1: string;
  col2: string;
  col3: string;
  isDragging: boolean;
  dragHandleProps?: any;
  draggableProps?: any;
  style?: React.CSSProperties;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ col1, col2, col3, isDragging, dragHandleProps, draggableProps, style }, ref) => {
    return (
      <div
        ref={ref}
        {...draggableProps}
        {...dragHandleProps}
        style={{
          userSelect: "none",
          padding: 12,
          marginBottom: 8,
          backgroundColor: isDragging ? "#a0d2eb" : "#e2e8f0",
          borderRadius: 4,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          ...style,
        }}
      >
        <div>{col1}</div>
        <div>{col2}</div>
        <div>{col3}</div>
      </div>
    );
  }
);

GridItem.displayName = "GridItem";

export default GridItem;
