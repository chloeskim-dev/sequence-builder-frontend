import React, { useState, useRef, useEffect } from "react";
import { RiDeleteBin2Line, RiAddCircleLine } from "react-icons/ri";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import exampleItems from "../../constants/exampleItems";
import tailwindColorClasses from "../../constants/tailwindColorClasses";

const containerClass = "p-4 mx-auto";
const tableClass = "w-full border border-gray-300";
const theadClass = "bg-gray-200";
const thClass = "p-2 text-left";
const trDraggingClass = "border-t bg-green-100";
const itemRowClass = "text-center";
const optionsitemRowClass = "p-2 space-x-4";
const radioLabelClass = "inline-flex items-center space-x-1";
const btnClass = "px-2 bg-gray-200 rounded hover:bg-gray-300";
const inputNumberClass = "w-12 text-center border rounded";
const durationContainerClass = "flex items-center gap-2";
const durationPartClass = "flex items-center gap-1";
const actionBtnClass = "text-blue-500 hover:underline";
const deleteBtnClass = "text-red-500 hover:underline";
const newItemInputClass = "border rounded p-2 w-full text-center ";
const newItemNumberInputClass = "w-12 border p-1";
const addBtnClass = "text-green-600 hover:underline";
const borderedButtonClass =
  "border-2 border-solid border-black rounded px-2 hover:outline-2 hover:bg-violet-200";
const borderedInputClass = "border-2 border-solid border-black rounded px-2";
const disabledInputClass =
  "border-2 border-solid border-transparent rounded px-2";
const settingsBoxClass = "border-2 border-black border-solid rounded p-2 my-2";

type UserOptionsType = {
  secondsInputStepSize: number;
  autoDuplicateOnOtherSide: boolean;
};

interface Item {
  id: string;
  name: string;
  direction: "left" | "right" | null;
  duration: {
    min: number;
    sec: number;
  };
  textColor: string;
}

const animationDurationInMs = 1500;

// const initialItems: Item[] = [];
const initialItems: Item[] = exampleItems;

const initialNewItem: Item = {
  id: "",
  name: "",
  direction: null,
  duration: {
    min: 0,
    sec: 0,
  },
  textColor: "",
};

const initialUserOptions: UserOptionsType = {
  secondsInputStepSize: 15,
  autoDuplicateOnOtherSide: false,
};

const getTotalDuration = (items: Item[]) => {
  const totalSeconds = items.reduce((acc, item) => {
    return acc + item.duration.min * 60 + item.duration.sec;
  }, 0);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
};

