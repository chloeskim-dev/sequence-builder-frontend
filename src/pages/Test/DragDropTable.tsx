import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface Item {
  id: string;
  col1: string;
  col2: 'left' | 'right' | null;
  duration: {
    min: number;
    sec: number;
  };
}

const initialItems: Item[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `item-${i}`,
  col1: `Row ${i + 1}`,
  col2: null,
  duration: { min: 0, sec: 0 },
}));

const getTotalDuration = (items: Item[]) => {
  const totalSeconds = items.reduce((acc, item) => {
    return acc + item.duration.min * 60 + item.duration.sec;
  }, 0);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
};

export default function TableDragDrop() {
  const [items, setItems] = useState(initialItems);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  const toggleOption = (id: string, value: 'left' | 'right') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, col2: item.col2 === value ? null : value } : item
      )
    );
  };

  const updateDuration = (
    id: string,
    field: 'min' | 'sec',
    value: number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, duration: { ...item.duration, [field]: value } }
          : item
      )
    );
  };

  const increment = (id: string, field: 'min' | 'sec', delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              duration: {
                ...item.duration,
                [field]: Math.max(0, item.duration[field] + delta),
              },
            }
          : item
      )
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <table
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-full border border-gray-300"
            >
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Col 1</th>
                  <th className="p-2 text-left">Options</th>
                  <th className="p-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`border-t ${
                          snapshot.isDragging ? 'bg-green-100' : 'bg-white'
                        }`}
                      >
                        <td className="p-2">{item.col1}</td>
                        <td className="p-2 space-x-4">
                          <label className="inline-flex items-center space-x-1">
                            <input
                              type="checkbox"
                              checked={item.col2 === 'left'}
                              onChange={() => toggleOption(item.id, 'left')}
                            />
                            <span>Left</span>
                          </label>
                          <label className="inline-flex items-center space-x-1">
                            <input
                              type="checkbox"
                              checked={item.col2 === 'right'}
                              onChange={() => toggleOption(item.id, 'right')}
                            />
                            <span>Right</span>
                          </label>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {/* Minutes */}
                            <div className="flex items-center gap-1">
                              <button
                                className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => increment(item.id, 'min', -1)}
                              >
                                –
                              </button>
                              <input
                                type="number"
                                className="w-12 text-center border rounded"
                                value={item.duration.min}
                                onChange={(e) =>
                                  updateDuration(
                                    item.id,
                                    'min',
                                    parseInt(e.target.value || '0', 10)
                                  )
                                }
                              />
                              <button
                                className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => increment(item.id, 'min', 1)}
                              >
                                +
                              </button>
                              <span className="ml-1">min</span>
                            </div>

                            {/* Seconds */}
                            <div className="flex items-center gap-1">
                              <button
                                className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => increment(item.id, 'sec', -1)}
                              >
                                –
                              </button>
                              <input
                                type="number"
                                className="w-12 text-center border rounded"
                                value={item.duration.sec}
                                onChange={(e) =>
                                  updateDuration(
                                    item.id,
                                    'sec',
                                    parseInt(e.target.value || '0', 10)
                                  )
                                }
                              />
                              <button
                                className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => increment(item.id, 'sec', 1)}
                              >
                                +
                              </button>
                              <span className="ml-1">sec</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}

        </Droppable>
      </DragDropContext>
      <div className="mt-4 text-lg font-medium">
        Total Duration: {getTotalDuration(items).minutes} min {getTotalDuration(items).seconds} sec
      </div>
    </div>
  );
}

