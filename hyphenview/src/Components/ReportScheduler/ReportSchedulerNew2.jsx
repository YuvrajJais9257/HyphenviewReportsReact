import React, { useState, useRef, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ReportSchedulerNew.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
// import {Form, Alert } from "react-bootstrap";
import { Button } from './../globalCSS/Button/Button';
import { getreporttitlefromondashbaord } from '../../actions/reportmanagement';
import { savenewSchedulereport, getschedulereportdetailforupdate } from '../../actions/reportscheduler';
import {
  FaCalendar,
  FaCalendarAlt,
  FaSearch,
  FaTimesCircle,
} from "react-icons/fa";
import styles from "./ReportSchedulerNew.module.css";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
// import {
//   FaFileAlt,
//   FaAngleDown,
//   FaFilePdf,
//   FaFileExcel,
//   FaFileExport,
//   FaClock,
//   FaEnvelope,
//   FaUser,
// } from "react-icons/fa";
import Header from "../header";
import { useDispatch, useSelector } from "react-redux";
import { json, useLocation, useNavigate } from "react-router-dom";

const ReportSchedulerNew = () => {
  const [reportTitle, setReportTitle] = useState("");
  const [selectedPdfReports, setSelectedPdfReports] = useState([]);
  const [selectedExcelReports, setSelectedExcelReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [searchReport, setSearchReport] = useState("");
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const [excelDropdownToggle, setExcelDropdownToggle] = useState(false);
  console.log(searchReport,"searchReport")

  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useNavigate();
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state);
  const reportdetail = apiData?.reportmanagement?.allReportDetail;
  console.log(reportdetail, "reportdetail")

  useEffect(() => {
    // setSelectedReport([])
    // const shemaDetail = JSON.parse(localStorage.getItem('SelectedSchema'));
    dispatch(getreporttitlefromondashbaord({ email: user.user_email_id, database_type: "mysql", customer_id: user.customer_id, group_id: user.group_id }));
  }, []);





  const handleDateChange = (newDate) => {
    if (newDate > new Date()) {
      setSelectedTime(newDate);
    } else {
      setSelectedTime(newDate);
    }
  };


  // const handleOptionChange = (reportid, reportname) => {
  //   const index = selectedPdfReports.indexOf(value);
  //   if (index === -1) {
  //     setSelectedPdfReports([...selectedPdfReports, ]);
  //   } else {
  //     setSelectedPdfReports(
  //       selectedPdfReports.filter((report) => report !== value)
  //     );
  //   }
  // };

  const handleOptionChange = (reportid, reportname) => {
    if (!selectedPdfReports.some(report => report.report_id === reportid)) {
      setSelectedPdfReports([
        ...selectedPdfReports,
        { report_id: reportid, report_name: reportname }
      ]);
    } else {
      setSelectedPdfReports(
        selectedPdfReports.filter(report => report.report_id !== reportid)
      );
    }
  };

  console.log(selectedPdfReports,"selectedPdfReports")

  const handleExcelOptionChange = (reportid, reportname) => {
    if (!selectedExcelReports.some(report => report.report_id === reportid)) {
      setSelectedExcelReports([
        ...selectedExcelReports,
        { report_id: reportid, report_name: reportname }
      ]);
    } else {
      setSelectedExcelReports(
        selectedExcelReports.filter(report => report.report_id !== reportid)
      );
    }
  };

  const handleSelectAll = () => {
    if (selectedPdfReports.length === reportdetail.length) {
      setSelectedPdfReports([]);
    } else {
      const allReports = reportdetail.map((report) =>  ({report_id: report.report_id,
      report_name: report.report_name}));
      setSelectedPdfReports(allReports);
    }
  };

  const handleReportChange = (value) => {
    const reportiddetail = reportdetail.filter((item)=>item.report_name===value)
    console.log(reportiddetail);
    if(reportiddetail.length>0){
      setSelectedReport(reportiddetail);
    }
   
  };

  console.log(selectedReport,"selectedReport")

  const handleExcelSelectAll = () => {
    if (selectedExcelReports.length === reportdetail.length) {
      setSelectedPdfReports([]);
    } else {
      const allReports = reportdetail.map((report) =>  ({report_id: report.report_id,
      report_name: report.report_name}));
      setSelectedExcelReports(allReports);
    }
    
  };

  const CustomInputWithIcon = ({ value, onClick, text }) => (
    <div className={styles.box}>
      <div>
        {/* <div className="iconContainer" style={{position:"absolute"}}>
          <FaClock
            style={{
              fontSize: "1.2rem",
              color: "#000",
            }}
          />
        </div> */}
        <span style={{ position: "relative" }}>
          <input
            className="date-pciker"
            type="text"
            placeholder={text}
            value={value}
            readOnly
            style={{
              width: "80%",
              padding: "3px",
              paddingLeft: "22%",
              paddingRight: "30px",
            }}
          />
          <FontAwesomeIcon
            icon={faCalendar}
            onClick={onClick}
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "3%",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </span>
      </div>
    </div>
  );

  const form = useRef();
  const [startDate, setStartDate] = useState(null);
  const [emailTo, setEmailTo] = useState([]);
  const [emailCC, setEmailCC] = useState([]);
  const [invalidEmails, setInvalidEmails] = useState([]);
  let _invalidEmails = [];
  const [emailBody, setEmailBody] = useState("");
  const [interval, setInterval] = useState("Daily");
  const [show, setShow] = useState(false);

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const removeDuplicates = (list) => Array.from(new Set(list));

  const CustomInputWithDate = ({ value, onClick, text }) => (
    <div className={styles.box}>
      <div>
        <span style={{ position: "relative" }}>
          <input
            style={{
              width: "80%",
              padding: "3px",
              paddingRight: "30px",
              paddingLeft: "30%",
            }}
            className="date-pciker"
            type="text"
            placeholder={text}
            value={value}
            readOnly
          />
          <FontAwesomeIcon
            icon={faCalendar}
            onClick={onClick}
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "3%",
              color: "#000",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </span>
      </div>
    </div>
  );

  const handleScheduleDate = (date) => {
    setStartDate(date);
  };


  const sendEmail = async (e) => {
    e.preventDefault();
    const reportattachment = {
      pdf: selectedPdfReports.map((item)=>item.report_id),
      xlsx: selectedExcelReports.map((item)=>item.report_id),
    }
    const timeString = selectedTime.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    const startdate = startDate.toISOString().split("T")[0] + " " + timeString;
    const isoDateString = selectedTime.toISOString().split("T")[0];

    const formattedDateTime = isoDateString + " " + timeString;
    const seletedreport = selectedReport[0].report_id;
    console.log(seletedreport,"seletedreport")
    // const customer_id = user.customer_id;

    const dataEntries = {
      customer_id: user.customer_id,
      reportTitle,
      reportattachment,
      seletedreport,
      scheduledTime: formattedDateTime,
      emailTo: emailTo,
      emailBody,
      emailCC: emailCC,
      interval,
      startDate: startdate,
    };

    dispatch(savenewSchedulereport(dataEntries,history))


  };

  return (
    <div>
      <div className='Header'>
        <Header />
      </div>
      <div className="schedule_email-form">
        <div style={{ textAlign: "center",fontWeight:"700" }}>Schedule New Report</div>
        <div
          className={styles.field}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label className={styles.textfield} htmlFor="reportTitle">
            Report Title
          </label>
          <div
            className={styles.box}
            style={{ display: "inline-flex", flexDirection: "row" }}
          >
            {/* <div className="iconContainer">
              <FaFileAlt
                style={{
                  fontSize: "1.2rem",
                  color: "#000",
                }}
              />
            </div> */}
            <input
              // style={{ width: "80%" }}
              type="text"
              id="reportTitle"
              placeholder="Report Title"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="select-report-pdf">
          <label htmlFor="selectReportsPDF">Select Reports (PDF)</label>
          {/*<pre>{JSON.stringify(selectedPdfReports)}</pre>*/}
          <div className={styles.field}>
            <div className={styles.box}>
              <div>
                {/* <div className="iconContainer">
                  <FaFilePdf
                    style={{
                      fontSize: "1.2rem",
                      color: "#000",
                    }}
                  />
                </div> */}
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  onClick={() => setDropdownToggle(!dropdownToggle)}
                  aria-expanded={dropdownToggle}
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    padding: "9px",
                    color: "grey",
                    border: "1px solid",
                    fontFamily: "sans-serif",
                  }}
                >
                  {selectedPdfReports.length === reportdetail.length
                    ? `All reports are selected (${selectedPdfReports.length})`
                    : selectedPdfReports.length > 0
                      ? selectedPdfReports.map((item)=>item.report_name).join(", ")
                      : "None Selected"}
                </button>
              </div>
              {dropdownToggle && (
                <ul
                  style={{
                    marginLeft: "-120px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <div className="search-bar">
                      {" "}
                      <input
                        style={{
                          padding: "5px",
                          paddingLeft: "30px",
                          width: "300px",
                        }}
                        type="text"
                        value={searchReport}
                        placeholder="Search Report"
                        onChange={(e) => setSearchReport(e.target.value)}
                      />{" "}
                      <FaSearch
                        style={{
                          position: "absolute",
                          left: "7%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "1.2rem",
                        }}
                      />{" "}
                      <FaTimesCircle
                        style={{
                          position: "absolute",
                          left: "95%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          cursor: "pointer",
                        }}
                        onClick={() => setSearchReport("")}
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
                          .search-bar :where(input:focus ~ svg:first-child) {
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
                        padding: "5px",
                        width: "300px",
                      }}
                    >
                      <div className="form-check" style={{ width: "300px" }}>
                        <input
                          style={{ width: "2px" }}
                          type="checkbox"
                          className="form-check-input"
                          id="selectAll"
                          checked={
                            selectedPdfReports.length === reportdetail.length
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
                      {/* {reportdetail.map((reportOption, index) => (
                        <li key={index} style={{ listStyle: "none" }}>
                          <div className="form-check">
                            <input
                              style={{ width: "2px" }}
                              type="checkbox"
                              className="form-check-input"
                              id={`reportOptions${index}`}
                              checked={selectedPdfReports.includes(
                                reportOption.report_name
                              )}
                              onChange={() =>
                                handleOptionChange(reportOption.report_id)
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
                      ))} */}

                      {reportdetail.map((reportOption, index) => (
                        <li key={index} style={{ listStyle: "none" }}>
                          <div className="form-check">
                            <input
                              style={{ width: "2px" }}
                              type="checkbox"
                              className="form-check-input"
                              id={`reportOption${index}`}
                              checked={selectedPdfReports.some(
                                report => report.report_id === reportOption.report_id
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

          {/*<MultiSelect
            className="select-report-dropdown"
            options={reportOptions}
            value={selectedPdfReports}
            onChange={setSelectedPdfReports}
            labelledBy="None Selected"
            placeholder="None Selected"
            isSearchable
            overrideStrings={{ selectSomeItems: "None Selected" }}
          />*/}
        </div>
        <br />
        <div className={styles.field}>
          <label className={styles.textfield} htmlFor="selectReportsExcel">
            Select Reports (Excel)
          </label>
          {/*<pre>{JSON.stringify(selectedExcelReports)}</pre>*/}
          <div className={styles.box}>
            <div>
              {/* <div className="iconContainer">
                <FaFileExcel
                  style={{
                    fontSize: "1.2rem",
                    color: "#000",
                  }}
                />
              </div> */}
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButtonExcel"
                data-bs-toggle="dropdown"
                onClick={() => setExcelDropdownToggle(!excelDropdownToggle)}
                aria-expanded={excelDropdownToggle}
                style={{
                  width: "100%",
                  padding: "9px",
                  backgroundColor: "#fff",
                  color: "grey",
                  border: "1px solid",
                  fontFamily: "sans-serif",
                }}
              >
                {selectedExcelReports.length === reportdetail.length
                  ? `All reports are selected (${selectedExcelReports.length})`
                  : selectedExcelReports.length > 0
                    ? selectedExcelReports.map((item)=>item.report_name).join(", ")
                    : "None Selected"}
              </button>
              {excelDropdownToggle && (
                <ul
                  style={{
                    marginLeft: "-120px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <div className="search-bar">
                      {" "}
                      <input
                        style={{
                          padding: "5px",
                          paddingLeft: "30px",
                          width: "300px",
                        }}
                        type="text"
                        value={searchReport}
                        placeholder="Search Report"
                        onChange={(e) => setSearchReport(e.target.value)}
                      />{" "}
                      <FaSearch
                        style={{
                          position: "absolute",
                          left: "7%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "1.2rem",
                        }}
                      />{" "}
                      <FaTimesCircle
                        style={{
                          position: "absolute",
                          left: "95%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          cursor: "pointer",
                        }}
                        onClick={() => setSearchReport("")}
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
                          .search-bar :where(input:focus ~ svg:first-child) {
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
                        padding: "5px",
                        width: "300px",
                      }}
                    >
                      <div className="form-check">
                        <input
                          style={{ width: "2px" }}
                          type="checkbox"
                          className="form-check-input"
                          id="selectAllExcel"
                          checked={
                            selectedExcelReports.length === reportdetail.length
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
                      {reportdetail.map((reportOption, index) => (
                        <li key={index} style={{ listStyle: "none" }}>
                          <div className="form-check">
                            <input
                              style={{ width: "2px" }}
                              type="checkbox"
                              className="form-check-input"
                              id={`excelReportOptions${index}`}
                              checked={selectedExcelReports.some(
                                report => report.report_id === reportOption.report_id
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
          {/*
          <MultiSelect
            className="select-report-dropdown"
            options={reportOptions}
            value={selectedExcelReports}
            onChange={setSelectedExcelReports}
            labelledBy="None Selected"
            placeholder="None Selected"
            isSearchable
            overrideStrings={{ selectSomeItems: "None Selected" }}
            />*/}
        </div>
        <br />
        <div className={styles.field}>
          <label
            className={styles.textfield}
            htmlFor="selectReportToDisplay"
            style={{ marginBottom: "7px" }}
          >
            Select Reports To - <span>DEB</span>
          </label>
          <div className={styles.box}>
            <div style={{ display: "inline-flex" }}>
              {/* <div className="iconContainer">
                <FaFileExport
                  style={{
                    fontSize: "1.2rem",
                    color: "#000",
                  }}
                />
              </div> */}
              <select
                style={{
                  // padding: "5px",
                  // paddingLeft: "135px",
                  borderRadius: "5px",
                  // width: "100%",
                  marginLeft: "-1px",
                }}
                // className="form-select"
                value={selectedReport.report_name}
                onChange={(e) => handleReportChange(e.target.value)}
              >
                <option value="" disabled >None Selected</option>
                {/* <option value="" disabled>Select Group Name</option> */}
                {reportdetail.map((reportOption, index) => (
                  <option key={index} value={reportOption.report_name}>
                    {reportOption.report_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <br />
        <div
          className={styles.field}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="schedule-time" className={styles.textfield}>
            Scehduled Time
          </label>
          <div className={styles.box} style={{width: "692px"}}>
            {/*<DatePicker
              className="datepicker"
              selected={selectedTime}
              onChange={handleScheduleTime}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select a date"
              customInput={<CustomInputWithIcon text="Scehduled Time" />}
              />*/}
            <DatePicker
              
              selected={selectedTime}
              onChange={handleDateChange}
              showTimeSelect
              customInput={<CustomInputWithIcon text="Schedule Time" />}
              timeFormat="HH:mm:ss"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm:ss"
              minDate={new Date()}
            />
          </div>
        </div>
        <form ref={form} onSubmit={sendEmail}>
          <div
            className={styles.field}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label className={styles.textfield} htmlFor="emailTo">
              Email-To{" "}
            </label>
            <div className={styles.box}>
              <div style={{ display: "inline-flex" }}>
                {/* <div className="iconContainer">
                  <FaEnvelope
                    style={{
                      fontSize: "1.2rem",
                      color: "#000",
                    }}
                  />
                </div> */}
                <div style={{ minWidth: "100%" }}>
                  <ReactMultiEmail
                    style={{
                      // width: "80%",
                      paddingBottom: "1px",
                    }}
                    placeholder="Email To"
                    emails={emailTo}
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
                      console.log("on change - emailTo: ", emailTo);
                      console.log(
                        "on change - _invalidEmails: ",
                        _invalidEmails
                      );
                      setInvalidEmails(removeDuplicates(_invalidEmails));
                      setEmailTo(removeDuplicates(_emails));
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
          </div>
          <div
            className={styles.field}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label className={styles.textfield} htmlFor="emailCC">
              Email CC:
            </label>
            <div className={styles.box}>
              <div style={{ display: "inline-flex", flexDirection: "row" }}>
                {/* <div className="iconContainer">
                  <FaEnvelope
                    style={{
                      fontSize: "1.2rem",
                      color: "#000",
                    }}
                  />
                </div> */}
                <div style={{ minWidth: "100%" }}>
                  <ReactMultiEmail
                    style={{ paddingBottom: "1px" }}
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
          </div>
          <div
            className={styles.field}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label className={styles.textfield} htmlFor="emailBody">
              Email Body:
            </label>
            <div className={styles.box}>
              <div style={{ display: "inline-flex", flexDirection: "row" }}>
                {/* <div className="iconContainer">
                  <FontAwesomeIcon
                    icon={faEnvelopeOpenText}
                    style={{
                      fontSize: "1.2rem",
                      color: "#000",
                    }}
                  />
                </div> */}
                <textarea
                  // style={{ width: "80%" }}
                  className="schedule_textarea"
                  id="emailBody"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  required
                  name="message"
                  placeholder="Email Body Content..."
                />
              </div>
            </div>
          </div>
          <div
            className={styles.field}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label className={styles.textfield} htmlFor="interval">
              Interval:
            </label>
            <div className={styles.box}>
              <div style={{ display: "inline-flex" }}>
                {/* <div className="iconContainer">
                  <FaClock
                    style={{
                      fontSize: "1.2rem",
                      color: "#000",
                    }}
                  />
                </div> */}
                <select
                  // style={{ width: "80%" }}
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
          <div
            className={styles.field}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label className={styles.textfield} htmlFor="start-date">
              Start Date(Optional)
            </label>
            <div className={styles.box} style={{width: "694px"}}>
              <DatePicker
                className="datepicker"
                selected={startDate}
                onChange={handleScheduleDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                customInput={<CustomInputWithDate text="Start Date" />}
              />
            </div>
          </div>
          <div className={styles.field}>
            <div
              className={styles.box}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="light"
                type="submit"
              >
                Add Scheduler
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportSchedulerNew;
