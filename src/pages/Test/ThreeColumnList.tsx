import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import GridItem from "./GridItem"; // adjust the path

interface Item {
  id: string;
  col1: string;
  col2: string;
  col3: string;
}

const initialItems: Item[] = [
  { id: "1", col1: "Item 1A", col2: "Item 1B", col3: "Item 1C" },
  { id: "2", col1: "Item 2A", col2: "Item 2B", col3: "Item 2C" },
  { id: "3", col1: "Item 3A", col2: "Item 3B", col3: "Item 3C" },
];

export default function ThreeColumnList() {
  const [items, setItems] = useState(initialItems);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ maxWidth: 400, margin: "auto", padding: 16 }}
          >
            {items.map(({ id, col1, col2, col3 }, index) => (
              <Draggable
                key={id}
                draggableId={`${id}-${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <GridItem
                    ref={provided.innerRef}
                    draggableProps={provided.draggableProps}
                    dragHandleProps={provided.dragHandleProps}
                    isDragging={snapshot.isDragging}
                    col1={col1}
                    col2={col2}
                    col3={col3}
                    style={provided.draggableProps.style}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
