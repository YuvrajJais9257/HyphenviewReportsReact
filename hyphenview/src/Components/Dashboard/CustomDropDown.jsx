import React, { useState } from "react";
import "./CustomDropDown.css";
import RightPopOutIcon from "../../assets/images/dashboardgroupIcon.png";
// CustomDropdown component definition
const CustomDropdown = ({
  isSidebarCollapsed,
  options,
  selectedOption,
  onOptionSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
 
   // Function to handle mouse enter event on an option
  const handleMouseEnter = (index) => {
    setHighlightedIndex(index);
  };
 
   // Function to handle mouse leave event from an option
  const handleMouseLeave = () => {
    setHighlightedIndex(null);
  };
 
   // Function to handle click event on an option
  const handleOptionClick = (option) => {
    onOptionSelect(option.value);
    setIsOpen(false);
  };
 
  return (
    <div className="custom-dropdown">
      <span id="dashboard-icon-container" onClick={() => setIsOpen(!isOpen)}>
        {" "}
        <img src="/featureIcon/1_Dashboardimg.png" className="Dashboard_logo" />
      </span>
      <span
        id={
          isSidebarCollapsed
            ? "dashboard-text-disabled"
            : "dashboard-text-enabled"
        }
        className="dashboard-text"
        onClick={() => setIsOpen(!isOpen)}
      >
        Dashboard
        <img src={RightPopOutIcon} id="right-popout-activate-icon" />
      </span>
 
      {isOpen && (
        <div
          className="dropdown-content-groupname"
          style={isSidebarCollapsed ? { left: "4.8%" } : { left: "19.25%" }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`dropdown-item-groupname ${
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
 
export default CustomDropdown;