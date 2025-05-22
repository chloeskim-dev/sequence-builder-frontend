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
  col1: `ex ${i + 1}`,
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

export default function DragDropTable() {
  const [items, setItems] = useState(initialItems);

  const [newItem, setNewItem] = useState<Item>({
    id: '',
    col1: '',
    col2: null,
    duration: { min: 0, sec: 0 },
  });

  const [newlyAddedId, setNewlyAddedId] = React.useState<string | null>(null);

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

  const updateNewItemDuration = (field: 'min' | 'sec', delta: number) => {
    handleNewItemChange(`duration.${field}`, Math.max(0, newItem.duration[field] + delta));
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

  const duplicateItem = (index: number) => {
    setItems(prevItems => {
      const itemToDuplicate = prevItems[index];
      const newItem = {
        ...itemToDuplicate,
        id: `${itemToDuplicate.id}-copy-${Date.now()}`,
      };

      const updatedItems = [...prevItems];
      updatedItems.splice(index + 1, 0, newItem);
      return updatedItems;
     });

    const newId = `${items[index].id}-copy-${Date.now()}`;
    setNewlyAddedId(newId);
    setTimeout(() => setNewlyAddedId(null), 2000);
  };

  const duplicateItemOnOtherSide = (index: number) => {
    setItems((prev) => {
      const itemToDuplicate = prev[index];
      const newOption =
        itemToDuplicate.col2 === 'left'
          ? 'right'
          : itemToDuplicate.col2 === 'right'
          ? 'left'
          : itemToDuplicate.col2; // leave unchanged if neither

      const newItem: Item = {
        ...itemToDuplicate,
        id: `item-${Date.now()}`,
        col2: newOption,
      };

      const updatedItems = [...prev];
      updatedItems.splice(index + 1, 0, newItem);
      return updatedItems;
    });
  };

  const deleteItem = (index: number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleNewItemChange = (field: string, value: any) => {
    setNewItem(prev => {
      if (field === 'duration.min' || field === 'duration.sec') {
        return {
          ...prev,
          duration: {
            ...prev.duration,
            [field.split('.')[1]]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const addNewExercise = () => {
    if (newItem.col1.trim() === '') return;

    const newItemId = `item-${Date.now()}` 

    setItems(
      prev => [
      ...prev,
      {
        ...newItem,
        id: newItemId,
      },
    ]);

    setNewlyAddedId(newItemId);

    // Automatically clear after 2 seconds
    setTimeout(() => {
      setNewlyAddedId(null);
    }, 2000);

    // Reset the blank row
    setNewItem({
      id: '',
      col1: '',
      col2: 'left',
      duration: { min: 0, sec: 0 },
    });
  };


  const containerClass = "p-4 max-w-3xl mx-auto";
  const tableClass = "w-full border border-gray-300";
  const theadClass = "bg-gray-200";
  const thClass = "p-2 text-left";
  const trClass = "border-t bg-white";
  const trDraggingClass = "border-t bg-green-100";
  const tdClass = "p-2";
  const optionsTdClass = "p-2 space-x-4";
  const checkboxLabelClass = "inline-flex items-center space-x-1";
  const btnClass = "px-2 bg-gray-200 rounded hover:bg-gray-300";
  const inputNumberClass = "w-12 text-center border rounded";
  const durationContainerClass = "flex items-center gap-2";
  const durationPartClass = "flex items-center gap-1";
  const actionBtnClass = "text-blue-500 hover:underline";
  const deleteBtnClass = "text-red-500 hover:underline";
  const newItemInputClass = "border p-1 w-full";
  const radioLabelClass = "mr-2";
  const newItemNumberInputClass = "w-12 border p-1";
  const addBtnClass = "text-green-600 hover:underline";

  return (
    <div className={containerClass}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <table
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={tableClass}
            >
              <thead className={theadClass}>
                <tr>
                  <th className={thClass}>Col 1</th>
                  <th className={thClass}>Options</th>
                  <th className={thClass}>Duration</th>
                  <th className={thClass}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    
                    {/* ITEM ROWS */}
                    
                    {(provided, snapshot) => (
                      <tr
                        key={item.id === newlyAddedId ? `${item.id}-pulse` : item.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? trDraggingClass : trClass} ${item.id === newlyAddedId ? 'animate-flash-once' : ''}`}
                        onAnimationEnd={() => {
                          if (item.id === newlyAddedId) setNewlyAddedId(null);
                        }}
                      >
                        {/* COL NAME1 - EXERCISE NAME */}
                        <td className={tdClass}>{item.col1}</td>
                        {/* COL 2 - LEFT/RIGHT CHECKBOXES */}
                        <td className={optionsTdClass}>
                          <label className={checkboxLabelClass}>
                            <input
                              type="checkbox"
                              checked={item.col2 === 'left'}
                              onChange={() => toggleOption(item.id, 'left')}
                            />
                            <span>L</span>
                          </label>
                          <label className={checkboxLabelClass}>
                            <input
                              type="checkbox"
                              checked={item.col2 === 'right'}
                              onChange={() => toggleOption(item.id, 'right')}
                            />
                            <span>R</span>
                          </label>
                        </td>
                        {/* COL 3 - DURATION */}
                        <td className={tdClass}>
                          <div className={durationContainerClass}>
                            {/* Minutes */}
                            <div className={durationPartClass}>
                              <button
                                className={btnClass}
                                onClick={() => increment(item.id, 'min', -1)}
                              >
                                –
                              </button>
                              <input
                                type="number"
                                className={inputNumberClass}
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
                                className={btnClass}
                                onClick={() => increment(item.id, 'min', 1)}
                              >
                                +
                              </button>
                              <span className="ml-1">min</span>
                            </div>
                            {/* Seconds */}
                            <div className={durationPartClass}>
                              <button
                                className={btnClass}
                                onClick={() => increment(item.id, 'sec', -1)}
                              >
                                –
                              </button>
                              <input
                                type="number"
                                className={inputNumberClass}
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
                                className={btnClass}
                                onClick={() => increment(item.id, 'sec', 1)}
                              >
                                +
                              </button>
                              <span className="ml-1">sec</span>
                            </div>
                          </div>
                        </td>
                        {/* COL 4 - DELETE/DUPLICATE BUTTONS */}
                        <td className={tdClass + " space-x-2"}>
                          <div className="flex">
                            <button
                              onClick={() => duplicateItem(index)}
                              className={actionBtnClass}
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={() => duplicateItemOnOtherSide(index)}
                              className={actionBtnClass}
                            >
                              Duplicate On Other Side
                            </button>
                            <button
                              onClick={() => deleteItem(index)}
                              className={deleteBtnClass}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {/* NEW ITEM ROW */}

                <tr className={trClass}>
                  <td className={tdClass}>
                    <input
                      type="text"
                      value={newItem.col1}
                      onChange={(e) => handleNewItemChange('col1', e.target.value)}
                      className={newItemInputClass}
                      placeholder="New exercise name"
                    />
                  </td>
                  <td className={optionsTdClass}>
                    <label className={checkboxLabelClass}>
                      <input
                        type="radio"
                        value="left"
                        checked={newItem.col2 === 'left'}
                        onChange={() => handleNewItemChange('col2', 'left')}
                      />
                      <span>L</span>
                    </label>
                    <label className={checkboxLabelClass}>
                      <input
                        type="radio"
                        value="right"
                        checked={newItem.col2 === 'right'}
                        onChange={() => handleNewItemChange('col2', 'right')}
                      />
                      <span>R</span>
                    </label>
                  </td>
                  <td className={tdClass}>
                    <div className={durationContainerClass}>
                      {/* Minutes */}
                      <div className={durationPartClass}>
                        <button
                          className={btnClass}
                          onClick={() => updateNewItemDuration('min', -1)}
                        >
                          –
                        </button>
                        <input
                          type="number"
                          value={newItem.duration.min}
                          onChange={(e) =>
                            handleNewItemChange('duration.min', parseInt(e.target.value, 10) || 0)
                          }
                          className={inputNumberClass}
                          placeholder="min"
                        />
                        <button
                          className={btnClass}
                          onClick={() => updateNewItemDuration('min', 1)}
                        >
                          +
                        </button>
                        <span className="ml-1">min</span>
                      </div>
                      {/* Seconds */}
                      <div className={durationPartClass}>
                        <button
                          className={btnClass}
                          onClick={() => updateNewItemDuration('sec', -1)}
                        >
                          –
                        </button>
                        <input
                          type="number"
                          value={newItem.duration.sec}
                          onChange={(e) =>
                            handleNewItemChange('duration.sec', parseInt(e.target.value, 10) || 0)
                          }
                          className={inputNumberClass}
                          placeholder="sec"
                        />
                        <button
                          className={btnClass}
                          onClick={() => updateNewItemDuration('sec', 1)}
                        >
                          +
                        </button>
                        <span className="ml-1">sec</span>
                      </div>
                    </div>
                  </td>
                  <td className={tdClass}>
                    <button
                      onClick={addNewExercise}
                      className={addBtnClass}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      {/* TOTAL DURATION */}

      <div className="mt-4 text-lg font-medium">
        Total Duration: {getTotalDuration(items).minutes} min {getTotalDuration(items).seconds} sec
      </div>
    </div>
  );
}

