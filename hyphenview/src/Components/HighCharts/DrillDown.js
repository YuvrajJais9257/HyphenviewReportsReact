import React, { useEffect, useMemo, useRef, useState } from "react";
import { getdataforDrilldown, drilldowninsitialvalue } from '../../actions/reportmanagement'
import { useDispatch, useSelector } from 'react-redux';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import Pagination from './../Pagination/Pagination'
import html2canvas from "html2canvas";
import Table from "react-bootstrap/Table";
import $ from "jquery";
import "datatables.net";
import "datatables.net-searchbuilder";
import "datatables.net-datetime"
import './DrillDown.css'
import { useNavigate } from "react-router-dom";


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

function DrillDown() {

    const tableRef = useRef();
    const dispatch = useDispatch();
    const history = useNavigate();

    const apiData = useSelector((state) => state);
    const user = JSON.parse(localStorage.getItem('profile'));
    const drilldownData = apiData?.reportmanagement.detaildatafordrilldown;

    const columns = drilldownData?.column_names || [];
    console.log(columns, "columns");
    const [sortCriteria, setSortCriteria] = useState([
        { column: "", order: "asc" },
    ]);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const handleSortOptions = () => {
        setShowSortOptions(!showSortOptions);
    };
    const applyMultiSorting = () => {
        const table = $(tableRef.current).DataTable();
        const sortedData = multiSort([...drilldownData.data], sortCriteria);
        table.clear().rows.add(sortedData).draw();
    };

    const handleFilterClick = () => {
        $(".dtsb-searchBuilder").toggle();
      };
    
      useEffect(() => {
        $.fn.dataTable.ext.errMode = "none";
        const table = $(tableRef.current).DataTable({
          dom: "Qlfrtip",
          searchBuilder: {
            columns: true,
          },
          scrollX: true,
          searching: true,
          ordering: false,
          orderMulti: true,
          data: drilldownData?.data || [],
          columns: columns && columns.map((col) => ({
            data: col,
            title: col,
            render: (data) =>
              data !== undefined && data !== null ? data.toString() : "", 
          })),
        });
    
        return () => {
          table.destroy();
        };
      }, [drilldownData, columns]);
    
      const handleAddSortingCriteria = () => {
        setSortCriteria([...sortCriteria, { column: "", order: "asc" }]);
      };


    useEffect(() => {
        // Retrieve the URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        console.log(searchParams, "searchParams")
        const reportTitle = searchParams.get('report_title');
        console.log(reportTitle, "reportTitle")
        const categoryName = searchParams.get('category_name');
        const categoryValue = searchParams.get('category_value');
        const selectedSeriesName = searchParams.get('selected_series_name');
        const selectedValueYCoordinate = searchParams.get('selected_value_y_coordinate');

        if (reportTitle && categoryValue) {
            dispatch(getdataforDrilldown({ customer_id: user?.customer_id, master_report: reportTitle, filter_value: categoryValue, selectedSeriesName: selectedSeriesName }))
        } else {
            dispatch(getdataforDrilldown({ customer_id: user?.customer_id, master_report: reportTitle, filter_value: '' }))
        }
    }, []);


    return (
        <div>
          <div className="Drilldown_table_header">
            {/* <Header /> */}
          </div>
          <div
            id="Drilldown_table_main_container"
            className="Drilldown_table_main_container"
          >
            <div className="Drilldown_table_export_rearch">
            </div>
            <div className="Drilldown-filter-sort-container">
              <button
                id="Drilldown-sort-by-btn"
                className="btn btn-light"
                onClick={handleSortOptions}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3545/3545579.png"
                  className="sort-by-btn-icon"
                />
              </button>
    
              <button
                id="filter-toggle-btn-id"
                className="btn btn-default Drilldown-filter-toggle-btn"
              >
                <img
                  onClick={handleFilterClick}
                  className="Drilldown-filter-toggle-icon"
                  src="https://cdn-icons-png.flaticon.com/128/2676/2676818.png"
                />
              </button>
            </div>
            {showSortOptions && (
              <div className="Drilldown-sort-options-super-parent">
                <div className="sort-options-super">
                  {" "}
                  <div className="Drilldown-sort-options-item-container">
                    {sortCriteria.map((criterion, index) => (
                      <div key={index} className="Drilldown-sort-options-item">
                        <select
                          value={criterion.column}
                          onChange={(e) =>
                            setSortCriteria((prevCriteria) => {
                              const updatedCriteria = [...prevCriteria];
                              updatedCriteria[index].column = e.target.value;
                              return updatedCriteria;
                            })
                          }
                          className="form-control Drilldown-sort-options-select"
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
                          className="Drilldown-remove-filter-item-btn"
                          disabled={sortCriteria.length <= 1}
                          onClick={() =>
                            setSortCriteria((prevCriteria) =>
                              prevCriteria.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png"
                            className="Drilldown-sort-remove-icon"
                          />
                        </button>
                        <img
                          onClick={handleAddSortingCriteria}
                          className="Drilldown-add-sort-item-icon"
                          src="https://cdn-icons-png.flaticon.com/128/3416/3416075.png"
                          alt="add-criteria"
                        />
                      </div>
                    ))}
                  </div>
                </div>
    
                <button
                  onClick={applyMultiSorting}
                  className="btn btn-dark drill-apply-sort"
                >
                  Apply Sort
                </button>
              </div>
            )}
            <div className="Drilldown-table-container-div">
              <Table id="myTable" striped bordered hover ref={tableRef}>
                <thead>
                  <tr>
                    {columns.map((col, i) => (
                      <th key={i}>{col}</th>
                    ))}
                  </tr>
                </thead>
              </Table>
            </div>
          </div>
        </div>
      );
    }
    
export default DrillDown