export default function NewPageSequenceTable() {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState<Item>(initialNewItem);
  const [secondsStepSizeIsEditable, setSecondsStepSizeIsEditable] =
    useState<boolean>(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [newlyDuplicatedId, setNewlyDuplicatedId] = useState<string | null>(
    null
  );
  const [userOptions, setUserOptions] =
    useState<UserOptionsType>(initialUserOptions);

  const [stepSizeInput, setStepSizeInput] = useState(
    String(userOptions.secondsInputStepSize)
  );

  const handleStepSizeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStepSizeInput(e.target.value); // no parse yet
  };

  const applyStepSize = () => {
    const parsed = parseInt(stepSizeInput, 10);

    if (isNaN(parsed) || parsed < 1 || parsed > 59) {
      // optionally show validation error
      return;
    }

    setUserOptions((prev) => ({
      ...prev,
      secondsInputStepSize: parsed,
    }));

    setSecondsStepSizeIsEditable(false);
  };

  //   const handleStepSizeInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const inputParsedAsInt = parseInt(e.target.value, 10);
  //   if (
  //     // isNaN(inputParsedAsInt) ||
  //     inputParsedAsInt > 60 ||
  //     inputParsedAsInt < 0
  //   )
  //     return;
  //   setUserOptions((prev) => ({
  //     ...prev,
  //     secondsInputStepSize: parseInt(e.target.value, 10),
  //   }));
  // };

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = gridRef.current.scrollHeight;
    }
  }, [items.length]); // Triggers when items are added/removed

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  const toggleDirection = (id: string, value: "left" | "right") => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, direction: item.direction === value ? null : value }
          : item
      )
    );
  };

  const updateDuration = (id: string, field: "min" | "sec", value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, duration: { ...item.duration, [field]: value } }
          : item
      )
    );
  };
  const updateNewItemDuration = (field: "min" | "sec", delta: number) => {
    const current = newItem.duration[field];
    const change =
      field === "sec" ? delta * userOptions.secondsInputStepSize : delta;

    handleNewItemChange(`duration.${field}`, Math.max(0, current + change));
  };

  const handleNewItemDurationChangeViaButtons = (
    field: "min" | "sec",
    delta: number
  ) => {
    const currentDuration = newItem.duration[field];
    const change =
      field === "sec" ? delta * userOptions.secondsInputStepSize : delta;

    if (
      field === "sec" &&
      (currentDuration + change > 60 || currentDuration + change < 0)
    ) {
      console.log("currentDuration: ", currentDuration);
      console.log("change: ", change);
      console.log("SHOULD BE RESTRICTED!!");
      return;
    }
    if (field === "min" && currentDuration + change < 0) {
      return;
    }

    setNewItem((prev) => ({
      ...prev,
      duration: {
        ...prev.duration,
        [field]: Math.max(
          0,
          prev.duration[field] +
            (field === "sec" ? delta * userOptions.secondsInputStepSize : delta)
        ),
      },
    }));
  };

  const increment = (id: string, field: "min" | "sec", delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              duration: {
                ...item.duration,
                [field]: Math.max(
                  0,
                  item.duration[field] +
                    delta * userOptions.secondsInputStepSize
                ),
              },
            }
          : item
      )
    );
  };
  const handleItemDurationChangeViaButtons = (
    id: string,
    field: "min" | "sec",
    delta: number
  ) => {
    const selectedItem = items.filter((item) => item.id === id)[0];
    const currentDuration = selectedItem.duration[field];
    console.log(selectedItem);
    const change =
      field === "sec" ? delta * userOptions.secondsInputStepSize : delta;

    if (
      field === "sec" &&
      (currentDuration + change > 60 || currentDuration + change < 0)
    ) {
      console.log("currentDuration: ", currentDuration);
      console.log("change: ", change);
      console.log("SHOULD BE RESTRICTED!!");
      return;
    }
    if (field === "min" && currentDuration + change < 0) {
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              duration: {
                ...item.duration,
                [field]: Math.max(
                  0,
                  item.duration[field] +
                    (field === "sec"
                      ? delta * userOptions.secondsInputStepSize
                      : delta)
                ),
              },
            }
          : item
      )
    );
  };
  const addNewItemToSequence = () => {
    if (newItem.name.trim() === "") return;

    // const currentCount: number = countByNameInsensitive(newItem.name);
    // const newItemId = `${replaceWhitespacesWithDashes(newItem.name.toLowerCase())}-${currentCount + 1}`
    const newItemId = `${replaceWhitespacesWithDashes(
      newItem.name.toLowerCase()
    )}-${uuidv4()}`;
    const newItemTextColor = getTextColorForNewItem(newItem.name);

    setItems((prev) => [
      ...prev,
      {
        ...newItem,
        id: newItemId,
        textColor: newItemTextColor,
      },
    ]);

    setNewlyAddedId(newItemId);

    // Automatically clear after animationDurationInMs
    setTimeout(() => {
      setNewlyAddedId(null);
    }, animationDurationInMs);

    // Reset the blank row
    setNewItem({
      id: "",
      name: "",
      direction: null,
      duration: { min: 0, sec: 0 },
      textColor: "",
    });
  };

  const handleDuplicateClick = (index: number) => {
    if (userOptions.autoDuplicateOnOtherSide) {
      duplicateItemGeneric(index, true);
    } else {
      duplicateItemGeneric(index, false);
    }
  };

  const duplicateItemGeneric = (index: number, toggleDirection = false) => {
    const itemToDuplicate = items[index];

    const newDirection =
      toggleDirection && itemToDuplicate.direction
        ? itemToDuplicate.direction === "left"
          ? "right"
          : itemToDuplicate.direction === "right"
          ? "left"
          : itemToDuplicate.direction // unchanged if neither
        : itemToDuplicate.direction;

    const newItem: Item = {
      ...itemToDuplicate,
      id: `${replaceWhitespacesWithDashes(
        itemToDuplicate.name.toLowerCase()
      )}-${uuidv4()}`,
      direction: newDirection,
    };

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index + 1, 0, newItem);
      return updatedItems;
    });

    // Only trigger animations for the standard duplication
    if (!toggleDirection) {
      setNewlyAddedId(newItem.id);
      setNewlyDuplicatedId(itemToDuplicate.id);
      setTimeout(() => setNewlyAddedId(null), animationDurationInMs + 50);
      setTimeout(() => setNewlyDuplicatedId(null), animationDurationInMs);
    }
  };

  const deleteItem = (index: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleNewItemChange = (field: string, value: any) => {
    setNewItem((prev) => {
      if (field === "duration.min" || field === "duration.sec") {
        return {
          ...prev,
          duration: {
            ...prev.duration,
            [field.split(".")[1]]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

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
    const index = isNew
      ? uniqueNames.length
      : uniqueNames.indexOf(newItemName.toLowerCase());
    return tailwindColorClasses[index % tailwindColorClasses.length];
  };

  // const saveSecondsStepEdit = () => {
  //   setUserOptions((prev) => {
  //     ...prev,
  //     secondsInputStepSize:
  //   })
  //   setSecondsStepSizeIsEditable(false);
  // }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "90vh", // or a fixed height if needed
      }}
    >
      {/* SETTINGS BOX */}
      <div className={settingsBoxClass}>
        <h1 className="w-full text-center font-bold mx-auto mb-2">SETTINGS</h1>
        <div className="flex gap-4">
          {/* <h1>Seconds step size: {userOptions.secondsInputStepSize}</h1> */}
          <label>
            <span className="mr-4">Adjust seconds by:</span>
            <input
              type="number"
              min={1}
              max={59}
              value={stepSizeInput}
              disabled={!secondsStepSizeIsEditable}
              onChange={handleStepSizeInputChange}
              className={
                secondsStepSizeIsEditable
                  ? borderedInputClass
                  : disabledInputClass
              }
            />
          </label>
          <button
            className={borderedButtonClass}
            onClick={() => setSecondsStepSizeIsEditable(true)}
          >
            Edit
          </button>
          <button className={borderedButtonClass} onClick={applyStepSize}>
            Apply
          </button>
        </div>

        <div>
          <div className={"flex"}>
            <label className={radioLabelClass}>
              <span>Automatically duplicate on other side</span>
              <input
                className={"mr-1"}
                type="radio"
                checked={userOptions.autoDuplicateOnOtherSide}
                onChange={() =>
                  setUserOptions((prevOptions) => {
                    return {
                      ...prevOptions,
                      autoDuplicateOnOtherSide:
                        !prevOptions.autoDuplicateOnOtherSide,
                    };
                  })
                }
              />
            </label>
          </div>
        </div>
      </div>

      {/* Header (non-scrollable) */}
      <div
        className={
          "grid place-items-center grid-cols-[2fr_1fr_2fr_1fr] font-bold p-1 border-b-2 border-gray-300"
        }
      >
        <div>Exercise</div>
        <div>Direction</div>
        <div>Duration</div>
        <div>Actions</div>
      </div>

      {/*=================  Add new item row (non-scrollable) ================= */}
      {/* <div className="border-2 border-black border-solid">
        <h1 className="font-bold text-center">Add a new exercise:</h1>
      </div> */}
      <div className={"border-2 border-solid bg-green-100 border-black"}>
        {/* <legend className="text-center p-1">Add a new exercise</legend> */}
        <h1 className="font-bold text-center">ADD NEW:</h1>
        <div
          className={`grid place-items-center grid-cols-[2fr_1fr_2fr_1fr] mb-2 mr-2 ml-2`}
        >
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => handleNewItemChange("name", e.target.value)}
            className={newItemInputClass}
            placeholder="New exercise name"
          />
          <div className={optionsitemRowClass}>
            <label className={radioLabelClass}>
              <input
                type="radio"
                value="left"
                checked={newItem.direction === "left"}
                onChange={() => handleNewItemChange("direction", "left")}
              />
              <span>L</span>
            </label>
            <label className={radioLabelClass}>
              <input
                type="radio"
                value="right"
                checked={newItem.direction === "right"}
                onChange={() => handleNewItemChange("direction", "right")}
              />
              <span>R</span>
            </label>
          </div>
          {/* COL 3 - DURATION */}
          <div className={itemRowClass}>
            <div className={durationContainerClass}>
              {/* Minutes */}
              <div className={durationPartClass}>
                <button
                  className={btnClass}
                  // onClick={() => updateNewItemDuration("min", -1)}
                  onClick={() =>
                    handleNewItemDurationChangeViaButtons("min", -1)
                  }
                >
                  –
                </button>
                {/* <input
                  type="number"
                  min={0}
                  max={60}
                  value={newItem.duration.min}
                  onChange={(e) =>
                    handleNewItemChange(
                      "duration.min",
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                  className={inputNumberClass}
                  placeholder="min"
                /> */}
                <span>{newItem.duration.min}</span>

                <button
                  className={btnClass}
                  onClick={() =>
                    handleNewItemDurationChangeViaButtons("min", 1)
                  }
                >
                  +
                </button>
                <span className="ml-1">min</span>
              </div>

              {/* Seconds */}
              <div className={durationPartClass}>
                <button
                  className={btnClass}
                  onClick={() =>
                    handleNewItemDurationChangeViaButtons("sec", -1)
                  }
                >
                  –
                </button>
                {/* <input
                  type="number"
                  min={0}
                  max={59}
                  value={newItem.duration.sec}
                  step={userOptions.secondsInputStepSize}
                  onChange={(e) =>
                    handleNewItemChange(
                      "duration.sec",
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                  className={inputNumberClass}
                  placeholder="sec"
                /> */}
                <span>{newItem.duration.sec}</span>
                <button
                  className={btnClass}
                  onClick={() =>
                    handleNewItemDurationChangeViaButtons("sec", 1)
                  }
                >
                  +
                </button>
                <span className="ml-1">sec</span>
              </div>
            </div>
          </div>
          <div>
            {/* <button onClick={addNewItemToSequence} className={addBtnClass}>
            Add
          </button> */}
            <RiAddCircleLine size={30} onClick={addNewItemToSequence} />
          </div>
        </div>
      </div>

      {/* Scrollable list */}
      <div
        ref={gridRef}
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ccc",
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="scrollable-list">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        // className={`${
                        //   snapshot.isDraggingOver ? trDraggingClass : trClass
                        // } ${item.id === newlyAddedId ? "bg-green-200" : ""} ${
                        //   item.id === newlyDuplicatedId ? "bg-green-300" : ""
                        // }`}
                        className={`grid place-items-center grid-cols-[2fr_1fr_2fr_1fr] m-2 p-1 border-b border-gray-200 bg-white ${
                          item.id === newlyAddedId ? "bg-green-200" : ""
                        } ${
                          item.id === newlyDuplicatedId ? "bg-green-300" : ""
                        }`}
                        style={provided.draggableProps.style}
                      >
                        {/* COL 0 - Id */}
                        {/* <td className={`border p-2 ${item.textColor}`}>
                                               {item.id}
                                             </td> */}
                        {/* <td className={`${itemRowClass} ${item.textColor}`}>{item.id}</td> */}
                        {/* COL 1 - EXERCISE NAME */}
                        <div
                          className={`${itemRowClass} ${item.textColor} font-bold`}
                        >
                          {item.name}
                        </div>
                        {/* COL 2 - LEFT/RIGHT CHECKBOXES */}
                        <div
                          className={`${optionsitemRowClass} ${item.textColor}`}
                        >
                          <label className={radioLabelClass}>
                            <input
                              type="radio"
                              checked={item.direction === "left"}
                              onChange={() => toggleDirection(item.id, "left")}
                            />
                            <span>L</span>
                          </label>
                          <label className={radioLabelClass}>
                            <input
                              type="radio"
                              checked={item.direction === "right"}
                              onChange={() => toggleDirection(item.id, "right")}
                            />
                            <span>R</span>
                          </label>
                        </div>
                        {/* COL 3 - DURATION */}
                        <div className={`${itemRowClass} ${item.textColor}`}>
                          <div className={durationContainerClass}>
                            {/* Minutes */}
                            <div className={durationPartClass}>
                              <button
                                className={btnClass}
                                onClick={() =>
                                  handleItemDurationChangeViaButtons(
                                    item.id,
                                    "min",
                                    -1
                                  )
                                }
                              >
                                –
                              </button>
                              {/* <input
                                type="number"
                                readOnly
                                min={0}
                                max={60}
                                className={inputNumberClass}
                                value={item.duration.min}
                                onChange={(e) =>
                                  updateDuration(
                                    item.id,
                                    "min",
                                    parseInt(e.target.value || "0", 10)
                                  )
                                }
                              /> */}
                              <span>{item.duration.min}</span>
                              <button
                                className={btnClass}
                                onClick={() =>
                                  handleItemDurationChangeViaButtons(
                                    item.id,
                                    "min",
                                    1
                                  )
                                }
                              >
                                +
                              </button>
                              <span className="ml-1">min</span>
                            </div>

                            {/* Seconds */}
                            <div className={durationPartClass}>
                              <button
                                className={btnClass}
                                onClick={() =>
                                  handleItemDurationChangeViaButtons(
                                    item.id,
                                    "sec",
                                    -1
                                  )
                                }
                              >
                                –
                              </button>
                              {/* <input
                                type="number"
                                min={0}
                                max={60}
                                className={inputNumberClass}
                                value={item.duration.sec}
                                step={userOptions.secondsInputStepSize}
                                onChange={(e) =>
                                  updateDuration(
                                    item.id,
                                    "sec",
                                    parseInt(e.target.value || "0", 10)
                                  )
                                }
                              /> */}
                              <span>{item.duration.sec}</span>
                              <button
                                className={btnClass}
                                onClick={() =>
                                  handleItemDurationChangeViaButtons(
                                    item.id,
                                    "sec",
                                    1
                                  )
                                }
                              >
                                +
                              </button>
                              <span className="ml-1">sec</span>
                            </div>
                          </div>
                        </div>
                        {/* COL 4 - DELETE/DUPLICATE BUTTONS */}
                        <div
                          className={`${itemRowClass} ${item.textColor} space-x-2`}
                        >
                          <div className="flex">
                            <RiDeleteBin2Line
                              size={30}
                              onClick={() => {
                                deleteItem(index);
                              }}
                            />
                            <HiOutlineDocumentDuplicate
                              size={30}
                              onClick={() => handleDuplicateClick(index)}
                            />
                            {/* <button
                                                   onClick={() => duplicateItemOnOtherSide(index)}
                                                   className={actionBtnClass}
                                                 >
                                                   Duplicate On Other Side
                                                 </button> */}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* === Sticky Footer === */}
      {/* TOTAL DURATION */}
      <div className="mt-4 text-lg text-center font-medium">
        Total Duration: {getTotalDuration(items).minutes} min{" "}
        {getTotalDuration(items).seconds} sec
      </div>
      {/* <div
        style={{
          padding: "12px",
          borderTop: "2px solid #ccc",
          background: "#f9f9f9",
        }}
      >
        <button>Save Changes</button> */}
    </div>
    // </div>
  );
}
