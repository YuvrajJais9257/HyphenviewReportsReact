import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ReportPage.css";
import imageUrl1 from "../Images/area.png";
import imageUrl2 from "../Images/bar.png";
import imageUrl3 from "../Images/column.png";
import imageUrl4 from "../Images/line.png";
import imageUrl5 from "../Images/pie.png";
import imageUrl6 from "../Images/stacked-area.png";
import imageUrl7 from "../Images/stacked-bar.png";
import imageUrl8 from "../Images/stacked-column.png";
import imageUrl9 from "../Images/gauge.png";
import imageUrl14 from "../Images/gauge-circle-plus.png";
import imageUrl10 from "../Images/radial-bar.png";
import imageUrl11 from "../Images/pie-chart.png";
import imageUrl12 from "../Images/google-maps.png";
import imageUrl13 from "../Images/donut-chart.png"
import { useLocation, useNavigate } from 'react-router-dom'
import Header from "../header"
import Popupaddparameter from "./Popupaddparameter";
import PopupremoveDateParameter from "./PopupremoveDateParameter";
import { testquryonCustompage, resettestquryonCustompage, resetbacktocustomquerypagewithdata } from "../../actions/auth"
import { Button } from './../globalCSS/Button/Button';
import Form from 'react-bootstrap/Form';
import { getreporttitlefromondashbaord, getlistofcolumnformappingfirst, getlistofcolumnformappingsecond, removelistofcolumnformappingfirst, removelistofcolumnformappingsecond,saveMapDataForDrillDown } from '../../actions/reportmanagement';
 
