export interface Sequence {
  userId: string;
  name: string;
  items: Item[];
  createdDate: number;
  lastEditDate: number | null;
}

export interface Item {
  id: string;
  name: string;
  direction: "left" | "right" | null;
  duration: {
    min: number;
    sec: number;
  };
  textColor: string;
}
