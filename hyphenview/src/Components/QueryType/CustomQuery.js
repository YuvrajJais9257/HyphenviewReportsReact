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
import imageUrl14 from "../Images/gauge-circle-plus.png";
import imageUrl13 from "../Images/donut-chart.png"
import { useLocation, useNavigate } from 'react-router-dom'
import Header from "../header"
import Popupaddparameter from "./Popupaddparameter";
import PopupremoveDateParameter from "./PopupremoveDateParameter";
import { testquryonCustompage, resettestquryonCustompage, testqueryoncustompageforresponse, resetbacktocustomquerypagewithdata } from "../../actions/auth"
import { Button } from './../globalCSS/Button/Button';
import Form from 'react-bootstrap/Form';
import { getreporttitlefromondashbaord, getlistofcolumnformappingfirst, getlistofcolumnformappingsecond, removelistofcolumnformappingfirst, removelistofcolumnformappingsecond, saveMapDataForDrillDown, checkdrilldown, defaultcheckdrilldown } from '../../actions/reportmanagement';


export default function ReportPage(props) {
  const selectedShemasection = JSON.parse(localStorage.getItem('SelectedSchema'))
  const insitialval = {
    title: "",
    query: "",
    start_date: "",
    end_date: "",
    type: "",
    chart_type: "",
    time_period: "",
    enable_drildown: "",
    update_interval: "",
    upload_logo: "",
    report_id: "",
    connection_type: selectedShemasection?.databasename,
    schema: selectedShemasection?.selectedSchema
  }

  const charts = [
    { id: 'area', value: 'Area Chart', title: 'Area Chart', imageUrl: imageUrl1 },
    { id: 'bar', value: 'Bar Chart', title: 'Bar Chart', imageUrl: imageUrl2 },
    { id: 'column', value: 'Column Chart', title: 'Column Chart', imageUrl: imageUrl3 },
    { id: 'line', value: 'Line Chart', title: 'Line Chart', imageUrl: imageUrl4 },
    { id: 'pie', value: 'Pie Chart', title: 'Pie Chart', imageUrl: imageUrl5 },
    { id: 'stacked_area', value: 'Stacked Area Chart', title: 'Stacked Area Chart', imageUrl: imageUrl6 },
    { id: 'stacked_bar', value: 'Stacked Bar Chart', title: 'Stacked Bar Chart', imageUrl: imageUrl7 },
    { id: 'stacked_column', value: 'Stacked Column Chart', title: 'Stacked Column Chart', imageUrl: imageUrl8 },
    { id: 'gauge', value: 'Gauge Chart', title: 'Gauge Chart', imageUrl: imageUrl9 },
    { id: 'radial_bar', value: 'Radial Bar Chart', title: 'Radial Bar Chart', imageUrl: imageUrl10 },
    { id: '3d pie', value: '3d Pie Chart', title: '3d Pie Chart', imageUrl: imageUrl11 },
    { id: '3d donut', value: '3d Donut Chart', title: '3d Donut Chart', imageUrl: imageUrl13 },
    { id: '3Darea', value: '3d Area Chart', title: '3d Area Chart', imageUrl: imageUrl1 },
    { id: 'speedometer', value: 'speedometer', title: 'Speedometer Gauge', imageUrl: imageUrl14 },

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
  const [formdata, setformdata] = useState(insitialval);
  const [enableDrilldown, setEnableDrilldown] = useState("");
  const [checkuploadlogo, setCheckUploadLogo] = useState("");
  const [popupaddateparameter, setpopupaddateparameter] = useState(false);
  const [popupremoveateparameter, setpopuppopupremoveateparameter] = useState(false);
  const [popupremovedateparameter, setpopupremovedateparameter] = useState();
  const [mappingTab, setMappingTab] = useState(false);
  const [isChartSelected, setIsChartSelected] = useState(false);
  const [isDrilldownSelected, setIsDrilldownSelected] = useState(false);
  const [ischeckstartdate, setischeckstartdate] = useState(true);
  const [ischeckenddate, setischeckenddate] = useState(false);
  const [islogoselected, setIsLogoSelected] = useState(false);
  const [selectReportTitleDrilldown, setSelectReportTitleDrilldown] = useState();
  const [selectColumnForDrill, setSelectColumnForDrill] = useState({ Master_Column: [], DrillDown_Column: [] });
  const [drilldownmessage, setDrillDownMessage] = useState("");
  const [columnCount, setcolumnCount] = useState();


  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useNavigate(props);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParameters = new URLSearchParams(window.location.search);
  const BuildQuery = queryParameters.get('Query');


  useEffect(() => {
    if (BuildQuery) {
      setformdata({ ...formdata, query: BuildQuery });
    }

  }, [BuildQuery])

  const handelSelectReportNamedropfirst = async (e) => {
    e.preventDefault();

    if (selectReportTitleDrilldown != '' && formdata.title != '') {
      dispatch(getlistofcolumnformappingfirst({ customer_id: user?.customer_id, connection_type: selectedShemasection?.databasename, schema: selectedShemasection?.selectedSchema, for_master_report: "yes", query: formdata.query }))
      dispatch(getlistofcolumnformappingsecond({ customer_id: user?.customer_id, connection_type: selectedShemasection?.databasename, schema: selectedShemasection?.selectedSchema, for_master_report: "no", report_title: selectReportTitleDrilldown }))
    } else {
      alert("Any of the field is missing")
      setDrillDownMessage("Any of the field is missing")
    }
  }

  const handelSelectMap = async (e) => {
    e.preventDefault();
    const payloadvalue = {
      "Master_Column": Array.from({ length: columnCount }, (v, i) => columndetailfirst && columndetailfirst[i]),
      "DrillDown_Column": selectColumnForDrill.map((val) => val.DrillDown_Column[0])
    }
    const newobject = { ...payloadvalue, customer_id: user.customer_id, drilldown_report: selectReportTitleDrilldown, master_report: formdata.title }
    if (formdata.type != "Box") {
      dispatch(saveMapDataForDrillDown(newobject))
    } else {
      const payloadvaluedata = {
        "Master_Column": [],
        "DrillDown_Column": []
      }
      const newobject2 = { ...payloadvaluedata, customer_id: user.customer_id, drilldown_report: selectReportTitleDrilldown, master_report: formdata.title }
      dispatch(saveMapDataForDrillDown(newobject2))
    }
  }


  const apiData = useSelector((state) => state);

  const reportdetail = apiData?.reportmanagement?.allReportDetail;
  const columndetailfirst = apiData?.reportmanagement?.getlistofcolumfirst;
  const columndetailsecond = apiData?.reportmanagement?.getlistofcolumsecond;
  const checkquerysupportdrilldown = apiData?.reportmanagement?.checkdrilldown;


  useEffect(() => {
    if (checkquerysupportdrilldown !== 'null') {
      if (checkquerysupportdrilldown?.drilldown === 'yes') {
        setcolumnCount(checkquerysupportdrilldown?.column_mapping)
        setSelectColumnForDrill(
          Array.from({ length: checkquerysupportdrilldown?.column_mapping }, () => ({ Master_Column: [], DrillDown_Column: [] }))
        );

        setMappingTab(true)
      } else if (checkquerysupportdrilldown?.drilldown === 'no') {
        setMappingTab(false)
      }
    } else if (checkquerysupportdrilldown === 'null') {
      setMappingTab(false)
    }
  }, [checkquerysupportdrilldown])

  function handelSelectReportforlist(event) {
    setSelectReportTitleDrilldown(event.target.value)
    setDrillDownMessage('');
  }


  const handleSelectColumnForDrillDownSecond = (index) => (event) => {
    const value = event.target.value;
    setSelectColumnForDrill((prevState) => {
      const updatedColumns = [...prevState];
      const columnIndex = updatedColumns[index].DrillDown_Column.indexOf(value);
      if (columnIndex > -1) {
        updatedColumns[index].DrillDown_Column.splice(columnIndex, 1);
      } else {
        updatedColumns[index].DrillDown_Column.push(value);
      }
      return updatedColumns;
    });

  };


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
        chart_type: ""
      }));
      if (isChartSelected) {
        setIsChartSelected(false);
      }
    }
    if (formdata.type === "Table") {
      setEnableDrilldown("");
      setformdata((prevData) => ({
        ...prevData,
        enable_drildown: ""
      }));
      if (isDrilldownSelected) {
        setIsDrilldownSelected(false);
      }
    }
  }, [formdata.type, isChartSelected, isDrilldownSelected]);

  const handleRadioChange = (event) => {
    const chartTypes = {
      'Bar Chart': 'bar',
      'Column Chart': 'column',
      'Line Chart': 'line',
      'Gauge Chart': 'gauge',
      'Area Chart': 'area',
      'Pie Chart': 'pie',
      'Radial Bar Chart': 'radialBar',
      'Stacked Area Chart': 'stackarea',
      'Stacked Bar Chart': 'stackbar',
      'Stacked Column Chart': 'stackcolumn',
      '3d Pie Chart': '3Dpie',
      '3d Donut Chart': '3D donut',
      '3d Area Chart': '3Darea',
      'speedometer': 'speedometer',
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
    setMappingTab(false)
    e.preventDefault(formdata, "formdata");
    if (formdata.title && formdata.query && formdata.type) {
      localStorage.setItem("customeDetailOfReport", JSON.stringify(formdata));
      history('/hyphenview/PreviewPage');
    } else {
      alert("any field is missing select plz")
    }

  }

  const handelTestQuery = async (e) => {
    e.preventDefault();
    dispatch(testquryonCustompage({ query: formdata.query, schema: selectedShemasection.selectedSchema, email: user.user_email_id, connection_type: selectedShemasection.databasename, database_type: "mysql" }))
  }

  useEffect(() => {
    dispatch(getreporttitlefromondashbaord({ database_type: "mysql", email: user.user_email_id, customer_id: user.customer_id, group_id: user.group_id }))
    dispatch(resettestquryonCustompage());
    dispatch(defaultcheckdrilldown());
    dispatch(removelistofcolumnformappingfirst());
    dispatch(removelistofcolumnformappingsecond())
  }, [])


  const validationQuery = apiData?.auth.test_custom_query;
  console.log(validationQuery, "validationQuery")

  const renderConditionalCharts = () => {
    if (validationQuery?.status_code === 200 && validationQuery?.column_count === 1) {
      const gaugeAndSpeedometerCharts = charts.filter(chart => chart.id === 'gauge' || chart.id === 'speedometer');
      return (
        <div className="form-group radBut" style={{ display: "flex", flexWrap: "wrap", gap: 50, justifyContent: "center" }}>
          {renderCharts(gaugeAndSpeedometerCharts)}  
        </div>
      );
    } else {
      let chartList = charts.filter(chart => chart.id !== 'gauge' && chart.id !== 'speedometer');

      const isPieChartAllowed =
        validationQuery?.status_code === 200 &&
        validationQuery?.column_count === 2 &&
        ["TEXT", "VARCHAR"].includes(validationQuery?.column_type[1]) &&
        ["INT", "FLOAT"].includes(validationQuery?.column_type[2]);
      
        console.log(validationQuery?.column_type[0],validationQuery?.column_type[1],isPieChartAllowed, "********1");
      if (isPieChartAllowed) {
        const pieCharts = charts.filter(chart => chart.id === 'pie' && chart.id === '3d pie' && chart.id === '3d donut');
        chartList = [...chartList, ...pieCharts];
      } else {
        chartList = chartList.filter(chart => chart.id !== 'pie' && chart.id !== '3d pie' && chart.id !== '3d donut');
      }

      return (
        <div className="form-group radBut" style={{ display: "flex", flexWrap: "wrap", gap: 50, justifyContent: "center" }}>
          {renderCharts(chartList)}
        </div>
      );
    }
  };




  function handelChangecharttype() {
    setShow((prev) => !prev);
  }


  const handelChange = (e) => {
    if (e.target.name === "query") {
      dispatch(resettestquryonCustompage());
      dispatch(defaultcheckdrilldown());
      setMappingTab(false)
      setformdata({ ...formdata, [e.target.name]: e.target.value });
    } else if (e.target.name === "title") {
      setformdata({ ...formdata, [e.target.name]: e.target.value });
      setDrillDownMessage('')
    }
    else {
      setformdata({ ...formdata, [e.target.name]: e.target.value });
    }

  }




  const handleReportTypeChange = (event) => {
    setformdata({ ...formdata, type: event.target.value });
    if (event.target.value === "Table") {
      setShowLogoSection(true);
      setMappingTab(false);
    } else if (event.target.value === "Box") {
      setShowLogoSection(true);
    } else {
      setShowLogoSection(false);
    }
  };



  const handleEnableDrilldownChange = (event) => {
    const enableDrilldownValue = event.target.value;
    setEnableDrilldown(enableDrilldownValue);
    if (enableDrilldownValue === "yes") {
      setSelectColumnForDrill({ Master_Column: [], DrillDown_Column: [] })
      dispatch(checkdrilldown({ "query": formdata?.query, "type": formdata.type }))
    } else if (enableDrilldownValue === "no") {
      setMappingTab(false)
    }
    setformdata((prevData) => ({
      ...prevData,
      enable_drildown: enableDrilldownValue
    }));
    setIsDrilldownSelected(true);
  };


  const handleUploadLogoChange = (event) => {
    const checklogouploaded = event.target.value
    if (checklogouploaded === "yes") {
      setCheckUploadLogo(checklogouploaded);
      setIsLogoSelected(true);
    } else {
      localStorage.removeItem("uploadLogo")
      setCheckUploadLogo(checklogouploaded);
      setIsLogoSelected(true);
    }
  }



  const handleFileChange = (e) => {
    const file = e.target.files[0];

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

  const handelclickgotoDashboard = () => {
    history('/hyphenview/Dashboard')
  }

  return (
    <div style={{ overflow: "clip" }}>
      {popupaddateparameter && <Popupaddparameter formdata={formdata} setformdata={setformdata} setpopupaddateparameter={setpopupaddateparameter} setischeckstartdate={setischeckstartdate} setischeckenddate={setischeckenddate} />}
      {popupremoveateparameter && <PopupremoveDateParameter formdata={formdata} setformdata={setformdata} setpopuppopupremoveateparameter={setpopuppopupremoveateparameter} />}
      <div><Header /></div>
      <div className="Custom_container">
        <div className="Custom_header_container">
          <span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
          <span>/</span>
          <span>Create New Report</span>
        </div>
        <div className="customformpage">
          <form className="well form-horizontal" id="report_management" onSubmit={handelSubmit}>
            <fieldset>
              <div class="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">Title</label>
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
                <label className="col-md-4 control-label testalinritemval">Query</label>
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
                  onClick={() => { setpopupremovedateparameter(); setpopupaddateparameter(true) }}
                >
                  Add Date Parameter
                </Button>

                <Button
                  type="button"
                  disabled={!(validationQuery?.status_code === 200 && formdata.start_date !== '' && formdata.end_date !== '')}

                  onClick={() => { setpopupremovedateparameter(); setpopuppopupremoveateparameter(true) }}
                >
                  Remove Date Parameter
                </Button>

                <Button
                  type="button"
                  onClick={handelTestQuery}
                >
                  Test Query
                </Button>

              </div>
              {/* </div> */}
              <div style={{ textAlign: "center" }}>
                {validationQuery && validationQuery?.detail === 'Valid Query' ? (<p><i style={{ backgroundColor: "green", fontSize: "18px", width: "25px", height: "15px", borderRadius: "50%" }} class="fa-solid fa-check"></i>{validationQuery?.detail}</p>) : validationQuery?.status_code === 400 ? (validationQuery && <p><i style={{ backgroundColor: "red", fontSize: "18px", width: "25px", height: "15px", borderRadius: "50%" }} class="fa-solid fa-smark"></i><span>{validationQuery?.detail}</span></p>) : (validationQuery && <p><i style={{ backgroundColor: "yellow", fontSize: "18px", width: "25px", height: "15px", borderRadius: "50%" }} class="fa-solid fa-smark"></i>{validationQuery?.detail}</p>)}
              </div>
              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">Start Date</label>
                <div className="col-md-5 inputGroupContainer">
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping"><i class="fas fa-calendar"></i></span>
                    <input type="date" name="start_date" class="form-control" disabled={ischeckstartdate} placeholder="Start Date" aria-label="Username" aria-describedby="addon-wrapping" value={formdata.start_date} onChange={handelChange} />
                  </div>

                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">End Date</label>
                <div className="col-md-5 inputGroupContainer">
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping"><i class="fas fa-calendar"></i></span>
                    <input type="date" name="end_date" class="form-control" disabled={ischeckstartdate} placeholder="end_date" aria-label="Username" aria-describedby="addon-wrapping" value={formdata.end_date} onChange={handelChange} />
                  </div>
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">Type</label>
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
                      {validationQuery?.status_code === 200 && validationQuery?.column_count > 1 && (<>
                        <option>Table</option>
                        <option>Chart</option></>
                      )}
                      {validationQuery?.status_code === 200 && validationQuery?.column_count === 1 && (<>
                        <option>Box</option>
                        <option>Chart</option></>
                      )}
                    </select>
                  </div>

                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">Chart Type</label>
                <div className="col-md-5 selectContainer">
                  <div className="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping">
                      <i class="fas fa-chart-bar"></i>
                    </span>
                    <div>
                      <textarea
                        name="chart_type"
                        value={formdata.chart_type}
                        className="form-control"
                        onClick={handelChangecharttype}
                        placeholder="Chart Type"
                        required={formdata.type !== 'Table' && formdata.type !== 'Box'}
                        disabled={validationQuery?.status_code !== 200 || formdata.type !== 'Chart'}
                        style={{
                          height: "34px", resize: true, width: "445px",
                          borderTopLeftRadius: "0",
                          borderBottomLeftRadius: "0"
                        }}
                      ></textarea>
                      {show && <div> {renderConditionalCharts()}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {(formdata.type === 'Chart' || formdata.type === 'Box') && (<div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">Enable Drilldown</label>
                <div className="radio col-md-2">
                  <label className="radio-inline">
                    <input
                      type="radio"
                      name="enableDrilldown"
                      value="yes"
                      onChange={handleEnableDrilldownChange}
                      checked={enableDrilldown === "yes" || formdata.enable_drildown === "yes"}
                      disabled={!(formdata.type === "Box" || formdata.query.toLowerCase().includes("group by"))}
                    />{" "}
                    Yes
                  </label>
                  <label className="radio-inline">
                    <input
                      type="radio"
                      name="enableDrilldown"
                      value="no"
                      onChange={handleEnableDrilldownChange}
                      checked={enableDrilldown === "no" || formdata.enable_drildown === "no"}
                      disabled={!(formdata.type === "Box" || formdata.query.toLowerCase().includes("group by"))}
                    />{" "}
                    No
                  </label>
                </div>
              </div>)}

              {mappingTab && (
                <div className="custome-mapping-container">
                  <div className='sampledrilldownquery-sub-cnt'>
                    {drilldownmessage != null ? <p>{drilldownmessage}</p> : null}
                    <div className='sampledrilldownquery-well form-horizon'>
                      <div className='custome-container-column'>
                        <Form.Group style={{ width: "48%" }} controlId="formBasicEmail">
                          <Form.Control type="text" value={formdata.title} disabled required placeholder="Report Name" />
                        </Form.Group>
                        <Form.Select style={{ width: "48%" }} aria-label="Default select example" value={selectReportTitleDrilldown} required onChange={handelSelectReportforlist}>
                          <option>Select report name</option>
                          {reportdetail && reportdetail?.map((report, index) => (
                            <option key={index} value={report.report_name}>
                              {report.report_name}
                            </option>
                          ))}
                        </Form.Select>
                        <div>
                          <Button style={{ margin: "5px" }} onClick={handelSelectReportNamedropfirst}>Tag</Button>
                        </div>
                      </div>
                      {formdata.type != "Box" && Array.from({ length: columnCount }, (v, i) => (
                        <div className="custome-container-column" key={i}>
                          <Form.Group style={{ width: "48%" }} controlId="formBasicEmail">
                            <Form.Control type="text" value={columndetailfirst && columndetailfirst[i]} disabled required placeholder="Select Master Column" />
                          </Form.Group>
                          <Form.Select style={{ width: "48%" }} aria-label="Default select example" value={selectColumnForDrill[i]?.DrillDown_Column} onChange={handleSelectColumnForDrillDownSecond(i)}>
                            <option>Select DrillDown Column</option>
                            {columndetailsecond && columndetailsecond?.map((column, index) => (
                              <option key={index} value={column}>
                                {column}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      ))}
                      <div>
                        <Button style={{ margin: "5px" }} onClick={handelSelectMap}>Map</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {showLogoSection && (formdata.type === "Box") && (
                <div className="mb-3 row">
                  <label className="col-md-4 control-label testalinritemval">Upload logo</label>
                  <div className="radio col-md-2">
                    <label className="radio-inline">
                      <input type="radio" checked={checkuploadlogo === "yes"} name="hosting3" value="yes" onChange={handleUploadLogoChange} /> Yes
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="hosting3" checked={checkuploadlogo === "no"} value="no" onChange={handleUploadLogoChange} /> No
                    </label>
                    {(checkuploadlogo === "yes") && (<label style={{ margin: "20px 20px 20px 40px" }}>
                      <input name="file" onChange={handleFileChange} type="file" accept="image/png" />
                    </label>)}
                  </div>

                </div>
              )}

              {formdata.type === ("Chart" || "Box") && (
                <div className="mb-3 row">
                  <label className="col-md-4 control-label testalinritemval">Auto Update Interval</label>
                  <div className="col-md-5 selectContainer">
                    <div className="input-group flex-nowrap">
                      <span class="input-group-text" id="addon-wrapping">
                        <i class="fas fa-hourglass-half"></i>
                      </span>

                      <select name="update_interval" className="form-control selectpicker" disabled={validationQuery?.status_code != 200} value={formdata.update_interval} onChange={handelChange}>
                        <option name="" disabled selected hidden >
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
                <div className="col-md-4" style={{ paddingLeft: "125px" }} >
                  <Button
                    disabled={validationQuery?.status_code != 200}
                    type="submit">
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