export default function ReportPage(props) {
 
  const insitialval = {
    title: "",
    query: "",
    start_date: "",
    end_date: "",
    type: "",
    chart_type: "",
    time_period: "",
    // show_dashboard: "",
    background_colour:"",
    chart_react_colour : "",
    enable_drildown: "",
    update_interval: "",
    report_id: "",
    connection_type:"",
    upload_logo:"",
    schema: ""
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
  const [reportType, setReportType] = useState("");
  const [formdata, setformdata] = useState(insitialval);
  const [chartType, setchartType] = useState('');
  const [checkuploadlogo, setCheckUploadLogo] = useState("");
  // const [showInDashboard, setShowInDashboard] = useState("");
  const [enableDrilldown, setEnableDrilldown] = useState("");
  const [popupaddateparameter, setpopupaddateparameter] = useState(false);
  const [popupremoveateparameter, setpopuppopupremoveateparameter] = useState(false);
  const [popupremovedateparameter, setpopupremovedateparameter] = useState();
  const [ValidationQuery, setValidationQuery] = useState(null);
  const [mappingTab, setMappingTab] = useState(false);
  const [isChartSelected, setIsChartSelected] = useState(false);
  const [ischeckstartdate, setischeckstartdate] = useState(true);
  const [isDrilldownSelected, setIsDrilldownSelected] = useState(false);
  const [islogoselected,setIsLogoSelected] = useState(false);
  const [selectReportTitleDrilldown, setSelectReportTitleDrilldown] = useState();
  const [selectColumnForDrill, setSelectColumnForDrill] = useState({ Master_Column: "", DrillDown_Column: "" });
 
 
  const user = JSON.parse(localStorage.getItem('profile'));
  const selectedShemasection = JSON.parse(localStorage.getItem('SelectedSchema'))
  const datacomefromprviewpage = JSON.parse(localStorage.getItem('backcustomeDetailOfReport'))
  console.log(datacomefromprviewpage, "datacomefromprviewpage");
  const history = useNavigate(props);
  const dispatch = useDispatch();
  const location = useLocation();
  const handelSelectReportNamedropfirst = async (e) => {
    e.preventDefault();
    if (selectReportTitleDrilldown != null) {
      dispatch(getlistofcolumnformappingfirst({ customer_id: user?.customer_id, connection_type: selectedShemasection?.databasename, schema: selectedShemasection?.selectedSchema, for_master_report: "yes", query: formdata.query }))
      dispatch(getlistofcolumnformappingsecond({ customer_id: user?.customer_id, connection_type: selectedShemasection?.databasename, schema: selectedShemasection?.selectedSchema, for_master_report: "no", report_title: selectReportTitleDrilldown }))
    }
  }

  const handelSelectMap = async (e) => {
    e.preventDefault();
    if(selectColumnForDrill.Master_Column && selectColumnForDrill.DrillDown_Column){
    const newobject = {...selectColumnForDrill,customer_id:user.customer_id,drilldown_report:selectReportTitleDrilldown,master_report:formdata.title}
    console.log(newobject,"newobject")
    dispatch(saveMapDataForDrillDown(newobject))
    }else{
      alert("any field is missing")
    }
    
  }

  const apiData = useSelector((state) => state);

  const reportdetail = apiData?.reportmanagement?.allReportDetail;
  const columndetailfirst = apiData?.reportmanagement?.getlistofcolumfirst;
  const columndetailsecond = apiData?.reportmanagement?.getlistofcolumsecond;


  function handelSelectReportforlist(event) {
    setSelectReportTitleDrilldown(event.target.value)
  }

  function handleSelectColumnForDrillDownFirst(event) {
    setSelectColumnForDrill({ ...selectColumnForDrill, Master_Column: event.target.value });
  }

  function handleSelectColumnForDrillDownSecond(event) {
    setSelectColumnForDrill({ ...selectColumnForDrill, DrillDown_Column: event.target.value });
  }
  // const datacomefromprviewpage = apiData?.auth.datawithbackbutton;
 
 
  useEffect(() => {
   
    const datacomefromprviewpage = JSON.parse(localStorage.getItem('backcustomeDetailOfReport'))
   
    if (datacomefromprviewpage && datacomefromprviewpage.report_type==="Chart") {
      setformdata((prevData) => ({
        ...prevData,
        title: datacomefromprviewpage?.report_template_name,
        query: datacomefromprviewpage?.defined_query,
        start_date: datacomefromprviewpage?.start_date,
        end_date: datacomefromprviewpage?.end_date,
        type: datacomefromprviewpage?.report_type,
        chart_type: datacomefromprviewpage?.chart_type,
        time_period: datacomefromprviewpage?.time_period,
        // show_dashboard: datacomefromprviewpage?.show_in_dashboard,
        enable_drildown: datacomefromprviewpage?.enable_drilldown,
        update_interval: datacomefromprviewpage?.auto_update_interval,
        connection_type : datacomefromprviewpage?.connection_type,
        report_id : datacomefromprviewpage?.report_id,
        schema : datacomefromprviewpage?.schema
      }));
    }else if (datacomefromprviewpage && datacomefromprviewpage.report_type==="Table"){
      setformdata((prevData) => ({
        ...prevData,
        title: datacomefromprviewpage?.report_template_name,
        query: datacomefromprviewpage?.defined_query,
        start_date: datacomefromprviewpage?.start_date,
        end_date: datacomefromprviewpage?.end_date,
        type: datacomefromprviewpage?.report_type,
        chart_type: datacomefromprviewpage?.chart_type,
        time_period: datacomefromprviewpage?.time_period,
        // show_dashboard: datacomefromprviewpage?.show_in_dashboard,
        enable_drildown: datacomefromprviewpage?.enable_drilldown,
        update_interval: datacomefromprviewpage?.auto_update_interval,
        connection_type : datacomefromprviewpage?.connection_type,
        report_id : datacomefromprviewpage?.report_id,
        schema : datacomefromprviewpage?.schema
      }));
    }else if(datacomefromprviewpage && datacomefromprviewpage.report_type==="Box"){
      setShowLogoSection(true)
      setIsLogoSelected(true);
      if(datacomefromprviewpage.upload_logo != null){
         setCheckUploadLogo("yes"); 
      }
      setformdata((prevData) => ({
        ...prevData,
        title: datacomefromprviewpage?.report_template_name,
        query: datacomefromprviewpage?.defined_query,
        start_date: datacomefromprviewpage?.start_date,
        end_date: datacomefromprviewpage?.end_date,
        type: datacomefromprviewpage?.report_type,
        chart_type: datacomefromprviewpage?.chart_type,
        time_period: datacomefromprviewpage?.time_period,
        background_colour:datacomefromprviewpage?.background_colour,
        chart_react_colour:datacomefromprviewpage?.chart_react_colour,
        font_size_title:datacomefromprviewpage?.font_size_title,
        font_size_value:datacomefromprviewpage?.font_size_value,   
        // show_dashboard: datacomefromprviewpage?.show_in_dashboard,
        enable_drildown: datacomefromprviewpage?.enable_drilldown,
        update_interval: datacomefromprviewpage?.auto_update_interval,
        report_id : datacomefromprviewpage?.report_id,
        connection_type : datacomefromprviewpage?.connection_type,
        background_colour:datacomefromprviewpage?.background_colour,
        chart_react_colour : datacomefromprviewpage?.chart_react_colour,
        schema : datacomefromprviewpage?.schema,
        upload_logo : datacomefromprviewpage?.upload_logo
      }));
    }
  }, [])
   

  console.log(formdata.start_date,formdata.end_date)
 
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
    console.log(formdata.type,"report_type1")
    if (formdata.type === "Table" || formdata.type === "Box") {
      setformdata((prevData) => ({
        ...prevData,
        chart_type: ""
      }));
      if (isChartSelected) {
        setIsChartSelected(false);
      }
    }
    if (formdata.type === "Table" || formdata.type === "Box") {
      setformdata((prevData) => ({
        ...prevData,
        enable_drildown: ""
      }));
      if (isDrilldownSelected) {
        setEnableDrilldown("");
        setIsDrilldownSelected(false);
      }
    }
  }, [formdata.type, isChartSelected, isDrilldownSelected]);
 
  const handleRadioChange = (event) => {
    const chartTypes = {
      'Bar chart': 'bar',
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

  const handleUploadLogoChange = (event) =>{
    const checklogouploaded = event.target.value
    setCheckUploadLogo(checklogouploaded); 
    
    setIsLogoSelected(true);
  }

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
 
  const handelSubmit = (e) => {
    dispatch(resetbacktocustomquerypagewithdata());
    e.preventDefault();
    if (formdata.title && formdata.query && formdata.type) {
      localStorage.setItem("customeDetailOfReport", JSON.stringify(formdata));
    } else {
      alert("any field is missing select plz")
    }
    console.log(formdata, "formdata")
    history('/hyphenview/PreviewPage');
  }
 
  const handelTestQuery = async (e) => {
    e.preventDefault();
    dispatch(testquryonCustompage({ query: formdata.query, schema: datacomefromprviewpage.schema, email: user.user_email_id, connection_type: datacomefromprviewpage.connection_type ,database_type: "mysql" }))
  }
 
  useEffect(() => {
    dispatch(getreporttitlefromondashbaord({ database_type: "mysql", email: user.user_email_id, customer_id: user.customer_id, group_id: user.group_id }))
    dispatch(resettestquryonCustompage());
  }, [])
 
 
  const validationQuery = apiData?.auth.test_custom_query;

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
    console.log("checktype")
    // setchartType(event.target.value)
    setShow((prev) => !prev);
  }
 
 
 
 
 
 
 
  const handelChange = (e) => {
    if(e.target.name === "query"){
      dispatch(resettestquryonCustompage());
      setformdata({ ...formdata, [e.target.name]: e.target.value });
    }else{
      setformdata({ ...formdata, [e.target.name]: e.target.value });
    }
  }
 
  const handleChangechart = (event) => {
    // setShow((prev) => !prev);
    console.log(event.target.value, "e.target.value")
    // setchartType(event.target.value)
    setformdata({ ...formdata, chart_type: event.target.value });
 
  }
 
 
  const handleReportTypeChange = (event) => {
    console.log(event.target.value, "event.target.value")
    // if(event.target.value === "Table" || event.target.value === "Box"){
      
    // }
    setformdata({ ...formdata, chart_type: "" });
    setformdata({ ...formdata, type: event.target.value });
 
    if (event.target.value === "Table") {
      setShowLogoSection(true);
    } else {
      setShowLogoSection(false);
    }
  };
 
 
  const handleEnableDrilldownChange = (event) => {
    const enableDrilldownValue = event.target.value;
    if (enableDrilldownValue === "yes") {
      setMappingTab(true)
    } else if (enableDrilldownValue === "no") {
      setMappingTab(false)
    }
    setEnableDrilldown(enableDrilldownValue);
    setformdata((prevData) => ({
      ...prevData,
      enable_drildown: enableDrilldownValue
    }));
    setIsDrilldownSelected(true);
  };
 
  const handelclickgotoDashboard = () => {
    history('/hyphenview/Dashboard')
  }
 
  console.log("formdata", formdata)
  return (
    <div style={{overflow: "clip"}}>
      {popupaddateparameter && <Popupaddparameter formdata={formdata} setformdata={setformdata} setpopupaddateparameter={setpopupaddateparameter} setischeckstartdate={setischeckstartdate} />}
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
              {/* <legend>
              <i className="glyphicon glyphicon-home"></i>Database Management
            </legend> */}
 
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
                      type="text"
                      value={formdata.title}
                      maxLength={38}
                      minLength={5}
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
 
              {/* <div className="mb-3 row">
              <label className="col-md-3 control-label"></label> */}
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
              <div style={{textAlign:"center"}}>
                 {validationQuery && validationQuery?.detail === 'Valid Query' ? (<p><i style={{ backgroundColor: "green", fontSize: "18px", width: "25px", height: "15px", borderRadius: "50%" }} class="fa-solid fa-check"></i>{validationQuery?.detail}</p>) : validationQuery?.status_code === 400 ? (validationQuery && <p><i style={{ backgroundColor: "red", fontSize: "18px", width: "25px", height: "15px", borderRadius: "50%" }} class="fa-solid fa-smark"></i><span>{validationQuery?.detail}</span></p>):(validationQuery && <p><i style={{ backgroundColor: "yellow", fontSize: "18px", width: "25px", height: "15px", borderRadius: "50%" }} class="fa-solid fa-smark"></i>{validationQuery?.detail}</p>)}
               </div>
              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">Start Date</label>
                <div className="col-md-5 inputGroupContainer">
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping"><i class="fas fa-calendar"></i></span>
                    <input type="date" name="start_date" class="form-control" disabled={ischeckstartdate} placeholder="Start Date" aria-label="Username" aria-describedby="addon-wrapping" value={formdata.start_date} onChange={handelChange}  />
                  </div>
 
                </div>
              </div>
 
              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">End Date</label>
                <div className="col-md-5 inputGroupContainer">
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text" id="addon-wrapping"><i class="fas fa-calendar"></i></span>
                    <input type="date" name="end_date" class="form-control" disabled={ischeckstartdate} placeholder="end_date" aria-label="Username" aria-describedby="addon-wrapping" value={formdata.end_date} onChange={handelChange}  />
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
                      {validationQuery?.status_code === 200 && validationQuery?.column_count > 1 && (
                        <option>Table</option>
                      )}
                      <option>Chart</option>
                      {validationQuery?.status_code === 200 && validationQuery?.column_count === 1 && (
                        <option>Box</option>
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
                        style={{ height: "34px", resize: true, width: "445px",
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: "0"}}
                      ></textarea>
                       {show && <div> {renderConditionalCharts()}</div>}
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="mb-3 row">
                <label className="col-md-4 control-label testalinritemval">Enable Drilldown</label>
                <div className="radio col-md-2">
                  <label className="radio-inline">
                    <input
                      type="radio"
                      name="enableDrilldown"
                      value="yes"
                      onChange={handleEnableDrilldownChange}
                      checked={enableDrilldown === "yes" || formdata.enable_drildown === "yes"}
                      disabled={!formdata?.query.toLowerCase().includes("group by")}
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
                      disabled={!formdata?.query?.toLowerCase().includes("group by")}
                    />{" "}
                    No
                  </label>
                </div>
              </div>

              {mappingTab && (
                <div className="custome-mapping-container">
                  <div className='sampledrilldownquery-sub-cnt'>
                    <div className='sampledrilldownquery-well form-horizon'>
                      <div className='custome-container-column'>
                        <Form.Select style={{ width: "48%" }} aria-label="Default select example" value={selectReportTitleDrilldown} onChange={handelSelectReportforlist}>
                          <option>Select report name</option>
                          {reportdetail && reportdetail?.map((report, index) => (
                            <option key={index} value={report.report_name}>
                              {report.report_name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Group style={{ width: "48%" }} controlId="formBasicEmail">
                          <Form.Control type="email" value={formdata.title} disabled placeholder="Enter email" />
                        </Form.Group>
                        <div>
                          <Button style={{margin:"5px"}} onClick={handelSelectReportNamedropfirst}>Tag</Button>
                        </div>
                      </div>
                      <div className="custome-container-column">
                        <Form.Select style={{ width: "48%" }} aria-label="Default select example" value={selectColumnForDrill.Master_Column} onChange={handleSelectColumnForDrillDownFirst}>
                          <option>Select Master Column</option>
                          {columndetailfirst && columndetailfirst?.map((column, index) => (
                            <option key={index} value={column}>
                              {column}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Select style={{ width: "48%" }} aria-label="Default select example" value={selectColumnForDrill.DrillDown_Column} onChange={handleSelectColumnForDrillDownSecond}>
                          <option>Select DrillDown Column</option>
                          {columndetailsecond && columndetailsecond?.map((column, index) => (
                            <option key={index} value={column}>
                              {column}
                            </option>
                          ))}
                        </Form.Select>
                        <div>
                          <Button style={{margin:"5px"}} onClick={handelSelectMap}>Map</Button>
                        </div>
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
                    {(checkuploadlogo === "yes") && (<label style={{margin:"20px 20px 20px 40px"}}>
                      <input name="file" onChange={handleFileChange}  type="file" accept="image/png" />
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
 
              <div className="mb-3 row" style={{justifyContent:"center"}}>
                <div className="col-md-4" style={{paddingLeft:"125px"}} >
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
