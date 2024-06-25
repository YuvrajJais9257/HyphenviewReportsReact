import React, { useState, useRef, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ReportSchedulerNew.css";
import { Button } from "./../globalCSS/Button/Button";
import { getreporttitlefromondashbaord} from "../../actions/reportmanagement";
import {
    updatescheduleinfo,
  getschedulereportdetailforupdate,
} from "../../actions/reportscheduler";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";

import Header from "../header";
import { useDispatch, useSelector } from "react-redux";
import { json, useLocation, useNavigate } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";

const ReportSchedulerAddNewRtp = () => {
  const [reportTitle, setReportTitle] = useState("");
  const [selectedPdfReports, setSelectedPdfReports] = useState([]);
  const [selectedExcelReports, setSelectedExcelReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
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
  const [interval, setInterval] = useState("Daily")

  const queryParameters = new URLSearchParams(window.location.search);
  const scheduleidforupdate = queryParameters.get('scheduleid');
  console.log(scheduleidforupdate,"scheduleidforupdate")

  const reportupdatedetail = apiData?.reportscheduler?.detailofscheduleforupdate;
  console.log(reportupdatedetail, "reportupdatedetail")

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

  useEffect(() => {
    dispatch(getschedulereportdetailforupdate({ customer_id: user.customer_id, scheduleid: scheduleidforupdate }));

  }, [scheduleidforupdate]);

  useEffect(() => {
    
    if (reportupdatedetail && reportupdatedetail?.Schedulers) {
      console.log("Updating report title...");
      const pdfValue = JSON.parse(reportupdatedetail.Schedulers.reportattachment).pdf;
      const seletedreportforpdf = reportdetail.filter(item => {
      return pdfValue.some(value => item.report_id===value);
      });

      const valuepdf = seletedreportforpdf.map((report) =>  ({report_id: report.report_id,
                                  report_name: report.report_name}))


      const xlsValue = JSON.parse(reportupdatedetail.Schedulers.reportattachment).xlsx;
      const seletedreportforxls = reportdetail.filter(item => {
      return xlsValue.some(value => item.report_id===value);
     });
     
     const valuexls = seletedreportforxls.map((report) =>  ({report_id: report.report_id,
      report_name: report.report_name}))


      console.log(valuepdf,valuexls,"___")




      setReportTitle(reportupdatedetail.Schedulers.reportTitle);
      setSelectedPdfReports(valuepdf)
      setSelectedExcelReports(valuexls)
      setSelectedReport(reportupdatedetail.Schedulers.reportIDEB)
      setSelectedTime(reportupdatedetail.Schedulers.scheduledtime)
      setStartDate(reportupdatedetail.Schedulers.startDate)
      setEmailTo(JSON.parse(reportupdatedetail.Schedulers.emailcc))
      setEmailCC(JSON.parse(reportupdatedetail.Schedulers.emailid))
      setEmailBody(reportupdatedetail.Schedulers.emailBodyContent)
      setInterval(reportupdatedetail.Schedulers.SchedulerPeriod)


    } else {
      console.log("Report detail or Schedulers property is undefined.");
    }
  }, [reportupdatedetail]);



  const handleDateChange = (newDate) => {
    if (newDate > new Date()) {
      setSelectedTime(newDate);
    } else {
      setSelectedTime(newDate);
    }
  };
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const removeDuplicates = (list) => Array.from(new Set(list));
  const handleScheduleDate = (date) => {
    setStartDate(date);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    const reportattachment = {
      pdf: selectedPdfReports.map((item) => item.value),
      xlsx: selectedExcelReports.map((item) => item.value),
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
    dispatch(updatescheduleinfo(dataEntries, history));
  };


  const handleReportChange = (value) => {
    console.log("Selected report value:", value);
    const report = reportdetail.filter((item) => item.report_name === value);
    console.log("Selected report:", report);
    setSelectedReport(report);
  };

  return (
    <div>
      <div id="header" className="Header">
        <Header />
      </div>
      <div id="big-container">
        <div id="main-container">
          <i class="fa-solid fa-clock"></i>/
          <label id="main-title">Schedule New Report</label>
        </div>
        <div id="form-container">
          <form id="report-scheduler-form" onSubmit={(e) => handleEmail(e)}>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
                Report Title
              </label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
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
              </div>
              {console.log(selectedPdfReports, "SelectedPDFReports")}
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
                Select Reports (Excel)
              </label>
              <div className="col-md-5 input-group-container">
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
              </div>
              {console.log(selectedExcelReports, "SelectedExcelReports")}
            </div>
            <div class="mb-3 row">
              <label className="col-md-4 control-label label">
                Select Reports To - DEB
              </label>
              <div className="col-md-5 input-group-container">
                <div className="input-group flex-nowrap">
                  <span class="icon-container">
                    <i class="fa-solid fa-file-pdf"></i>
                  </span>
                  <select
                    required
                    className="form-control"
                    value={selectedReport.report_name}
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
                  <span class="icon-container">
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
                  <span class="icon-container">
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
            <div class="mb-3 row">
              <div className="input-group button-container flex-nowrap">
                <button
                  className="btn btn-dark "
                  id="add-scheduler-button"
                  type="submit"
                >
                  Add Scheduler
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportSchedulerAddNewRtp;
