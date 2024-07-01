import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { json, useLocation, useNavigate, usehistory } from 'react-router-dom';
import './PreviewPage.css'
import PreviewHighchart from '../PreviewHighchart/PreviewHighchart';
import PreviewReportTable from '../PreviewHighchart/PreviewReportTable';
import Box from '../PreviewHighchart/Box';
import { savereportTemplate } from '../../actions/auth'
import { updateReportdetail } from '../../actions/reportmanagement'
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './../globalCSS/Button/Button';
import Header from '../header'

function PreviewPage() {
  
  // Define initial state for component
  const insitialstateofcomp = {
    report_name: "",
    report_type: "",
    chart_type: "",
    query: "",
    enable_drilldown: "",
    auto_update_interval: "",
    time_period: "",
    start_date: "",
    end_date: "",
    background_colour: "",
    // show_in_dashboard: "",
    chart_react_colour: "",
    font_size_title:"",
    font_size_value:"",
    email: "",
    database_type: "",
    connection_type: "",
    schema: "",
    display_order: 1,
    upload_logo: ""
  }

  // Define state variables
  const [CustomDetail, setCustomDetail] = useState(insitialstateofcomp);
  const [background_colour1, setBackgroundcolor] = useState('#ffffff');
  const [chart_react_colour1, setChartreactcolour] = useState('#000000');
  const [fontSize, setFontSize] = useState({font_size_title:'',font_size_value:''})
  console.log(fontSize,"fontSize")
  const [storedetailtoback, setStoredetailtoback] = useState();
  const dispatch = useDispatch();

  const history = useNavigate(); // useNavigate instead of useHistory
  const apiData = useSelector((state) => state); // Redux state
  const reportdetail = apiData?.auth.box_color_data; // Report detail from Redux store
  const user = JSON.parse(localStorage.getItem('profile')); // User data from localStorage
  const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport')); // Custom detail from localStorage
  const selectedShemasection = JSON.parse(localStorage.getItem('SelectedSchema')); // Selected schema from localStorage
  console.log(CustomeDetailOfReport,"CustomeDetailOfReport")
  
  // Effect to initialize state based on custom detail
  
  useEffect(() => {
    let newstateofcomp;
    const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'))
    const reportdetail = apiData?.auth?.box_color_data;
    if (CustomeDetailOfReport != null) {
      newstateofcomp = {
        report_template_name: CustomeDetailOfReport?.title,
        report_type: CustomeDetailOfReport?.type,
        chart_type: CustomeDetailOfReport?.chart_type,
        defined_query: CustomeDetailOfReport?.query,
        enable_drilldown: CustomeDetailOfReport?.enable_drildown,
        auto_update_interval: 2,
        time_period: CustomeDetailOfReport?.time_period,
        start_date: CustomeDetailOfReport?.start_date,
        end_date: CustomeDetailOfReport?.end_date,
        email: user.user_email_id,
        database_type: "mysql",
        connection_type: CustomeDetailOfReport?.connection_type,
        schema: CustomeDetailOfReport?.schema,
        display_order: 1
      }
      if (!CustomeDetailOfReport.report_id && CustomeDetailOfReport.type === "Box") {
        const newObj = { ...newstateofcomp, background_colour: background_colour1, chart_react_colour: chart_react_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value }
        const base64String = localStorage.getItem("uploadLogo");
        let formData = new FormData();
        if (base64String) {
          // Convert base64-encoded string back to a file object
          fetch(base64String)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "logo.png", { type: "image/png" });
              formData.append('file', file);
              formData.append('report_template_name', JSON.stringify(newObj));
              setStoredetailtoback({ ...newstateofcomp, background_colour: background_colour1, chart_react_colour: background_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value, upload_logo: null })
            });
        }
        else {
          // formData.append('file', null);
          formData.append('report_template_name', JSON.stringify(newObj));
          setStoredetailtoback({ ...newstateofcomp, background_colour: background_colour1, chart_react_colour: background_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value, upload_logo: null })
        }
        setCustomDetail(formData);
      } else if (!CustomeDetailOfReport.report_id && CustomeDetailOfReport.type === "Table") {
        let formData = new FormData();
        formData.append('report_template_name', JSON.stringify(newstateofcomp));
        setStoredetailtoback(newstateofcomp)
        setCustomDetail(formData);
      } else if (!CustomeDetailOfReport.report_id && CustomeDetailOfReport.type === "Chart") {
        let formData = new FormData();
        formData.append('report_template_name', JSON.stringify(newstateofcomp));
        setStoredetailtoback(newstateofcomp)
        setCustomDetail(formData);
      }

      else if (CustomeDetailOfReport.report_id && CustomeDetailOfReport.type === "Box") {
        let localnewObj = { ...newstateofcomp, report_id: CustomeDetailOfReport.report_id, background_colour: CustomeDetailOfReport?.background_colour, chart_react_colour: CustomeDetailOfReport?.chart_react_colour,font_size_title:CustomeDetailOfReport.font_size_title,font_size_value:CustomeDetailOfReport.font_size_value }
        const base64String = localStorage.getItem("uploadLogo");
        let formData = new FormData();
        if (base64String) {
          fetch(base64String)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "logo.png", { type: "image/png" });

              formData.append('file', file);
              formData.append('details', JSON.stringify(localnewObj));
              setStoredetailtoback({ ...newstateofcomp, report_id: CustomeDetailOfReport.report_id, background_colour: background_colour1, chart_react_colour: background_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value, upload_logo: CustomeDetailOfReport?.upload_logo })
              setCustomDetail(formData);
            });
        } else {
          // formData.append('file', null);
          localnewObj = { ...newstateofcomp, report_id: CustomeDetailOfReport.report_id, background_colour: CustomeDetailOfReport?.background_colour, chart_react_colour: CustomeDetailOfReport?.chart_react_colour, upload_logo: CustomeDetailOfReport?.upload_logo,font_size_title:CustomeDetailOfReport.font_size_title,font_size_value:CustomeDetailOfReport.font_size_value }
          formData.append('details', JSON.stringify(localnewObj));
          setStoredetailtoback({ ...newstateofcomp, report_id: CustomeDetailOfReport.report_id, background_colour: background_colour1, chart_react_colour: background_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value, upload_logo: CustomeDetailOfReport?.upload_logo })
          setCustomDetail(formData);
        }
        
        // setStoredetailtoback(localnewObj)
      } else if (CustomeDetailOfReport.report_id && CustomeDetailOfReport.type === "Table") {
        const newObj = { ...newstateofcomp, report_id: CustomeDetailOfReport.report_id }
        let formData = new FormData();
        formData.append('details', JSON.stringify(newObj));
        setCustomDetail(formData);
        setStoredetailtoback(newObj)
      } else if (CustomeDetailOfReport.report_id && CustomeDetailOfReport.type === "Chart") {
        const newObj = { ...newstateofcomp, report_id: CustomeDetailOfReport.report_id }
        let formData = new FormData();
        formData.append('details', JSON.stringify(newObj));
        setCustomDetail(formData);
        setStoredetailtoback(newObj)
      }
    }
  }, [])
  
   // Effect to update state based on background and chart colors
  useEffect(() => {
    let newstateofcomp;
    const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'))
    const reportdetail = apiData?.auth?.box_color_data;
    if (CustomeDetailOfReport != null) {
      newstateofcomp = {
        report_template_name: CustomeDetailOfReport?.title,
        report_type: CustomeDetailOfReport?.type,
        chart_type: CustomeDetailOfReport?.chart_type,
        defined_query: CustomeDetailOfReport?.query,
        enable_drilldown: CustomeDetailOfReport?.enable_drildown,
        auto_update_interval: 2,
        time_period: CustomeDetailOfReport?.time_period,
        start_date: CustomeDetailOfReport?.start_date,
        end_date: CustomeDetailOfReport?.end_date,
        email: user.user_email_id,
        database_type: "mysql",
        connection_type: CustomeDetailOfReport?.connection_type,
        schema: CustomeDetailOfReport?.schema,
        display_order: 1
      }
      if (!CustomeDetailOfReport.report_id && CustomeDetailOfReport.type === "Box") {
        const newObj = { ...newstateofcomp, background_colour: background_colour1, chart_react_colour: chart_react_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value }
        const base64String = localStorage.getItem("uploadLogo");
        let formData = new FormData();
        if (base64String) {
          // Convert base64-encoded string back to a file object
          fetch(base64String)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "logo.png", { type: "image/png" });
              formData.append('file', file);
              formData.append('report_template_name', JSON.stringify(newObj));
              setStoredetailtoback({ ...newstateofcomp, background_colour: background_colour1, chart_react_colour: chart_react_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value, upload_logo: file })
            });
        }
        else {
          // formData.append('file', null);
          formData.append('report_template_name', JSON.stringify(newObj));
          setStoredetailtoback({ ...newstateofcomp, background_colour: background_colour1, chart_react_colour: chart_react_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value, upload_logo: null })
        }
        setCustomDetail(formData);
      }
      else if (CustomeDetailOfReport.report_id && CustomeDetailOfReport.type === "Box") {
        console.log("CustomeDetailOfReport**")
        const base64String = localStorage.getItem("uploadLogo");
        const newobj = { ...newstateofcomp, report_id: CustomeDetailOfReport.report_id, background_colour: background_colour1, chart_react_colour: chart_react_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value }
        console.log(newobj,"newobj")
        let formData = new FormData();
        if (base64String) {
          // Convert base64-encoded string back to a file object
          fetch(base64String)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "logo.png", { type: "image/png" });
              formData.append('file', file);
              formData.append('details', JSON.stringify(newobj));
              setStoredetailtoback({ ...newstateofcomp, report_id: CustomeDetailOfReport.report_id, background_colour: background_colour1, chart_react_colour: chart_react_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value, upload_logo: CustomeDetailOfReport.upload_logo })
              setCustomDetail(formData);
            });
        } else {
          // formData.append('file', null);
          formData.append('details', JSON.stringify(newobj));
          setStoredetailtoback({ ...newstateofcomp, report_id: CustomeDetailOfReport.report_id, background_colour: background_colour1, chart_react_colour: chart_react_colour1,font_size_title:fontSize.font_size_title,font_size_value:fontSize.font_size_value, upload_logo: CustomeDetailOfReport.upload_logo })
          setCustomDetail(formData);
        }
      }
    }
  }, [background_colour1, chart_react_colour1,fontSize])
  
  // Function to save or update chart
  const handelSaveChart = async () => {
    if (!CustomeDetailOfReport.report_id) {
      dispatch(savereportTemplate(CustomDetail, history));
    } else {
      localStorage.removeItem("uploadLogo");
      dispatch(updateReportdetail(CustomDetail, history));
    }
  };

  // Function to handle back button
  const handelbackbuttonchange = async () => {
    localStorage.setItem("backcustomeDetailOfReport", JSON.stringify(storedetailtoback));
    history('/DataFromBackPage')
  }
   
  return (
    <div>
      <div className='Header'>
        <Header />
      </div>
      <div className='preview_page_container'>
        <div className='High_chart_type'>
          <div className='previchartcnt'>
            {CustomeDetailOfReport?.type === 'Table' ? <PreviewReportTable /> :
              CustomeDetailOfReport?.type === 'Box' ? <Box CustomDetail={CustomDetail} setCustomDetail={setCustomDetail} setBackgroundcolor={setBackgroundcolor} setChartreactcolour={setChartreactcolour} fontSize={fontSize} setFontSize={setFontSize} /> :
                CustomeDetailOfReport?.type === 'Chart' ? <PreviewHighchart /> : null}
          </div>
        </div>
        <div className='Preview_button_cnt'>
          <Button type='button' onClick={handelbackbuttonchange} >Back</Button>
          {/* <button type='button'>Preview</button> */}
          <Button onClick={handelSaveChart}>Save</Button>
        </div>
      </div>
    </div>
  )
}

export default PreviewPage