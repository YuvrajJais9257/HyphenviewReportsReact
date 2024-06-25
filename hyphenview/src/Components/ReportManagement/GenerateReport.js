import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../header";
import "./GenerateReport.css";
import { useDispatch, useSelector } from "react-redux";
import { generateReportId } from "../../actions/reportmanagement";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./../globalCSS/SearchTable/SearchTable.module.css";
import { Button } from "./../globalCSS/Button/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Dropdown } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import $ from "jquery";
import "datatables.net";
import "datatables.net-searchbuilder";
 
import "datatables.net-datetime"
 

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

function GenerateReport() {
  const tableRef = useRef();
  const dispatch = useDispatch();
  const history = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  //const [search, setSearch] = useState("");
  const queryParameters = new URLSearchParams(window.location.search);
  const report_id = queryParameters.get("report_id");
  console.log(user, report_id, "user", "report_id");
  const apiData = useSelector((state) => state);
  useMemo(() => {
    console.log("vbnmkl");
    dispatch(
      generateReportId({
        report_id: report_id,
        email: user.user_email_id,
        database_type: "mysql",
      })
    );
  }, [dispatch, report_id, user.user_email_id]);
  const generatreportdetail = apiData?.reportmanagement.generate_report_id;
  console.log(generatreportdetail, "generatreportdetail");
  if (Array.isArray(generatreportdetail) && generatreportdetail.length > 0) {
    const firstReport = generatreportdetail[0];
    for (const key in firstReport) {
      if (Object.hasOwnProperty.call(firstReport, key)) {
        console.log(`Type of ${key}:`, typeof firstReport[key]);
      }
    }
  } else {
    console.log("generatreportdetail is empty");
  }
  // const columns = generatreportdetail && generatreportdetail[0]
  const columns = generatreportdetail?.column_names || [];
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
    const sortedData = multiSort([...generatreportdetail.data], sortCriteria);
    table.clear().rows.add(sortedData).draw();
  };

  const exportToExcel = (tableId) => {
    const tableSelect = document.getElementById(tableId);
    const ws = XLSX.utils.table_to_sheet(tableSelect);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, "DetailGenerateReport.xlsx");
  };

  const handleExportPDF = () => {
    const input = document.getElementById("table-to-excel");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("table-export.pdf");
    });
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
      data: generatreportdetail?.data || [],
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
  }, [generatreportdetail, columns]);

  const handleAddSortingCriteria = () => {
    setSortCriteria([...sortCriteria, { column: "", order: "asc" }]);
  };

  return (
    <div>
      <div className="Generate_table_header">
        <Header />
      </div>
      <div
        id="Generate_table_main_container"
        className="Generate_table_main_container"
      >
        <div className="Generate_table_export_rearch">
          {/* <div className="export_csv">
            <span>
              <i
                class="fas fa-file-excel"
                onClick={() => exportToExcel("table-to-excel")}
                style={{ color: "green", fontWeight: "bold" }}
              ></i>
            </span>
          </div> */}
        </div>
        <div className="filter-sort-container">
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

          <button
            id="filter-toggle-btn-id"
            className="btn btn-default filter-toggle-btn"
          >
            <img
              onClick={handleFilterClick}
              className="filter-toggle-icon"
              src="https://cdn-icons-png.flaticon.com/128/2676/2676818.png"
            />
          </button>
        </div>
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
                    <img
                      onClick={handleAddSortingCriteria}
                      className="add-sort-item-icon"
                      src="https://cdn-icons-png.flaticon.com/128/3416/3416075.png"
                      alt="add-criteria"
                    />
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
        <div className="table-container-div">
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
      <div className="Generate_table_button">
        <div className="Generate_table_button_subContainer">
        <Button
          type="button"
          onClick={() => {
            history(-1);
          }}
        >
          Back
        </Button>
        <Button type="button" className="download" onClick={handleExportPDF}>
          DownLoad PDF
        </Button>
        <Button
          type="button"
          className="download"
          onClick={() => exportToExcel("table-to-excel")}
        >
          DownLoad XLSX
        </Button>
        </div>
      </div>
    </div>
  );
}

export default GenerateReport;
