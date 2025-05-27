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
import BoxTitle from "../../components/ui/BoxTitle";
import { Item, Sequence } from "../../constants/types";

const containerClass = "p-4 mx-auto";
const tableClass = "w-full border border-gray-300";
const theadClass = "bg-gray-200";
const thClass = "p-2 text-left";
const trDraggingClass = "border-t bg-green-100";
const itemRowClass = "text-center";
const optionsitemRowClass = "p-2 space-x-4";
const radioLabelClass = "space-x-1 pl-2";
const btnClass = "px-2 bg-gray-200 rounded hover:bg-gray-300";
const inputNumberClass = "w-12 text-center border rounded";
const durationContainerClass = "flex items-center gap-6";
const durationPartClass = "flex items-center gap-1";
const actionBtnClass = "text-blue-500 hover:underline";
const deleteBtnClass = "text-red-500 hover:underline";
const textInputClass = "border rounded p-2 w-full text-center ";
const sequenceTitleInputClass = "w-full border rounded p-2 text-center ";
const newItemNumberInputClass = "w-12 border p-1";
const addBtnClass = "text-green-600 hover:underline";
const borderedButtonClass =
  "border-2 border-solid border-black rounded px-2 hover:outline-2 hover:bg-violet-200";
const borderedInputClass =
  "border-2 border-solid border-black rounded font-bold";
const disabledInputClass =
  "border-2 border-solid border-transparent rounded font-bold";
const settingsBoxClass = "border-2 border-black border-solid bg-rose-100 pb-2";

