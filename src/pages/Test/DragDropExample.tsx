// DragDropExample.tsx
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";


const initialItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
// const initialItems = Array.from({ length: 100 }, (_, i) => `Item`);

const DragDropExample: React.FC = () => {
  const [items, setItems] = useState(initialItems);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const updated = [...items];
    const [removed] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, removed);

    setItems(updated);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ padding: 16, width: 200, background: "#eee" }}
          >
            {items.map((item, index) => (
              <Draggable
                key={item}
                draggableId={`${item}-${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: "none",
                      padding: 16,
                      margin: "0 0 8px 0",
                      backgroundColor: snapshot.isDragging ? "#ccc" : "#fff",
                      border: "1px solid #ddd",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {item}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropExample;

// interface Item {
//   id: string;
//   col1: string;
//   col2: string;
//   col3: string;
// }

// const initialItems: Item[] = [
//   { id: "1", col1: "Item 1A", col2: "Item 1B", col3: "Item 1C" },
//   { id: "2", col1: "Item 2A", col2: "Item 2B", col3: "Item 2C" },
//   { id: "3", col1: "Item 3A", col2: "Item 3B", col3: "Item 3C" },
// ];

// export default function DragDropExample() {
//   const [items, setItems] = useState(initialItems);

//   const handleDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     const newItems = Array.from(items);
//     const [removed] = newItems.splice(result.source.index, 1);
//     newItems.splice(result.destination.index, 0, removed);

//     setItems(newItems);
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <Droppable droppableId="droppable-list">
//         {(provided) => (
//           <div
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//             style={{ maxWidth: 400, margin: "auto", padding: 16 }}
//           >
//             {items.map(({ id, col1, col2, col3 }, index) => (
//               <Draggable key={id} draggableId={id} index={index}>
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     style={{
//                       userSelect: "none",
//                       padding: 12,
//                       marginBottom: 8,
//                       backgroundColor: snapshot.isDragging ? "#a0d2eb" : "#e2e8f0",
//                       borderRadius: 4,
//                       display: "grid",
//                       gridTemplateColumns: "1fr 1fr 1fr",
//                       gap: 10,
//                       ...provided.draggableProps.style,
//                     }}
//                   >
//                     <div>{col1}</div>
//                     <div>{col2}</div>
//                     <div>{col3}</div>
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// }
