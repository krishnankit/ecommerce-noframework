import React, { useState, useRef, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

function Filter({ setFilter }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownBtnRef = useRef();
  const dropdownRef = useRef();
  const [category, setCategory] = useState("Category...");
  const titleRef = useRef();

  // Add Eventlistener on body to close dropdown when clicked anywhere.
  useEffect(() => {
    function closeDropdown() {
      setShowDropdown(false);
      dropdownBtnRef.current.removeAttribute("open");
    }

    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  function toggleDropdown(event) {
    event.stopPropagation();
    setShowDropdown(!showDropdown);

    // Here open attribute is added to dropdown arrow conditionally
    if (showDropdown) {
      event.target.removeAttribute("open");
    } else {
      event.target.setAttribute("open", true);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mb-4 px-8 py-4 sm:flex sm:items-center sm:gap-8 rounded shadow-sm">
      <div className="w-full mb-4 sm:my-2 flex justify-between">
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Search"
          className="px-2 py-1 outline-none border-b-2 border-indigo-500 w-full"
          ref={titleRef}
        />
        <button className="outline-none">
          <FaMagnifyingGlass
            className="inline text-secondary ml-2 hover:text-gray"
            onClick={() => {
              setFilter(filter => ({
                ...filter,
                title: titleRef.current.value,
              }));
            }}
          />
        </button>
      </div>
      <div className="w-full relative flex">
        <button
          className={`relative inline-block w-full px-2 py-1 outline-none bg-white text-left text-slate-800 capitalize border-b-2 border-indigo-500 group ${showDropdown ? "open" : ""}`}
          onClick={toggleDropdown}
          ref={dropdownBtnRef}
        >
          {category}
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-block transition duration-150 group-open:-rotate-180"
            width="12"
            height="8"
            viewBox="0 0 80 50"
            preserveAspectRatio="none"
          >
            <path
              className="transition duration-100 stroke-indigo-500"
              d="M0 0 L40 50"
              fill="none"
              strokeLinecap="round"
              strokeWidth="10"
            />
            <path
              className="transition duration-100 stroke-indigo-500"
              d="M40 50 L80 0"
              fill="none"
              strokeLinecap="round"
              strokeWidth="10"
            />
          </svg>
        </button>
        <button className="outline-none">
          <FaMagnifyingGlass
            className="inline text-secondary ml-2 hover:text-gray"
            onClick={() => {
              setFilter(filter => ({
                ...filter,
                category
              }));
            }}
          />
        </button>
        <Dropdown
          show={showDropdown}
          dropdownRef={dropdownRef}
          setCategory={setCategory}
        />
      </div>
    </div>
  );
}

function Dropdown({ show, dropdownRef, setCategory }) {
  const [dropdownHeight, setDropdownHeight] = useState(0);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    }
  }, [show]);

  return (
    // Tailwind does not support height so used inline style
    <ul
      className={`bg-gray-50 w-full absolute top-[110%] overflow-hidden right-0 text-primary shadow-sm transition-[max-height] duration-200`}
      style={{
        maxHeight: show ? dropdownHeight + "px" : "0",
        padding: show ? "0.125rem 0" : "0",
       }}
      ref={dropdownRef}
    >
      {
        ["clothes", "electronics", "furniture"].map(category => {
          return (
            <li
              key={category}
              className="px-2 py-1 text-slate-800 cursor-pointer transition duration-200 hover:bg-indigo-500 hover:text-gray-50 capitalize"
              onClick={() => setCategory(category)}
            >
              {category}
            </li>
          );
        })
      }
    </ul>
  );
}

export default Filter;
