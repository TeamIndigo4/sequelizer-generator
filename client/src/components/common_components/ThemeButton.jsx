import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  MdLightMode,
  MdDarkMode,
  MdSettingsBrightness,
} from "react-icons/md";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const options = [
  { value: "light", label: "Light", icon: <MdLightMode /> },
  { value: "dark", label: "Dark", icon: <MdDarkMode /> },
  { value: "system", label: "System", icon: <MdSettingsBrightness /> },
];

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === theme);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full inline-block text-left z-50 text-sm"
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-x-3">
          <span className="text-xl">{selectedOption.icon}</span>
          <span className="font-normal">{selectedOption.label}</span>
        </div>

        { isOpen ? <FaCaretUp/> : <FaCaretDown/> }
      </button>

      {isOpen && (
        <div className="absolute w-full right-0 mt-1 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/10 dark:ring-white/10">
          <ul className="py-1">
            {options.map(({ value, label, icon }) => (
              <li
                key={value}
                onClick={() => {
                  setTheme(value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  theme === value
                    ? "font-semibold text-primary dark:text-blue-400"
                    : "dark:text-[#eee]"
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
