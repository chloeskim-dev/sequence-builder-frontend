import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface Item {
  id: string;
  name: string;
  direction: 'left' | 'right' | null;
  duration: {
    min: number;
    sec: number;
  };
}

// const initialItems: Item[] = Array.from({ length: 5 }).map((_, i) => ({
//   id: `item-${i}`,
//   name: `ex ${i + 1}`,
//   col2: null,
//   duration: { min: 0, sec: 0 },
// }));

const animationDurationInMs = 1500;

const initialItems : Item[] = [];
const initialNewItem: Item = {
  id: '',
  name: '',
  direction: null,
  duration: {
    min: 0,
    sec: 0 
  },
}

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
  const [newItem, setNewItem] = useState<Item>(initialNewItem);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [newlyDuplicatedId, setNewlyDuplicatedId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  const toggleDirection = (id: string, value: 'left' | 'right') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, direction: item.direction === value ? null : value } : item
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
    const itemToDuplicate = items[index];

    const currentCount = countByNameInsensitive(itemToDuplicate.name);

    const newItem = {
      ...itemToDuplicate,
      id: `${itemToDuplicate.name.toLowerCase()}-${currentCount + 1}`,
    };
    
    
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index + 1, 0, newItem);
      return updatedItems;
     });

    setNewlyAddedId(newItem.id);
    setNewlyDuplicatedId(itemToDuplicate.id); 
    setTimeout(() => setNewlyAddedId(null), animationDurationInMs + 50);
    setTimeout(() => setNewlyDuplicatedId(null), animationDurationInMs);
  };

  const duplicateItemOnOtherSide = (index: number) => {
    setItems((prev) => {
      const itemToDuplicate = prev[index];
      const newOption =
        itemToDuplicate.direction === 'left'
          ? 'right'
          : itemToDuplicate.direction === 'right'
          ? 'left'
          : itemToDuplicate.direction; // leave unchanged if neither

      const newItem: Item = {
        ...itemToDuplicate,
        id: `item-${Date.now()}`,
        direction: newOption,
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

  const countByNameInsensitive = (name: string): number => {
    return items.filter(item => item.name.toLowerCase() === name.toLowerCase()).length;
  };

  const addNewItemToSequence = () => {
    if (newItem.name.trim() === '') return;
    
    const currentCount: number = countByNameInsensitive(newItem.name);
    const newItemId = `${newItem.name.toLowerCase()}-${currentCount + 1}` 

    setItems(
      prev => [
      ...prev,
      {
        ...newItem,
        id: newItemId,
      },
    ]);

    setNewlyAddedId(newItemId);

    // Automatically clear after 1.5 seconds
    setTimeout(() => {
      setNewlyAddedId(null);
    }, animationDurationInMs);

    // Reset the blank row
    setNewItem({
      id: '',
      name: '',
      direction: 'left',
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
      <h1>Newly Added Id: {newlyAddedId}</h1>
      <h1>Newly Duplicated Id: {newlyDuplicatedId}</h1>
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
                  <th className={thClass}>Id</th>
                  <th className={thClass}>Exercise</th>
                  <th className={thClass}>Direction</th>
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
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${snapshot.isDragging ? trDraggingClass : trClass} ${item.id === newlyAddedId ? 'bg-green-200' : ''} ${item.id === newlyDuplicatedId ? 'bg-green-300' : ''}`}
                      >
                        {/* COL NAME0 - Id */}
                        <td className={tdClass}>{item.id}</td>
                        {/* COL NAME1 - EXERCISE NAME */}
                        <td className={tdClass}>{item.name}</td>
                        {/* COL 2 - LEFT/RIGHT CHECKBOXES */}
                        <td className={optionsTdClass}>
                          <label className={checkboxLabelClass}>
                            <input
                              type="checkbox"
                              checked={item.direction === 'left'}
                              onChange={() => toggleDirection(item.id, 'left')}
                            />
                            <span>L</span>
                          </label>
                          <label className={checkboxLabelClass}>
                            <input
                              type="checkbox"
                              checked={item.direction === 'right'}
                              onChange={() => toggleDirection(item.id, 'right')}
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
                  </td>
                  <td className={tdClass}>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => handleNewItemChange('name', e.target.value)}
                      className={newItemInputClass}
                      placeholder="New exercise name"
                    />
                  </td>
                  <td className={optionsTdClass}>
                    <label className={checkboxLabelClass}>
                      <input
                        type="radio"
                        value="left"
                        checked={newItem.direction === 'left'}
                        onChange={() => handleNewItemChange('direction', 'left')}
                      />
                      <span>L</span>
                    </label>
                    <label className={checkboxLabelClass}>
                      <input
                        type="radio"
                        value="right"
                        checked={newItem.direction === 'right'}
                        onChange={() => handleNewItemChange('direction', 'right')}
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
                      onClick={addNewItemToSequence}
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

