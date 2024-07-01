import React, { useState } from "react";
import "./CustomDropDownNew.css";
// import RightPopOutIcon from "./right-popup-icon.png";

const CustomDropdownNew = ({
  isSidebarCollapsed,
  options,
  selectedOption,
  onOptionSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHighlightedIndex(index);
  };

  const handleMouseLeave = () => {
    setHighlightedIndex(null);
  };

  const handleOptionClick = (option) => {
    onOptionSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <span id="dashboard-icon-container" onClick={() => setIsOpen(!isOpen)}>
        {" "}
        <img
          src="/featureIcon/1_Dashboardimg.png"
          className="Dashboard_logo on-dashboard-icons"
        />
      </span>
      <span
        id={
          isSidebarCollapsed
            ? "dashboard-text-disabled"
            : "dashboard_text_enabled"
        }
        className="dashboard-text"
        onClick={() => setIsOpen(!isOpen)}
      >
        Dashboard
        {/* <img src={} id="right-popout-activate-icon" /> */}
      </span>

      {isOpen && (
        <div
          className="dropdown_content"
          style={isSidebarCollapsed ? { left: "5.1%" } : { left: "17.9%" }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`dropdown-item ${
                highlightedIndex === index ? "highlightedGroupOption" : ""
              } ${
                selectedOption === option.value ? "selectedGroupOption" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleOptionClick(option)}
            >
              <img
                src={option.icon}
                alt={option.label}
                className="dropdown-icon"
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdownNew;
