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

const exampleItems: Item[] = [
  {
    id: "1",
    name: "Item One",
    direction: "left",
    duration: { min: 1, sec: 30 },
    textColor: "text-red-500",
  },
  {
    id: "2",
    name: "Item Two",
    direction: "right",
    duration: { min: 0, sec: 45 },
    textColor: "text-emerald-500",
  },
  {
    id: "3",
    name: "Item Three",
    direction: null,
    duration: { min: 2, sec: 15 },
    textColor: "text-amber-500",
  },
  {
    id: "4",
    name: "Item Four",
    direction: "left",
    duration: { min: 3, sec: 0 },
    textColor: "text-yellow-500",
  },
  {
    id: "5",
    name: "Item Five",
    direction: "right",
    duration: { min: 0, sec: 30 },
    textColor: "text-lime-500",
  },
  {
    id: "6",
    name: "Item Six",
    direction: "left",
    duration: { min: 1, sec: 0 },
    textColor: "text-green-500",
  },
  {
    id: "7",
    name: "Item Seven",
    direction: null,
    duration: { min: 2, sec: 45 },
    textColor: "text-teal-500",
  },
  {
    id: "8",
    name: "Item Eight",
    direction: "right",
    duration: { min: 3, sec: 30 },
    textColor: "text-cyan-500",
  },
  {
    id: "9",
    name: "Item Nine",
    direction: "left",
    duration: { min: 1, sec: 15 },
    textColor: "text-sky-500",
  },
  {
    id: "10",
    name: "Item Ten",
    direction: null,
    duration: { min: 0, sec: 20 },
    textColor: "text-blue-950",
  },
  {
    id: "11",
    name: "Item Eleven",
    direction: "right",
    duration: { min: 2, sec: 0 },
    textColor: "text-indigo-500",
  },
  {
    id: "12",
    name: "Item Twelve",
    direction: "left",
    duration: { min: 1, sec: 10 },
    textColor: "text-violet-500",
  },
  {
    id: "13",
    name: "Item Thirteen",
    direction: null,
    duration: { min: 4, sec: 5 },
    textColor: "text-purple-500",
  },
  {
    id: "14",
    name: "Item Fourteen",
    direction: "right",
    duration: { min: 3, sec: 10 },
    textColor: "text-fuscia-500",
  },
  {
    id: "15",
    name: "Item Fifteen",
    direction: "left",
    duration: { min: 0, sec: 50 },
    textColor: "text-orange-500",
  },
  {
    id: "16",
    name: "Item Sixteen",
    direction: null,
    duration: { min: 5, sec: 0 },
    textColor: "text-pink-500",
  },
  {
    id: "17",
    name: "Item Seventeen",
    direction: "right",
    duration: { min: 2, sec: 25 },
    textColor: "text-rose-500",
  },
];

export default exampleItems;
