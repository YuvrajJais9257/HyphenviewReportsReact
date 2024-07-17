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
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-searchbuilder-dt/css/searchBuilder.dataTables.min.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "datatables.net-buttons/js/buttons.html5.min.js";
import "datatables.net-buttons/js/buttons.print.min.js";
import "datatables.net-searchbuilder/js/dataTables.searchBuilder.min.js";
import "datatables.net";
import "datatables.net-searchbuilder";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-searchbuilder-dt/css/searchBuilder.dataTables.css";
import "jquery-datetimepicker";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.colVis";
import "datatables.net-buttons/js/buttons.html5";
import "jquery-datetimepicker/jquery.datetimepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import moment from "moment";

import "datatables.net-datetime";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
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
  if (generatreportdetail && Object.keys(generatreportdetail).length > 0) {
    const firstReport = generatreportdetail[0];
    for (const key in firstReport) {
      if (Object.prototype.hasOwnProperty.call(firstReport, key)) {
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
    setShowSortOptions(!showSortOptions);
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

  var backToPageButton = $("#back-to-page-nav-btn");

  useEffect(() => {
    $.fn.dataTable.ext.errMode = "none";
    const table = $(tableRef.current).DataTable({
      // dom: "Qlfrtip",
      searchBuilder: {
        columns: true,
      },
      dom: "Blftip", // Add the B for buttons
      buttons: [
        {
          extend: "colvis",
          text: '<i class="fa fa-columns" ></i>',
          titleAttr: "Show / Hide Columns",
          className: "btn-icon",
        },
        {
          extend: "searchBuilder",
          text: '<i class="fa fa-filter"></i>',
          config: {
            depthLimit: 1,
            columns: ":not(:hidden)",
          },
          titleAttr: "Filter",
          className: "btn-icon",
        },
        {
          text: '<i class="fa fa-sort" ></i>',
          action: function () {
            setShowSortOptions(true);
          },
          titleAttr: "MultiSort",
          className: "btn-icon",
        },
        {
          extend: "collection",
          text: '<i class="fa fa-download" ></i>',
          titleAttr: "Download",
          className: "btn-icon",
          buttons: [
            {
              extend: "csvHtml5",
              text: '<span aria-label="CSV"><i class="fa fa-file-csv" ></i><label>CSV</label></span>',
              titleAttr: "Export CSV",
              exportOptions: {
                columns: "thead th:not(.noExport)",
              },
              className: "btn-icon",
            },

            {
              extend: "excelHtml5",
              text: '<span aria-label="Excel"><i class="fa fa-file-excel" ></i><label>Excel</label></span>',
              titleAttr: "Export Excel",
              exportOptions: {
                columns: "thead th:not(.noExport)",
              },
              className: "btn-icon",
            },
            {
              extend: "pdfHtml5",
              text: '<span aria-label="PDF"><i class="fas fa-file-pdf"></i><label>PDF</label></span>',
              titleAttr: "Export PDF",
              exportOptions: {
                columns: "thead th:not(.noExport)",
              },
              orientation: "landscape",
              pageSize: "A4",
              className: "btn-icon",
            },
          ],
        },
      ], // Include colvis and searchBuilder buttons
      autofill: true,
      scrollX: true,
      searching: true,

      ordering: false,
      orderMulti: true,
      data: generatreportdetail?.data || [],

      columns:
        columns &&
        columns.map((col) => ({
          data: col,
          title: col,
          render: (data) =>
            data !== undefined && data !== null ? data.toString() : "",
        })),
      initComplete: function (settings, json) {
        var dtButtons = $(".dt-buttons");
        var dtButtons_colVisibllity = $("buttons-colvis");
      },
    });

    // Function to get the current visible columns
    const getVisibleColumns = () => {
      const columns = table.columns().indexes().toArray();
      const visibleColumns = columns
        .map((index) => {
          const column = table.column(index);
          if (column.visible()) {
            return column.header().innerText;
          }
          return null;
        })
        .filter((name) => name !== null);

      return visibleColumns;
    };

    // Initialize with all columns visible
    let visibleColumns = getVisibleColumns();

    // Listen for the column visibility change event
    table.on("column-visibility", function () {
      visibleColumns = getVisibleColumns();

      // Check if no columns are visible
      if (visibleColumns.length === 1) {
        alert("At least one column should be selected");
      }

      // Log the updated visible columns
      console.log("Updated visible columns:", visibleColumns);
      setSelectedColumns(visibleColumns);
    });

    return () => {
      table.destroy();
    };
  }, [generatreportdetail, columns]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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
          {" "}
          <Button
            id="back-to-page-nav-btn"
            type="button"
            onClick={() => {
              history(-1);
            }}
          >
            Back
          </Button>
        </div>

        <Modal
          show={showSortOptions}
          onHide={() => setShowSortOptions(!showSortOptions)}
        >
          <Modal.Header closeButton>
            <Modal.Title>MultiSort Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={applyMultiSorting}>
              Apply Sort
            </Button>
          </Modal.Footer>
        </Modal>

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
        <div className="Generate_table_button_subContainer"></div>
      </div>
    </div>
  );
}

export default GenerateReport;
