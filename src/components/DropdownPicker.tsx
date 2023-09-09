import useClickOutside from "@/hooks/useClickOutside";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
export type DropdownItem<T = unknown> = {
  text: string;
} & T | string;

interface Props<Props> {
  placeholder: string
  items: DropdownItem[],
  selectedItems: DropdownItem<Props>[],
  setSelectedItems: Dispatch<SetStateAction<DropdownItem<Props>[]>>
}
export default function DropdownPicker<P>({ placeholder, items, selectedItems, setSelectedItems }: Props<P>) {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [showSelect, setSelect] = useState(false);
  const [search, setSearch] = useState("");
  const toggleItem = (item: DropdownItem<P>) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item))
    } else {
      setSearch("");
      setSelect(false);
      setSelectedItems((prev) => {
        return [...prev, item]
      })
    }
  }
  const searchItems = useMemo(() => {
    return items.filter((dropItem) => {
      const item = typeof dropItem === "string" ? dropItem : dropItem.text;
      return item.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    }) as DropdownItem<P>[];
  }, [search, items]);
  useClickOutside([inputRef, dropdownRef], () => {
    setSelect(false);
  })
  return (
    <div className="relative">
      <input
        type="text"
        onFocus={() => {
          setSelect(true);
        }}
        ref={inputRef}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        className="w-60 bg-palblack-700 outline-none border-palblack-200 border p-2 rounded-md flex items-center cursor-pointer"
        placeholder={placeholder}
      />
      <div className="w-60 p-2 rounded-md grid grid-cols-2 gap-2 h-fit content-center items-center">
        {selectedItems.map((item, i) => {
          return <DropdownGridItem key={i}
            toggleItem={toggleItem}>
            {item}
          </DropdownGridItem>
        })}
      </div>
      {showSelect && <div ref={dropdownRef}
        className="w-60 max-h-52 overflow-y-auto bg-palblack-800 py-2 border border-palblack-200 rounded-md absolute">
        {searchItems.length === 0 && <div className="text-palblack-100 p-2">
          No items
        </div>}
        {searchItems.map((item, i) => {
          return <DropdownItem key={i}
            selected={selectedItems.includes(item)}
            toggleItem={toggleItem}>
            {item}
          </DropdownItem>
        })}
      </div>}
    </div>
  );
}

type DropdownItemProps<T> = {
  children: DropdownItem<T>;
  toggleItem: (item: DropdownItem<T>) => void,
  selected: boolean
};

const DropdownGridItem = <T,>({ children, toggleItem }: Omit<DropdownItemProps<T>, "selected">) => {
  const text = typeof children === "string" ? children : children.text
  return (
    <div
      className={`bg-palblack-800 rounded-full px-2 py-1 flex gap-2 text-xs items-center group relative justify-between`}>
      <span className="w-full truncate text-gray-50">{text}</span>
      <span
        className="bg-palblack-50 text-palblack-800 pointer-events-none absolute -top-6 left-6 rounded-sm px-1 py-[2px] w-max opacity-0 transition-opacity group-hover:opacity-100"
      >
        {text}
      </span>

      <button data-tooltip-target="tooltip-default"
        className="w-6 cursor-pointer text-palblack-100 hover:text-palblack-300"
        onClick={() => toggleItem(children)}>
        <svg xmlns="http://www.w3.org/2000/svg"
          height={24}
          viewBox="0 0 24 24"
          fill="currentColor"
          width={24}><path d="M0 0h24v24H0V0z"
            fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg>
      </button>
    </div>
  )
}

const DropdownItem = <T,>({ children, toggleItem, selected }: DropdownItemProps<T>) => {
  return (
    <div onClick={() => toggleItem(children)}
      className={`${selected && "bg-palblack-600"} p-2 hover:bg-palblack-500 text-gray-50`}>
      {typeof children === "string" ? children : children.text}
    </div>
  )
}