type UserOptionsType = {
  secondsInputStepSize: number;
  autoDuplicateOnOtherSide: boolean;
};

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
  const [secondsStepSizeInputIsValid, setSecondsStepSizeInputIsValid] =
    useState<boolean>(true);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [newlyDuplicatedId, setNewlyDuplicatedId] = useState<string | null>(
    null
  );
  const [userOptions, setUserOptions] =
    useState<UserOptionsType>(initialUserOptions);
  const [newSequenceNameInput, setNewSequenceNameInput] = useState<string>("");

  const [stepSizeInput, setStepSizeInput] = useState(
    String(userOptions.secondsInputStepSize)
  );

  const handleStepSizeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStepSizeInput(e.target.value); // no parse yet
  };

  const checkStepSizeValidity = () => {
    const parsed = parseInt(stepSizeInput, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 59) return false;
    return true;
  };

  useEffect(() => {
    if (checkStepSizeValidity()) {
      setSecondsStepSizeInputIsValid(true);
    } else {
      setSecondsStepSizeInputIsValid(false);
    }
  }, [stepSizeInput]); // Triggers when items are added/removed

  const applyStepSize = () => {
    const parsed = parseInt(stepSizeInput, 10);

    // if (isNaN(parsed) || parsed < 1 || parsed > 59) {
    //   // optionally show validation error
    //   setSecondsStepSizeInputIsValid(false);
    //   return;
    // }

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

  const saveSequence = () => {
    const newSequence: Sequence = {
      userId: "",
      name: newSequenceNameInput,
      items: items,
      createdDate: Date.now(),
      lastEditDate: null,
    };
    console.log(newSequence);
  };
  // ============================================================================================
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "90vh", // or a fixed height if needed
      }}
    >
      {/* === SETTINGS BOX === */}
      <div className={settingsBoxClass}>
        <BoxTitle title="Settings" position="center" />

        <div className="grid grid-cols-[1fr_auto_1fr]">
          {/* <h1>Seconds step size: {userOptions.secondsInputStepSize}</h1> */}

          {/* SETTING OPTION 1: SECONDS STEP SIZE */}
          <div className="justify-self-start">
            <label className="pl-2">
              <span className="mr-1">Adjust seconds at intervals of </span>
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
            {!secondsStepSizeIsEditable && (
              <button
                className={`${borderedButtonClass}`}
                onClick={() => setSecondsStepSizeIsEditable(true)}
              >
                Edit
              </button>
            )}

            {secondsStepSizeInputIsValid && secondsStepSizeIsEditable ? (
              <button
                className={`${
                  secondsStepSizeInputIsValid ? "visible" : "invisible"
                } ${borderedButtonClass}`}
                onClick={applyStepSize}
              >
                Apply
              </button>
            ) : (
              <h1
                className={`${
                  secondsStepSizeInputIsValid ? "invisible" : "visible"
                } font-bold text-red-700`}
              >
                Seconds intervals between 1 an 59 allowed
              </h1>
            )}
          </div>

          {/* DIVIDER */}

          <div className="h-full w-px bg-gray-400 mx-auto"></div>
          {/* SETTING OPTION 2: AUTO DUPLICATE ON OTHER SIDE */}
          <div className="justify-self-end">
            <label className={`${radioLabelClass} justify-center pr-2`}>
              <input
                className={"mr-1"}
                type="checkbox"
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
              <span>Automatically duplicate on other side</span>
            </label>
          </div>
        </div>
      </div>

      {/* Header (non-scrollable) */}
      <div
        className={
          "grid place-items-center grid-cols-[2fr_1fr_2fr_1fr] font-bold p-1 border-b-2 border-gray-300 my-2"
        }
      >
        <div>EXERCISE</div>
        <div>DIRECTION</div>
        <div>DURATION</div>
        <div>ACTIONS</div>
      </div>

      {/* ===  ADD NEW ITEM ROW (non-scrollable) === */}
      <div className={"border-2 border-solid bg-green-100 border-gray-500"}>
        <BoxTitle title="Add new exercise" position="center" />
        <div
          className={`grid place-items-center grid-cols-[2fr_1fr_2fr_1fr] mb-2 mr-2 ml-2`}
        >
          {/* COL 1 - NEW ITEM NAME */}
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => handleNewItemChange("name", e.target.value)}
            className={textInputClass}
            placeholder="New exercise name"
          />
          {/* COL 2 - NEW ITEM DIRECTION */}
          <div className={optionsitemRowClass}>
            <label className={`${radioLabelClass} pl-2`}>
              <input
                type="checkbox"
                value="left"
                checked={newItem.direction === "left"}
                onChange={() => handleNewItemChange("direction", "left")}
              />
              <span>L</span>
            </label>
            <label className={`${radioLabelClass} pl-2`}>
              <input
                type="checkbox"
                value="right"
                checked={newItem.direction === "right"}
                onChange={() => handleNewItemChange("direction", "right")}
              />
              <span>R</span>
            </label>
          </div>
          {/* COL 3 - NEW ITEM DURATION */}
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
          {/* COL 3 - NEW ITEM ADD BUTTON */}
          <div>
            <RiAddCircleLine size={30} onClick={addNewItemToSequence} />
          </div>
        </div>
      </div>

      {/* === SEQUENCE GRID === */}
      <div
        ref={gridRef}
        style={{
          flex: 1,
          overflowY: "auto",
          borderLeft: "2px solid gray",
          borderRight: "2px solid gray",
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
                        {/* COL 2 - ITEM DIRECTION */}
                        <div
                          className={`${optionsitemRowClass} ${item.textColor}`}
                        >
                          <label className={`${radioLabelClass} pl-2`}>
                            <input
                              type="checkbox"
                              checked={item.direction === "left"}
                              onChange={() => toggleDirection(item.id, "left")}
                            />
                            <span>L</span>
                          </label>
                          <label className={`${radioLabelClass} pl-2`}>
                            <input
                              type="checkbox"
                              checked={item.direction === "right"}
                              onChange={() => toggleDirection(item.id, "right")}
                            />
                            <span>R</span>
                          </label>
                        </div>
                        {/* COL 3 - ITEM DURATION */}
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
                        {/* COL 4 - ITEM BUTTONS */}
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

      {/* === STICKY FOOTER === */}
      {/* TOTAL DURATION */}
      <div className={"border-2 border-solid bg-blue-100 border-black"}>
        <BoxTitle title="Save sequence" position="center" />
        <div
          className={`grid place-items-center grid-cols-[1fr_3fr_1fr] mb-2 mr-2 ml-2`}
        >
          <div className="text-center font-bold whitespace-nowrap">
            <text>Total Duration: </text>
            <div>
              {getTotalDuration(items).minutes} min{" "}
              {getTotalDuration(items).seconds} sec
            </div>
          </div>
          {/* SEQUENCE TITLE INPUT */}
          <input
            placeholder="New sequence name"
            type="text"
            className={sequenceTitleInputClass}
            value={newSequenceNameInput}
            onChange={(e) => setNewSequenceNameInput(e.target.value)}
          />
          <div>
            <button
              className={`${borderedButtonClass} whitespace-nowrap`}
              onClick={() => {
                saveSequence();
              }}
            >
              Save
              {/* to do: onClick save sequence by sending to db */}
            </button>
          </div>
        </div>
      </div>
    </div>

    // </div>
  );
}
