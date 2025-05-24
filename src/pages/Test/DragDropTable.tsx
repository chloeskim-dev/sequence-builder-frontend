import React, { ReactNode, useState } from 'react';
import { RiDeleteBin2Line } from "react-icons/ri";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";


import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';


type UserOptionsType = {
  secondsInputStepSize: number,
  autoDuplicateOnOtherSide: boolean
}


interface Item {
  id: string;
  name: string;
  direction: 'left' | 'right' | null;
  duration: {
    min: number;
    sec: number;
  };
  textColor: string
}

const tailwindColorFamilies = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime",
  "green", "emerald", "teal", "cyan", "sky",
  "blue", "indigo", "violet", "purple", "fuchsia",
  "pink", "rose",
];



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
  textColor: ''
}

const getTotalDuration = (items: Item[]) => {
  const totalSeconds = items.reduce((acc, item) => {
    return acc + item.duration.min * 60 + item.duration.sec;
  }, 0);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
};

const initialUserOptions: UserOptionsType = {
  secondsInputStepSize: 15,
  autoDuplicateOnOtherSide: false
}

export default function DragDropTable() {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState<Item>(initialNewItem);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [newlyDuplicatedId, setNewlyDuplicatedId] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<UserOptionsType>(initialUserOptions);

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
      id: `${replaceWhitespacesWithDashes(itemToDuplicate.name.toLowerCase())}-${currentCount + 1}`,
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

  const tailwindColorClasses = [
    "text-red-500", "text-emerald-500", "text-amber-500", "text-yellow-500", "text-lime-500",
    "text-green-500", "text-teal-500", "text-cyan-500", "text-sky-500",
    "text-blue-500", "text-indigo-500", "text-violet-500", "text-purple-500", "text-fuchsia-500", "text-orange-500",
    "text-pink-500", "text-rose-500",
  ];

  const replaceWhitespacesWithDashes = (sourceString: string): string => {
    return sourceString.replace(/\s+/g, "-");
  };



  const getTextColorForNewItem = (newItemName: string): string => {
    const nameSet = new Set<string>();

    for (const item of items) {
      nameSet.add(replaceWhitespacesWithDashes(item.name.toLowerCase()));
    }

    // Find index:
    // - If new, index is at the end (uniqueNames.length)
    // - If existing, find its existing index
    const uniqueNames = Array.from(nameSet);
    const isNew = !nameSet.has(newItemName.toLowerCase());

    // Pick color by cycling through color families
    const index = isNew ? uniqueNames.length : uniqueNames.indexOf(newItemName.toLowerCase());
    return tailwindColorClasses[index % tailwindColorClasses.length];
  };


  const addNewItemToSequence = () => {
    if (newItem.name.trim() === '') return;

    
    const currentCount: number = countByNameInsensitive(newItem.name);
    const newItemId = `${replaceWhitespacesWithDashes(newItem.name.toLowerCase())}-${currentCount + 1}`
    const newItemTextColor = getTextColorForNewItem(newItem.name);

    setItems(
      prev => [
      ...prev,
      {
        ...newItem,
        id: newItemId,
        textColor: newItemTextColor
      },
    ]);

    setNewlyAddedId(newItemId);

    // Automatically clear after animationDurationInMs
    setTimeout(() => {
      setNewlyAddedId(null);
    }, animationDurationInMs);

    // Reset the blank row
    setNewItem({
      id: '',
      name: '',
      direction: null,
      duration: { min: 0, sec: 0 },
      textColor: ''
    });
  };


  const containerClass = "p-4 max-w-3xl mx-auto";
  const tableClass = "w-full border border-gray-300";
  const theadClass = "bg-gray-200";
  const thClass = "p-2 text-left";
  // const trClass = "border-t bg-white";
  const trClass = "border-t";
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
      <h1 className="text-green-500">Newly Added Id: {newlyAddedId}</h1>
      <h1>Newly Duplicated Id: {newlyDuplicatedId}</h1>
      {/* <IconComponent icon={RiDeleteBin2Line}/> */}
     
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
                  <th className={`${thClass} text-green-500`}>Id</th>
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
                        {/* COL 0 - Id */}
                        <td className={`border p-2 ${item.textColor || "text-red-800"}`}>{item.id}</td>
                        {/* <td className={`${tdClass} ${item.textColor}`}>{item.id}</td> */}
                        {/* COL 1 - EXERCISE NAME */}
                        <td className={`${tdClass} ${item.textColor}`}>{item.name}</td>
                        {/* COL 2 - LEFT/RIGHT CHECKBOXES */}
                        <td className={`${optionsTdClass} ${item.textColor}`}>
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
                        <td className={`${tdClass} ${item.textColor}`}>
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
                        <td className={`${tdClass} ${item.textColor} space-x-2`}>
                          <div className="flex">
                            <RiDeleteBin2Line
                              size={40}
                              onClick={() => {deleteItem(index)}}
                            />
                            <HiOutlineDocumentDuplicate
                              size={40}
                              onClick={() => duplicateItem(index)}
                            />
                            {/* <button
                              onClick={() => duplicateItemOnOtherSide(index)}
                              className={actionBtnClass}
                            >
                              Duplicate On Other Side
                            </button> */}

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

