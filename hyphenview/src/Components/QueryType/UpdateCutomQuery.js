import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CustomQuery.css";
import imageUrl1 from "../Images/area.png";
import imageUrl2 from "../Images/bar.png";
import imageUrl3 from "../Images/column.png";
import imageUrl4 from "../Images/line.png";
import imageUrl5 from "../Images/pie.png";
import imageUrl6 from "../Images/stacked-area.png";
import imageUrl7 from "../Images/stacked-bar.png";
import imageUrl8 from "../Images/stacked-column.png";
import imageUrl9 from "../Images/gauge.png";
import imageUrl10 from "../Images/radial-bar.png";
import imageUrl11 from "../Images/pie-chart.png";
import imageUrl12 from "../Images/google-maps.png";
import imageUrl13 from "../Images/donut-chart.png";
import imageUrl14 from "../Images/gauge-circle-plus.png";
import { getReportDetailByID } from "../../actions/reportmanagement";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../header";
import Popupaddparameter from "./Popupaddparameter";
import PopupremoveDateParameter from "./PopupremoveDateParameter";
import {
  testquryonCustompage,
  resettestquryonCustompage,
  testqueryoncustompageforresponse,
  resetbacktocustomquerypagewithdata,
} from "../../actions/auth";
import { Button } from "./../globalCSS/Button/Button";

