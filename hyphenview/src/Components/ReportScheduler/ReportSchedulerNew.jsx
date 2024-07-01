import React, { useState, useRef, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ReportSchedulerNew.css"; 
import { Button } from "./../globalCSS/Button/Button";
import { getreporttitlefromondashbaord } from "../../actions/reportmanagement";
import {
  savenewSchedulereport,
  getschedulereportdetailforupdate,
} from "../../actions/reportscheduler";
import {
  FaCalendar,
  FaCalendarAlt,
  FaSearch,
  FaTimesCircle,
} from "react-icons/fa";
import styles from "./ReportSchedulerNew.module.css";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
 
import Header from "../header";
import { useDispatch, useSelector } from "react-redux";
import { json, useLocation, useNavigate } from "react-router-dom";

 
const ReportSchedulerNew = () => {

  // State variables for managing form inputs and selections
  const [reportTitle, setReportTitle] = useState("");
  const [selectedPdfReports, setSelectedPdfReports] = useState([]);
  const [selectedExcelReports, setSelectedExcelReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState([]);
  const [searchPdfReport, setSearchPdfReport] = useState("");
  const [searchExcelReport, setSearchExcelReport] = useState("");
  const [selectedTime, setSelectedTime] = useState();
   
    // State variables for dropdown toggles and email handling
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const [excelDropdownToggle, setExcelDropdownToggle] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("profile"));
  const history = useNavigate();
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state);
  const reportdetail = apiData?.reportmanagement?.allReportDetail;
  const form = useRef();
  const [startDate, setStartDate] = useState(null);
  const [emailTo, setEmailTo] = useState([]);
  const [emailCC, setEmailCC] = useState([]);
  const [invalidEmails, setInvalidEmails] = useState([]);
  let _invalidEmails = [];
  const [emailBody, setEmailBody] = useState("");
  const [interval, setInterval] = useState("Daily");
  const [show, setShow] = useState(false);

  // Fetching report titles on component mount
  useEffect(() => {
    dispatch(
      getreporttitlefromondashbaord({
        email: user.user_email_id,
        database_type: "mysql",
        customer_id: user.customer_id,
        group_id: user.group_id,
      })
    );
  }, []);


 
  const handleOptionChange = (reportid, reportname) => {
    if (!selectedPdfReports.some((report) => report.report_id === reportid)) {
      setSelectedPdfReports([
        ...selectedPdfReports,
        { report_id: reportid, report_name: reportname },
      ]);
    } else {
      setSelectedPdfReports(
        selectedPdfReports.filter((report) => report.report_id !== reportid)
      );
    }
  };
 

  // Handling selection and deselection of Excel reports
  const handleExcelOptionChange = (reportid, reportname) => {
    if (!selectedExcelReports.some((report) => report.report_id === reportid)) {
      setSelectedExcelReports([
        ...selectedExcelReports,
        { report_id: reportid, report_name: reportname },
      ]);
    } else {
      setSelectedExcelReports(
        selectedExcelReports.filter((report) => report.report_id !== reportid)
      );
    }
  };
 

  // Select or deselect all PDF reports
  const handleSelectAll = () => {
    if (selectedPdfReports.length === reportdetail.length) {
      setSelectedPdfReports([]);
    } else {
      const allReports = reportdetail.map((report) => ({
        report_id: report.report_id,
        report_name: report.report_name,
      }));
      setSelectedPdfReports(allReports);
    }
  };
 
   // Select or deselect all Excel reports
  const handleExcelSelectAll = () => {
    if (selectedExcelReports.length === reportdetail.length) {
      setSelectedExcelReports([]);
    } else {
      const allReports = reportdetail.map((report) => ({
        report_id: report.report_id,
        report_name: report.report_name,
      }));
      setSelectedExcelReports(allReports);
    }
  };
  
  // Handle date selection for the schedule
  const handleDateChange = (newDate) => {
    if (newDate > new Date()) {
      setSelectedTime(newDate);
    } else {
      setSelectedTime(newDate);
    }
  };

   // Regex for validating email addresses
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  // Function to remove duplicate emails from the list  
  const removeDuplicates = (list) => Array.from(new Set(list));

  // Handle date selection for the schedule start date
  const handleScheduleDate = (date) => {
    setStartDate(date);
  };

   // Handle form submission for scheduling the report
  const handleEmail = async (e) => {
    e.preventDefault();
    const reportattachment = {
      pdf: selectedPdfReports.map((item) => item.report_id),
      xlsx: selectedExcelReports.map((item) => item.report_id),
    };
    const timeString = selectedTime.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
 
    const startdate = startDate.toISOString().split("T")[0] + " " + timeString;
    const isoDateString = selectedTime.toISOString().split("T")[0];
 
    const formattedDateTime = isoDateString + " " + timeString;
 
    const selectedreport =
      selectedReport.length > 0 ? selectedReport[0].report_id : null;
    const dataEntries = {
      customer_id: user.customer_id,
      reportTitle,
      reportattachment,
      selectedreport,
      scheduledTime: formattedDateTime,
      emailTo: emailTo,
      emailBody,
      emailCC: emailCC,
      interval,
      startDate: startdate,
    };
 
    console.log("Submitted data:", dataEntries);
    console.log(selectedReport[0].report_id, "SelectedReportId");
    dispatch(savenewSchedulereport(dataEntries, history));
  };
 
   // Predefined report options for demonstration
  const reportOptions = [
    {
      id: 1,
      label: "Students",
      value: "students",
    },
    {
      id: 2,
      label: "Teachers",
      value: "teachers",
    },
    {
      id: 3,
      label: "Parents",
      value: "parents",
    },
  ];
 
   // Handle selection of a report from the dropdown
  const handleReportChange = (value) => {
    console.log("Selected report value:", value);
    const report = reportdetail.filter((item) => item.report_name === value);
    console.log("Selected report:", report);
    setSelectedReport(report);
  };
 
    // Toggle visibility of the PDF report dropdown
  const handlePdfToggle = () => {
    setDropdownToggle(!dropdownToggle);
    setExcelDropdownToggle(false);
  };


   // Toggle visibility of the Excel report dropdown
  const handleExcelToggle = () => {
    setExcelDropdownToggle(!excelDropdownToggle);
    setDropdownToggle(false);
  };
 
   // Close all dropdowns
  const handleReportToggle = () => {
    setDropdownToggle(false);
    setExcelDropdownToggle(false);
  };
 
    // Filter reports based on search input for PDF reports
  const filteredPdfReports = reportdetail.filter((report) =>
    report.report_name.toLowerCase().includes(searchPdfReport.toLowerCase())
  );

   // Filter reports based on search input for Excel reports
  const filteredExcelReports = reportdetail.filter((report) =>
    report.report_name.toLowerCase().includes(searchExcelReport.toLowerCase())
  );
 
    // Redirect to dashboard
  const handelclickgotoDashboard = () => {
    history('/Dashboard')
  }
 
  return (
    <div>
      <div id="header" className="Header">
        <Header />
      </div>
      <div id="big-container">
        <div className="schedule_report_container">
          <span class="fas fa-house-user" onClick={handelclickgotoDashboard}></span><span>/</span>
          <span id="main-title">Schedule New Report</span>
        </div>
        <div id="form-container">
          <form id="report-scheduler-form" onSubmit={(e) => handleEmail(e)}>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
                Report Title
              </label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container title-icon">
                    <i class="fas fa-t"></i>
                  </span>
                  <input
                    required
                    placeholder="Report Title"
                    className="form-control"
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
                Select Reports (PDF)
              </label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
                    <i class="fa-solid fa-file-pdf"></i>
                  </span>
                  <div className="dropdown-button-container form-control">
                    <button
                      className="btn btn-light dropdown-setter-button "
                      type="button"
                      style={{  
                        width: "100%",
                        padding: "0px 10px",
                        fontSize: "0.9rem",
                        backgroundColor: "white",
                        border: "none"}}
                      id="dropdownMenuButton"
                      // data-bs-toggle="dropdown"
                      onClick={handlePdfToggle}
                      aria-expanded={dropdownToggle}
                    >
                      {selectedPdfReports.length === reportdetail.length
                        ? `All reports are selected (${selectedPdfReports.length})`
                        : selectedPdfReports.length > 0
                        ? selectedPdfReports
                            .map((item) => item.report_name)
                            .join(", ")
                        : "None Selected"}
                    </button>
                  </div>
                  {dropdownToggle && (
                    <ul className="unordered-list-container">
                      <div>
                        <div className="search-bar">
                          {" "}
                          <input
                            style={{
                              marginLeft: "2px",
                              width: "75%",
                              height: "30px",
                              borderRadius:"5px",
                              top: "3px",
                              paddingLeft: "75px",
                            }}
                            type="text"
                            value={searchPdfReport}
                            placeholder="Search Report"
                            onChange={(e) => setSearchPdfReport(e.target.value)}
                          />{" "}
                          <FaSearch
                            style={{
                              position: "absolute",
                              left: "8%",
                              top: "53%",
                              transform: "translate(-50%, -50%)",
                              fontSize: "1.2rem",
                            }}
                          />{" "}
                          <FaTimesCircle
                            style={{
                              position: "absolute",
                              left: "69%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              cursor: "pointer",
                            }}
                            onClick={() => setSearchPdfReport("")}
                          />{" "}
                          <style jsx>{`
                            @media only screen and (min-width: 768px) {
                              .search-bar {
                                position: relative;
                              }
                              .search-bar input {
                                width: 100%;
                              }
                              .search-bar svg {
                                display: block;
                              }
                            }
                            @media only screen and (max-width: 767px) {
                              .search-bar {
                                position: relative;
                              }
                              .search-bar input {
                                width: 100%;
                              }
                              .search-bar svg {
                                display: block;
                              }
                              .search-bar :where(svg:last-child) {
                                display: none;
                              }
                              .search-bar
                                :where(input:focus ~ svg:first-child) {
                                display: none;
                              }
                              .search-bar :where(input:focus ~ svg:last-child) {
                                display: block;
                              }
                            }
                          `}</style>{" "}
                        </div>
                        <div
                          style={{
                            backgroundColor: "#EEEEEE",
                            padding: "0px",
                            width: "73%",
                            marginLeft: "2px",
                          }}
                        >
                          <div
                            className="form-check"
                            style={{ width: "300px", paddingLeft: "47px" }}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="selectAll"
                              checked={
                                selectedPdfReports.length ===
                                reportdetail.length
                              }
                              onChange={handleSelectAll}
                            />
                            <label
                              htmlFor="selectAll"
                              className="form-check-label ms-2"
                            >
                              Select All
                            </label>
                          </div>
 
                          {filteredPdfReports.map((reportOption, index) => (
                            <li key={index} style={{ listStyle: "none" }}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`reportOption${index}`}
                                  checked={selectedPdfReports.some(
                                    (report) =>
                                      report.report_id ===
                                      reportOption.report_id
                                  )}
                                  onChange={() =>
                                    handleOptionChange(
                                      reportOption.report_id,
                                      reportOption.report_name
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`reportOption${index}`}
                                  className="form-check-label ms-2"
                                >
                                  {reportOption.report_name}
                                </label>
                              </div>
                            </li>
                          ))}
                        </div>
                      </div>
                    </ul>
                  )}
                </div>
              </div>
 
              {/*<div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
                    <i class="fa-solid fa-file-pdf"></i>
                  </span>
                  <MultiSelect
                    required
                    className="form-control"
                    options={reportdetail.map((report) => ({
                      value: report.report_id,
                      label: report.report_name,
                    }))}
                    value={selectedPdfReports}
                    onChange={setSelectedPdfReports}
                    labelledBy="None Selected"
                  />
                </div>
                  </div>*/}
              {console.log(selectedPdfReports, "SelectedPDFReports")}
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
                Select Reports (Excel)
              </label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container excel-icon-container">
                    <i class="fa-solid fa-file-excel"></i>
                  </span>
                  <div className=" dropdown-button-container form-control">
                    <button
                      className=" dropdown-setter-button btn btn-light"
                      type="button"
                      id="dropdownMenuButtonExcel"
                      style={{  
                        width: "100%",
                        padding: "0px 10px",
                        fontSize: "0.9rem",
                        backgroundColor: "white",
                        border: "none"}}
                      // data-bs-toggle="dropdown"
                      onClick={handleExcelToggle}
                      aria-expanded={excelDropdownToggle}
                    >
                      {selectedExcelReports.length === reportdetail.length
                        ? `All reports are selected (${selectedExcelReports.length})`
                        : selectedExcelReports.length > 0
                        ? selectedExcelReports
                            .map((item) => item.report_name)
                            .join(", ")
                        : "None Selected"}
                    </button>
                  </div>
                  {excelDropdownToggle && (
                    <ul className="unordered-list-container">
                      <div>
                        <div className="search-bar">
                          {" "}
                          <input
                            style={{
                              marginLeft: "2px",
                              width: "75%",
                              height: "30px",
                              borderRadius:"5px",
                              top: "3px",
                              paddingLeft: "75px",
                            }}
                            type="text"
                            value={searchExcelReport}
                            placeholder="Search Report"
                            onChange={(e) =>
                              setSearchExcelReport(e.target.value)
                            }
                          />{" "}
                          <FaSearch
                            style={{
                              position: "absolute",
                              left: "8%",
                              top: "53%",
                              transform: "translate(-50%, -50%)",
                              fontSize: "1.2rem",
                            }}
                          />{" "}
                          <FaTimesCircle
                            style={{
                              position: "absolute",
                              left: "69%",
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              cursor: "pointer",
                            }}
                            onClick={() => setSearchExcelReport("")}
                          />{" "}
                          <style jsx>{`
                            @media only screen and (min-width: 768px) {
                              .search-bar {
                                position: relative;
                              }
                              .search-bar input {
                                width: 100%;
                              }
                              .search-bar svg {
                                display: block;
                              }
                            }
                            @media only screen and (max-width: 767px) {
                              .search-bar {
                                position: relative;
                              }
                              .search-bar input {
                                width: 100%;
                              }
                              .search-bar svg {
                                display: block;
                              }
                              .search-bar :where(svg:last-child) {
                                display: none;
                              }
                              .search-bar
                                :where(input:focus ~ svg:first-child) {
                                display: none;
                              }
                              .search-bar :where(input:focus ~ svg:last-child) {
                                display: block;
                              }
                            }
                          `}</style>{" "}
                        </div>
                        <div
                          style={{
                            backgroundColor: "#EEEEEE",
                            padding: "0px",
                            width: "73%",
                            marginLeft: "2px",
                          }}
                        >
                          <div
                            className="form-check"
                            style={{ width: "300px", paddingLeft: "47px" }}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="selectAllExcel"
                              checked={
                                selectedExcelReports.length ===
                                reportdetail.length
                              }
                              onChange={handleExcelSelectAll}
                            />
                            <label
                              htmlFor="selectAllExcel"
                              className="form-check-label ms-2"
                            >
                              Select All
                            </label>
                          </div>
                          {/* Excel Report Options */}
                          {filteredExcelReports.map((reportOption, index) => (
                            <li key={index} style={{ listStyle: "none" }}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`excelReportOptions${index}`}
                                  checked={selectedExcelReports.some(
                                    (report) =>
                                      report.report_id ===
                                      reportOption.report_id
                                  )}
                                  onChange={() =>
                                    handleExcelOptionChange(
                                      reportOption.report_id,
                                      reportOption.report_name
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`excelReportOptions${index}`}
                                  className="form-check-label ms-2"
                                >
                                  {reportOption.report_name}
                                </label>
                              </div>
                            </li>
                          ))}
                        </div>
                      </div>
                    </ul>
                  )}
                </div>
              </div>
              {/*<div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
                    <i class="fa-solid fa-file-excel"></i>
                  </span>
                  <MultiSelect
                    required
                    className="form-control"
                    options={reportdetail.map((report) => ({
                      value: report.report_id,
                      label: report.report_name,
                    }))}
                    value={selectedExcelReports}
                    onChange={setSelectedExcelReports}
                    labelledBy="None Selected"
                  />
                </div>
                  </div>*/}
              {console.log(selectedExcelReports, "SelectedExcelReports")}
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
              Select Reports to Display on E-Mail Body (Optional)
              </label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container report-display-icon-container">
                    <i class="fa-solid fa-file"></i>
                  </span>
                  <select
                    onClick={handleReportToggle}
                    required
                    className="form-control"
                    value={
                      selectedReport.length > 0
                        ? selectedReport[0].report_name
                        : ""
                    }
                    onChange={(e) => handleReportChange(e.target.value)}
                  >
                    <option value="">None Selected</option>
                    {reportdetail.map((report, index) => (
                      <option key={index} value={report.report_name}>
                        {report.report_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {console.log(selectedReport, "SelectedReport")}
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
                ScheduledTime
              </label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container schedule-time-icon-container">
                    <i class="fa-solid fa-calendar"></i>
                  </span>
                  <DatePicker
                    required
                    className="form-control"
                    selected={selectedTime}
                    onChange={handleDateChange}
                    showTimeSelect
                    placeholderText="Scehduled Time"
                    timeFormat="HH:mm:ss"
                    timeIntervals={5}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    minDate={new Date()}
                  />
                </div>
              </div>
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">Email To</label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
                    <i class="fa-solid fa-envelope"></i>
                  </span>
                  <ReactMultiEmail
                    required
                    className="form-control"
                    placeholder="Email To"
                    emails={emailTo}
                    validateEmail={(email) => {
                      console.log("validating email: ", email);
 
                      if (invalidEmails.length !== 0) {
                        setInvalidEmails([]);
                      }
 
                      if (email === "undefined") {
                        return false;
                      }
 
                      const isValid = emailRegex.test(email);
 
                      if (!isValid && _invalidEmails.indexOf(email) === -1) {
                        _invalidEmails.push(email);
                        console.log(
                          "_invalidEmails: ",
                          _invalidEmails.slice(0)
                        );
                      }
 
                      return isValid;
                    }}
                    onChange={(_emails) => {
                      console.log("on change - emailTo: ", emailTo);
                      console.log(
                        "on change - _invalidEmails: ",
                        _invalidEmails
                      );
                      setInvalidEmails(removeDuplicates(_invalidEmails));
                      setEmailTo(removeDuplicates(_emails));
                    }}
                    getLabel={(email, index, removeEmail) => {
                      return (
                        <div data-tag key={index}>
                          {email}
                          <span
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">Email Cc</label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
                    <i class="fa-solid fa-envelope"></i>
                  </span>
                  <ReactMultiEmail
                    required
                    placeholder="emailCC"
                    emails={emailCC}
                    validateEmail={(email) => {
                      console.log("validating email: ", email);
 
                      // using this as an "onChange" event and getting rid of old values
                      if (invalidEmails.length !== 0) {
                        setInvalidEmails([]);
                      }
 
                      if (email === "undefined") {
                        return false;
                      }
 
                      const isValid = emailRegex.test(email);
 
                      if (!isValid && _invalidEmails.indexOf(email) === -1) {
                        _invalidEmails.push(email);
                        console.log(
                          "_invalidEmails: ",
                          _invalidEmails.slice(0)
                        );
                      }
 
                      return isValid;
                    }}
                    onChange={(_emails) => {
                      console.log("on change - emailCC: ", emailCC);
                      console.log(
                        "on change - _invalidEmails: ",
                        _invalidEmails
                      );
                      setInvalidEmails(removeDuplicates(_invalidEmails));
                      setEmailCC(removeDuplicates(_emails));
                    }}
                    // getLabel?
                    getLabel={(email, index, removeEmail) => {
                      return (
                        <div data-tag key={index}>
                          {email}
                          <span
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">Email Body</label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
                    <i class="fa-solid fa-envelope-open-text envelope-open-icon"></i>
                  </span>
                  <textarea
                    required
                    className="form-control"
                    id="email-body-textarea"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    name="message"
                    placeholder="Email Body Content..."
                  />
                </div>
              </div>
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">Interval</label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
                    <i class="fa-solid fa-clock"></i>
                  </span>
                  <select
                    required
                    className="form-control"
                    id="interval"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
                Start Date(Optional)
              </label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container start-date-icon-container">
                    <i class="fa-solid fa-calendar"></i>
                  </span>
                  <DatePicker
                    required
                    style={{ width: "100%" }}
                    className="form-control"
                    selected={startDate}
                    onChange={handleScheduleDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Start Date"
                    minDate={new Date()}
                  />
                </div>
              </div>
            </div>
            <div class="mb-3 row external-button-container">
              <div className="input-group button-container flex-nowrap">
                <Button
                  // className="btn btn-dark "
                  id="add-scheduler-button"
                  type="submit"
                >
                  Add Scheduler
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default ReportSchedulerNew;
 