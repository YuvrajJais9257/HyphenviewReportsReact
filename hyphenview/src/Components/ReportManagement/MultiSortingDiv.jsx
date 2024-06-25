import React, { useState } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./GenerateReport.css";
function multiSort(data, sortCriteria) {
  return data.sort((a, b) => {
    // Iterate through each sorting criterion
    for (let criterion of sortCriteria) {
      const { column, order } = criterion;
      let aValue = a[column];
      let bValue = b[column];

      // Parse string representations of numbers to numbers
      if (typeof aValue === "string" && !isNaN(Number(aValue))) {
        aValue = Number(aValue);
      }
      if (typeof bValue === "string" && !isNaN(Number(bValue))) {
        bValue = Number(bValue);
      }

      // Convert string values to Date objects if column is a date
      const isDateColumn = aValue instanceof Date && bValue instanceof Date;

      // Use localeCompare for string comparisons
      const comparisonResult = isDateColumn
        ? aValue.getTime() - bValue.getTime() // Compare dates as timestamps
        : typeof aValue === "string" && typeof bValue === "string"
        ? aValue.localeCompare(bValue) // Compare strings using localeCompare
        : aValue < bValue
        ? -1
        : aValue > bValue
        ? 1
        : 0;

      if (comparisonResult !== 0) {
        return order === "asc" ? comparisonResult : -comparisonResult;
      }
    }
    return 0;
  });
}

const MultiSortingDiv = ({ tableRef, generatreportdetail, columns }) => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortCriteria, setSortCriteria] = useState([
    { column: "", order: "asc" },
  ]);
  const handleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };
  const handleAddSortingCriteria = () => {
    setSortCriteria([...sortCriteria, { column: "", order: "asc" }]);
  };
  const applyMultiSorting = () => {
    const table = $(tableRef.current).DataTable();
    const sortedData = multiSort([...generatreportdetail], sortCriteria);
    table.clear().rows.add(sortedData).draw();
    // Sort data using multiSort function and update sortedData state
  };
  return (
    <div className="multiSortingDivSubContainer">
      {" "}
      <button
        id="sort-by-btn"
        className="btn btn-light"
        onClick={handleSortOptions}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/128/3545/3545579.png"
          className="sort-by-btn-icon"
        />
      </button>
      {showSortOptions && (
        <div className="sort-options-super-parent">
          <div className="sort-options-super">
            {" "}
            <div className="sort-options-item-container">
              {sortCriteria.map((criterion, index) => (
                <div key={index} className="sort-options-item">
                  <select
                    value={criterion.column}
                    onChange={(e) =>
                      setSortCriteria((prevCriteria) => {
                        const updatedCriteria = [...prevCriteria];
                        updatedCriteria[index].column = e.target.value;
                        return updatedCriteria;
                      })
                    }
                    className="form-control sort-options-select"
                  >
                    <option value="">Select column</option>
                    {columns.map((col, i) => (
                      <option key={i} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                  <select
                    value={criterion.order}
                    onChange={(e) =>
                      setSortCriteria((prevCriteria) => {
                        const updatedCriteria = [...prevCriteria];
                        updatedCriteria[index].order = e.target.value;
                        return updatedCriteria;
                      })
                    }
                    className="form-control sort-options-select"
                  >
                    <option value="asc">asc</option>
                    <option value="desc">desc</option>
                  </select>
                  <button
                    className="remove-filter-item-btn"
                    disabled={sortCriteria.length <= 1}
                    onClick={() =>
                      setSortCriteria((prevCriteria) =>
                        prevCriteria.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png"
                      className="sort-remove-icon"
                    />
                  </button>
                  <button
                    onClick={handleAddSortingCriteria}
                    className="btn btn-light add-sort-criteria-btn"
                  >
                    <img
                      className="add-sort-item-icon"
                      src="https://cdn-icons-png.flaticon.com/128/3416/3416075.png"
                      alt="add-criteria"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={applyMultiSorting}
            className="btn btn-dark apply-sort"
          >
            Apply Sort
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiSortingDiv;