export default function UpdateReportPage(props) {
  const insitialval = {
    title: "",
    query: "",
    start_date: "",
    end_date: "",
    type: "",
    chart_type: "",
    time_period: "",
    // show_dashboard: "",
    background_colour: "",
    font_size_title: "",
    font_size_value: "",
    chart_react_colour: "",
    enable_drildown: "",
    update_interval: "",
    report_id: "",
    upload_logo: "",
    status_value: "",
    status_value_color: "",
  };

  const charts = [
    {
      id: "area",
      value: "Area Chart",
      title: "Area Chart",
      imageUrl: imageUrl1,
    },
    { id: "bar", value: "Bar Chart", title: "Bar Chart", imageUrl: imageUrl2 },
    {
      id: "column",
      value: "Column Chart",
      title: "Column Chart",
      imageUrl: imageUrl3,
    },
    {
      id: "line",
      value: "Line Chart",
      title: "Line Chart",
      imageUrl: imageUrl4,
    },
    { id: "pie", value: "Pie Chart", title: "Pie Chart", imageUrl: imageUrl5 },
    {
      id: "stacked_area",
      value: "Stacked Area Chart",
      title: "Stacked Area Chart",
      imageUrl: imageUrl6,
    },
    {
      id: "stacked_bar",
      value: "Stacked Bar Chart",
      title: "Stacked Bar Chart",
      imageUrl: imageUrl7,
    },
    {
      id: "stacked_column",
      value: "Stacked Column Chart",
      title: "Stacked Column Chart",
      imageUrl: imageUrl8,
    },
    {
      id: "gauge",
      value: "Gauge Chart",
      title: "Gauge Chart",
      imageUrl: imageUrl9,
    },
    {
      id: "radial_bar",
      value: "Radial Bar Chart",
      title: "Radial Bar Chart",
      imageUrl: imageUrl10,
    },
    {
      id: "3d pie",
      value: "3d Pie Chart",
      title: "3d Pie Chart",
      imageUrl: imageUrl11,
    },
    {
      id: "3d donut",
      value: "3d Donut Chart",
      title: "3d Donut Chart",
      imageUrl: imageUrl13,
    },
    {
      id: "3Darea",
      value: "3d Area Chart",
      title: "3d Area Chart",
      imageUrl: imageUrl1,
    },
    {
      id: "speedometer",
      value: "speedometer",
      title: "Speedometer Gauge",
      imageUrl: imageUrl14,
    },
  ];

  const renderCharts = (chartList) =>
    chartList.map((chart) => (
      <div key={chart.id}>
        <input
          className="radBut"
          type="radio"
          id={chart.id}
          name="chart_type"
          value={chart.value}
          onChange={handleRadioChange}
          title={chart.title}
        />
        <label htmlFor={chart.id} className="radio-inline">
          <img className="charts_img" src={chart.imageUrl} alt={chart.title} />
        </label>
      </div>
    ));
  const [show, setShow] = useState(false);
  const [showLogoSection, setShowLogoSection] = useState(false);
  const [reportType, setReportType] = useState("");
  const [formdata, setformdata] = useState(insitialval);
  const [chartType, setchartType] = useState("");
  // const [showInDashboard, setShowInDashboard] = useState("");
  const [enableDrilldown, setEnableDrilldown] = useState("");
  const [popupaddateparameter, setpopupaddateparameter] = useState(false);
  const [popupremoveateparameter, setpopuppopupremoveateparameter] =
    useState(false);
  const [popupremovedateparameter, setpopupremovedateparameter] = useState();
  const [isChartSelected, setIsChartSelected] = useState(false);
  const [isDrilldownSelected, setIsDrilldownSelected] = useState(false);
  const [ischeckstartdate, setischeckstartdate] = useState(true);
  const [ischeckenddate, setischeckenddate] = useState(false);
  const [checkuploadlogo, setCheckUploadLogo] = useState("");
  const [islogoselected, setIsLogoSelected] = useState(false);

  const user = JSON.parse(localStorage.getItem("profile"));
  const history = useNavigate(props);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParameters = new URLSearchParams(window.location.search);
  const report_id = queryParameters.get("report_id");
  const BuildQuery = queryParameters.get("Query");
  console.log(BuildQuery, "BuildQuery");

  useEffect(() => {
    if (report_id) {
      dispatch(
        getReportDetailByID({ database_type: "mysql", report_id: report_id })
      );
      setformdata({ ...formdata, report_id: report_id });
    } else if (BuildQuery) {
      console.log(BuildQuery);
      setformdata({ ...formdata, query: BuildQuery });
    }
  }, [report_id, BuildQuery]);

  const handleUploadLogoChange = (event) => {
    const checklogouploaded = event.target.value;
    setCheckUploadLogo(checklogouploaded);

    setIsLogoSelected(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file, "file");

    if (file && file.type === "image/png" && file.size <= 1048576) {
      // Convert file to base64-encoded string
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        localStorage.setItem("uploadLogo", base64String);
      };
      reader.readAsDataURL(file);

      // setformdata({ ...formdata, upload_logo: file });
    } else {
      alert("Please select a PNG file with a maximum size of 1 MB.");
    }
  };

  const apiData = useSelector((state) => state);

  const reportdetail = apiData?.reportmanagement.generate_detail_by_id;
  console.log(reportdetail, "reportdetail");

  useEffect(() => {
    const reortdata = reportdetail?.data;
    console.log(reortdata, "item?.report_id");

    if (
      report_id === reortdata?.report_id.toString() &&
      reortdata?.report_type === "Box"
    ) {
      setShowLogoSection(true);
      setIsLogoSelected(true);
      if (reortdata.upload_logo != null) {
        setCheckUploadLogo("yes");
      }
      setformdata((prevData) => ({
        ...prevData,
        title: reortdata?.report_template_name,
        query: reortdata?.defined_query,
        start_date: reortdata?.start_date,
        end_date: reortdata?.end_date,
        type: reortdata?.report_type,
        chart_type: reortdata?.chart_type,
        time_period: reortdata?.time_period,
        // show_dashboard: reortdata?.show_in_dashboard,
        background_colour: reortdata?.background_colour,
        chart_react_colour: reortdata?.chart_react_colour,
        font_size_title: reortdata?.font_size_title,
        font_size_value: reortdata?.font_size_value,
        status_value: reortdata?.status_value,
        status_value_color: reortdata?.status_value_color,
        enable_drildown: reortdata?.enable_drilldown,
        update_interval: reortdata?.auto_update_interval,
        connection_type: reortdata?.rdbms_name,
        schema: reortdata?.schema_name,
        upload_logo: reortdata?.upload_logo,
      }));
      // setformdata(editdata);
    } else if (
      report_id === reortdata?.report_id.toString() &&
      reortdata?.report_type === "Table"
    ) {
      setformdata((prevData) => ({
        ...prevData,
        title: reortdata?.report_template_name,
        query: reortdata?.defined_query,
        start_date: reortdata?.start_date,
        end_date: reortdata?.end_date,
        type: reortdata?.report_type,
        chart_type: reortdata?.chart_type,
        time_period: reortdata?.time_period,
        // show_dashboard: reortdata?.show_in_dashboard,
        enable_drildown: reortdata?.enable_drilldown,
        update_interval: reortdata?.auto_update_interval,
        connection_type: reortdata?.rdbms_name,
        schema: reortdata?.schema_name,
      }));
    } else if (
      report_id === reortdata?.report_id.toString() &&
      reortdata?.report_type === "Chart"
    ) {
      setformdata((prevData) => ({
        ...prevData,
        title: reortdata?.report_template_name,
        query: reortdata?.defined_query,
        start_date: reortdata?.start_date,
        end_date: reortdata?.end_date,
        type: reortdata?.report_type,
        chart_type: reortdata?.chart_type,
        time_period: reortdata?.time_period,
        // show_dashboard: reortdata?.show_in_dashboard,
        enable_drildown: reortdata?.enable_drilldown,
        update_interval: reortdata?.auto_update_interval,
        connection_type: reortdata?.rdbms_name,
        schema: reortdata?.schema_name,
      }));
    }
  }, [reportdetail]);

  console.log(formdata, "formdata");
  useEffect(() => {
    const radButRadioButtons = document.querySelectorAll(
      '.radBut[type="radio"]'
    );
    const chartTypeTextArea = document.querySelector(
      'textarea[name="chart_type"]'
    );

    function handleRadioClick(event) {
      if (event.target.type === "radio" && event.target.checked) {
        chartTypeTextArea.value = event.target.value;

        setformdata((prevData) => ({
          ...prevData,
          chart_type: event.target.value,
        }));
      }
    }

    radButRadioButtons.forEach((radio) => {
      radio.addEventListener("click", handleRadioClick);
    });

    return () => {
      radButRadioButtons.forEach((radio) => {
        radio.removeEventListener("click", handleRadioClick);
      });
    };
  }, [show]);

  useEffect(() => {
    if (formdata.type === "Table" || formdata.type === "Box") {
      setformdata((prevData) => ({
        ...prevData,
        chart_type: "",
      }));
      if (isChartSelected) {
        setIsChartSelected(false);
      }
    }
    if (formdata.type === "Table" || formdata.type === "Box") {
      setEnableDrilldown("");
      setformdata((prevData) => ({
        ...prevData,
        enable_drildown: "",
      }));
      if (isDrilldownSelected) {
        setIsDrilldownSelected(false);
      }
    }
  }, [formdata.type, isChartSelected, isDrilldownSelected]);

  const handleRadioChange = (event) => {
    const chartTypes = {
      "Bar Chart": "bar",
      "Column Chart": "column",
      "Line Chart": "line",
      "Gauge Chart": "gauge",
      "Area Chart": "area",
      "Pie Chart": "pie",
      "Radial Bar Chart": "radialBar",
      "Stacked Area Chart": "stackarea",
      "Stacked Bar Chart": "stackbar",
      "Stacked Column Chart": "stackcolumn",
      "3d Pie Chart": "3Dpie",
      "3d Donut Chart": "3Ddonut",
      "3d Area Chart": "3Darea",
      speedometer: "speedometer",
    };

    const selectedChartType = chartTypes[event.target.value];

    if (selectedChartType) {
      console.log(event.target.value);
      setformdata({ ...formdata, [event.target.name]: selectedChartType });
      setShow(false);
      setIsChartSelected(true);
    }
  };

  const handelSubmit = (e) => {
    dispatch(resetbacktocustomquerypagewithdata());
    console.log(formdata, "formdata");
    e.preventDefault(formdata, "formdata");
    if (formdata.title && formdata.query && formdata.type) {
      localStorage.setItem("customeDetailOfReport", JSON.stringify(formdata));
    } else {
      alert("any field is missing select plz");
    }
    history("/PreviewPage");
  };

  const handelTestQuery = async (e) => {
    e.preventDefault();
    if (reportdetail?.data?.rdbms_name && reportdetail?.data?.schema_name) {
      console.log(
        reportdetail?.data?.rdbms_name,
        reportdetail?.data?.schema_name,
        "reportdetail?.data?.rdbms_name"
      );
      dispatch(
        testquryonCustompage({
          query: formdata.query,
          schema: reportdetail?.data?.schema_name,
          email: user.user_email_id,
          connection_type: reportdetail?.data?.rdbms_name,
          database_type: "mysql",
        })
      );
    }
  };

  useEffect(() => {
    dispatch(resettestquryonCustompage());
  }, []);

  const validationQuery = apiData?.auth.test_custom_query;
  const renderConditionalCharts = () => {
    if (
      validationQuery?.status_code === 200 &&
      validationQuery?.column_count === 1
    ) {
      const gaugeAndSpeedometerCharts = charts.filter(
        (chart) => chart.id === "gauge" || chart.id === "speedometer"
      );
      return (
        <div
          className="form-group radBut"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 50,
            justifyContent: "center",
          }}
        >
          {renderCharts(gaugeAndSpeedometerCharts)}
        </div>
      );
    } else {
      let chartList = charts.filter(
        (chart) => chart.id !== "gauge" && chart.id !== "speedometer"
      );

      const isPieChartAllowed =
        validationQuery?.status_code === 200 &&
        validationQuery?.column_count === 2 &&
        ["TEXT", "VARCHAR"].includes(validationQuery?.column_type[1]) &&
        ["INT", "FLOAT"].includes(validationQuery?.column_type[2]);

      console.log(
        validationQuery?.column_type[0],
        validationQuery?.column_type[1],
        isPieChartAllowed,
        "********1"
      );
      if (isPieChartAllowed) {
        const pieCharts = charts.filter(
          (chart) =>
            chart.id === "pie" &&
            chart.id === "3d pie" &&
            chart.id === "3d donut"
        );
        chartList = [...chartList, ...pieCharts];
      } else {
        chartList = chartList.filter(
          (chart) =>
            chart.id !== "pie" &&
            chart.id !== "3d pie" &&
            chart.id !== "3d donut"
        );
      }

      return (
        <div
          className="form-group radBut"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 50,
            justifyContent: "center",
          }}
        >
          {renderCharts(chartList)}
        </div>
      );
    }
  };

  function handelChangecharttype() {
    console.log("checktype");
    // setchartType(event.target.value)
    setShow((prev) => !prev);
  }

  const handelChange = (e) => {
    if (e.target.name === "query") {
      dispatch(resettestquryonCustompage());
      setformdata({ ...formdata, [e.target.name]: e.target.value });
    } else {
      setformdata({ ...formdata, [e.target.name]: e.target.value });
    }
  };

  const handleChangechart = (event) => {
    // setShow((prev) => !prev);
    console.log(event.target.value, "e.target.value");
    // setchartType(event.target.value)
    setformdata({ ...formdata, chart_type: event.target.value });
  };

  const handleReportTypeChange = (event) => {
    console.log(event.target.value, "event.target.value");
    setformdata({ ...formdata, type: event.target.value });

    if (event.target.value === "Table" || event.target.value === "Box") {
      setShowLogoSection(true);
    } else {
      setShowLogoSection(false);
    }
  };

  // const handleShowInDashboardChange = (event) => {
  //   setShowInDashboard(event.target.value);
  //   setformdata({ ...formdata, show_dashboard: event.target.value });
  // };

  // const handleEnableDrilldownChange = (event) => {
  //   setEnableDrilldown(event.target.value);
  //   setformdata({ ...formdata, enable_drildown: event.target.value });
  // };

  const handleEnableDrilldownChange = (event) => {
    const enableDrilldownValue = event.target.value;
    setEnableDrilldown(enableDrilldownValue);
    setformdata((prevData) => ({
      ...prevData,
      enable_drildown: enableDrilldownValue,
    }));
    setIsDrilldownSelected(true);
  };

  const handelclickgotoDashboard = () => {
    history("/Dashboard");
  };

  console.log("formdata", formdata);
  return (
    <div style={{ overflow: "clip" }}>
      {popupaddateparameter && (
        <Popupaddparameter
          formdata={formdata}
          setformdata={setformdata}
          setpopupaddateparameter={setpopupaddateparameter}
          setischeckstartdate={setischeckstartdate}
          setischeckenddate={setischeckenddate}
        />
      )}
      {popupremoveateparameter && (
        <PopupremoveDateParameter
          formdata={formdata}
          setformdata={setformdata}
          setpopuppopupremoveateparameter={setpopuppopupremoveateparameter}
        />
      )}
      <div>
        <Header />
      </div>
      <div className="Custom_container">
        <div className="Custom_header_container">
          <span
            class="fas fa-house-user"
            aria-hidden="true"
            onClick={handelclickgotoDashboard}
          ></span>
          <span>/</span>
          <span>Edit/Update Report</span>
        </div>
        <div className="customformpage">
          <form
            className="well form-horizontal"
            id="report_management"
            onSubmit={handelSubmit}
          >
            <fieldset>
              <div class="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">
                  Title
                </label>
                <div className="col-md-5 inputGroupContainer">
                  <div className="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">
                      <i class="fas fa-heading"></i>
                    </span>
                    <input
                      name="title"
                      placeholder="e.g. Incident Severity"
                      className="form-control"
                      maxLength={38}
                      minLength={5}
                      type="text"
                      value={formdata.title}
                      onChange={handelChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">
                  Query
                </label>
                <div className="col-md-5 inputGroupContainer">
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">
                      <i class="fas fa-edit"></i>
                    </span>
                    <textarea
                      className="form-control"
                      name="query"
                      placeholder="Query"
                      value={formdata.query}
                      onChange={handelChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="mb-3 row col-md-5`input-group param_button">
                <Button
                  type="button"
                  disabled={validationQuery?.status_code !== 200}
                  onClick={() => {
                    setpopupremovedateparameter();
                    setpopupaddateparameter(true);
                  }}
                >
                  Add Date Parameter
                </Button>

                <Button
                  type="button"
                  disabled={
                    !(
                      validationQuery?.status_code === 200 &&
                      formdata.start_date !== "" &&
                      formdata.end_date !== ""
                    )
                  }
                  onClick={() => {
                    setpopupremovedateparameter();
                    setpopuppopupremoveateparameter(true);
                  }}
                >
                  Remove Date Parameter
                </Button>

                <Button type="button" onClick={handelTestQuery}>
                  Test Query
                </Button>
              </div>
              {/* </div> */}
              <div style={{ textAlign: "center" }}>
                {validationQuery &&
                validationQuery?.detail === "Valid Query" ? (
                  <p>
                    <i
                      style={{
                        backgroundColor: "green",
                        fontSize: "18px",
                        width: "25px",
                        height: "15px",
                        borderRadius: "50%",
                      }}
                      class="fa-solid fa-check"
                    ></i>
                    {validationQuery?.detail}
                  </p>
                ) : validationQuery?.status_code === 400 ? (
                  validationQuery && (
                    <p>
                      <i
                        style={{
                          backgroundColor: "red",
                          fontSize: "18px",
                          width: "25px",
                          height: "15px",
                          borderRadius: "50%",
                        }}
                        class="fa-solid fa-smark"
                      ></i>
                      <span>{validationQuery?.detail}</span>
                    </p>
                  )
                ) : (
                  validationQuery && (
                    <p>
                      <i
                        style={{
                          backgroundColor: "yellow",
                          fontSize: "18px",
                          width: "25px",
                          height: "15px",
                          borderRadius: "50%",
                        }}
                        class="fa-solid fa-smark"
                      ></i>
                      {validationQuery?.detail}
                    </p>
                  )
                )}
              </div>
              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">
                  Start Date
                </label>
                <div className="col-md-5 inputGroupContainer">
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">
                      <i class="fas fa-calendar"></i>
                    </span>
                    <input
                      type="date"
                      name="start_date"
                      class="form-control"
                      disabled={ischeckstartdate}
                      placeholder="Start Date"
                      aria-label="Username"
                      aria-describedby="addon-wrapping"
                      value={formdata.start_date}
                      onChange={handelChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">
                  End Date
                </label>
                <div className="col-md-5 inputGroupContainer">
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">
                      <i class="fas fa-calendar"></i>
                    </span>
                    <input
                      type="date"
                      name="end_date"
                      class="form-control"
                      disabled={ischeckstartdate}
                      placeholder="end_date"
                      aria-label="Username"
                      aria-describedby="addon-wrapping"
                      value={formdata.end_date}
                      onChange={handelChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">
                  Type
                </label>
                <div className="col-md-5 selectContainer">
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">
                      <i class="fas fa-file-alt"></i>
                    </span>
                    <select
                      name="type"
                      className="form-control selectpicker"
                      disabled={validationQuery?.status_code != 200}
                      onChange={handleReportTypeChange}
                      value={formdata.type}
                      required
                    >
                      <option value="" disabled selected hidden>
                        Report Type
                      </option>
                      {validationQuery?.status_code === 200 &&
                        validationQuery?.column_count > 1 && (
                          <>
                            <option>Table</option>
                            <option>Chart</option>
                          </>
                        )}
                      {validationQuery?.status_code === 200 &&
                        validationQuery?.column_count === 1 && (
                          <>
                            <option>Box</option>
                            <option>Chart</option>
                          </>
                        )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">
                  Chart Type
                </label>
                <div className="col-md-5 selectContainer">
                  <div className="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">
                      <i class="fas fa-chart-bar"></i>
                    </span>
                    {console.log("formdata.chart_type", formdata.chart_type)}
                    <div>
                      <textarea
                        name="chart_type"
                        value={formdata.chart_type}
                        className="form-control"
                        onClick={handelChangecharttype}
                        placeholder="Chart Type"
                        required={
                          formdata.type !== "Table" && formdata.type !== "Box"
                        }
                        disabled={
                          validationQuery?.status_code !== 200 ||
                          formdata.type !== "Chart"
                        }
                        style={{
                          height: "34px",
                          resize: true,
                          width: "445px",
                          borderTopLeftRadius: "0",
                          borderBottomLeftRadius: "0",
                        }}
                      ></textarea>
                      {show && <div> {renderConditionalCharts()}</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">
                  Enable Drilldown
                </label>
                <div className="radio col-md-2">
                  <label className="radio-inline">
                    <input
                      type="radio"
                      name="enableDrilldown"
                      value="yes"
                      onChange={handleEnableDrilldownChange}
                      checked={
                        enableDrilldown === "yes" ||
                        formdata.enable_drildown === "yes"
                      }
                      disabled={
                        !formdata.query.toLowerCase().includes("group by") &&
                        !formdata.type === "Box"
                      }
                    />{" "}
                    Yes
                  </label>
                  {console.log(
                    formdata.query.toLowerCase().includes("group by")
                  )}
                  <label className="radio-inline">
                    <input
                      type="radio"
                      name="enableDrilldown"
                      value="no"
                      onChange={handleEnableDrilldownChange}
                      checked={
                        enableDrilldown === "no" ||
                        formdata.enable_drildown === "no"
                      }
                      disabled={
                        !formdata.query.toLowerCase().includes("group by") &&
                        !formdata.type === "Box"
                      }
                    />{" "}
                    No
                  </label>
                </div>
              </div>
              {showLogoSection && formdata.type === "Box" && (
                <div className="mb-3 row">
                  <label className="col-md-4 control-label testalinritemval">
                    Upload logo
                  </label>
                  <div className="radio col-md-2">
                    <label className="radio-inline">
                      <input
                        type="radio"
                        checked={checkuploadlogo === "yes"}
                        name="hosting3"
                        value="yes"
                        onChange={handleUploadLogoChange}
                      />{" "}
                      Yes
                    </label>
                    <label className="radio-inline">
                      <input
                        type="radio"
                        name="hosting3"
                        checked={checkuploadlogo === "no"}
                        value="no"
                        onChange={handleUploadLogoChange}
                      />{" "}
                      No
                    </label>
                    {checkuploadlogo === "yes" && (
                      <label style={{ margin: "20px 20px 20px 40px" }}>
                        <input
                          name="file"
                          onChange={handleFileChange}
                          type="file"
                          accept="image/png"
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
              {formdata.type === ("Chart" || "Box") && (
                <div className="mb-3 row">
                  <label className="col-md-4 control-label testalinritemval">
                    Auto Update Interval
                  </label>
                  <div className="col-md-5 selectContainer">
                    <div className="input-group flex-nowrap">
                      <span class="input-group-text" id="addon-wrapping">
                        <i class="fas fa-hourglass-half"></i>
                      </span>

                      <select
                        name="update_interval"
                        className="form-control selectpicker"
                        disabled={validationQuery?.status_code != 200}
                        value={formdata.update_interval}
                        onChange={handelChange}
                      >
                        <option name="" disabled selected hidden>
                          Minute(s)
                        </option>
                        <option>1 minute</option>
                        <option>2 minutes</option>
                        <option>3 minutes</option>
                        <option>4 minutes</option>
                        <option>5 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3 row" style={{ justifyContent: "center" }}>
                <div className="col-md-4" style={{ paddingLeft: "125px" }}>
                  <Button
                    disabled={validationQuery?.status_code != 200}
                    type="submit"
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
