//{items: [], heading: string}

import { useState } from "react";

interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {

  //Hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

//   heading="";

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}

      <ul className="bg-slate-20 text-center text-gray-600 border-4 border-red-400 active:bg-white">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index ? "active:bg-slate-50" : "bg-white"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
