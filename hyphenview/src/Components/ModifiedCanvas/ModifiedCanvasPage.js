

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ModifiedCanvas.css';
import { useNavigate } from 'react-router-dom';
import HighCharts from '../HighCharts/HighCharts';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button } from './../globalCSS/Button/Button';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { getreporttitlefromondashbaord } from '../../actions/reportmanagement';
import { updatecanvashframedataformodification, canvashframedataformodification,getreportframedatabygroupid } from '../../actions/canvascreation';
import { v4 as uuidv4 } from 'uuid';


import Header from '../header';


// Wrap ResponsiveGridLayout with WidthProvider to automatically determine the width
const ResponsiveGridLayout = WidthProvider(Responsive);


// Auther:- Ashish Kumar
const ModifiedCanvasPage = () => {

  // State variables to manage component state
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [widgetData, setWidgetData] = useState([]);
  const [widgetframeData, setWidgetframeData] = useState([]);
  const [freameId, setFreamId] = useState([])
  const [resultdata, setResultdata] = useState();
  const [search, setSearch] = useState("")
  const [droppedText, setDroppedText] = useState([]);



  // Initialize dispatch and get API data using useSelector
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state);
  const datareport = apiData?.reportmanagement.allReportDetail
  const user = JSON.parse(localStorage.getItem('profile'));

  // Extract query parameters from the URL
  const queryParameters = new URLSearchParams(window.location.search);
  const groupid = queryParameters.get('group_id');
  const dashboardreportname = queryParameters.get('dashboardreportname');
  const groupname = queryParameters.get('groupname');

  // Fetch data on component mount and when groupid changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('profile'));
    dispatch(getreportframedatabygroupid({ customer_id: user.customer_id,group_id: groupid,dashboard_name:dashboardreportname }));
    dispatch(getreporttitlefromondashbaord({ database_type: "mysql", email: user.user_email_id, customer_id: user.customer_id, group_id: user.group_id }));
  }, [groupid]);

  // Memoize frame data to avoid unnecessary re-renders
  const frameChartdata = apiData?.canvascreation.getdashboardframewithid;
  
  useMemo(() => {
    const frames = frameChartdata?.length != 0 && frameChartdata?.frames[0]?.frame || [];
    setWidgetframeData(frames);
    frames.forEach((frame, index) => {
      const { chartType, i } = frame;
      setFreamId((prevIds) => [...prevIds, { chartType, i }]);
    })
  }, [frameChartdata]);



  let history = useNavigate();
 
  // Handle drag start event
  const handleDragStart = (event) => {
    setIsDragging(true);
    event.dataTransfer.setData('text/plain', event.target.id);
  };
  
   // Handle drag end event
  const handleDragEnd = () => {
    setIsDragging(false);
  };


  var results = frameChartdata && frameChartdata.frames && frameChartdata.frames.length > 0 ? frameChartdata.frames[0]?.report_excluded : null;

  useEffect(() => {
    if (frameChartdata && frameChartdata.frames && frameChartdata.frames.length > 0) {
      let newresults = frameChartdata.frames[0]?.report_excluded;
      if (newresults) {
        setResultdata(newresults);
      }
    }
  }, [frameChartdata]);

  const handleDrop = (event, id) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    // const draggedItem = document.getElementById(data);
    const draggedItem = document.getElementById(data);
    const chartType = draggedItem.getAttribute('data-report-name');
    
    const updatedWidgetData = [...widgetData]; 
    const existingItemIndex = updatedWidgetData.findIndex(item => item.i === id);
  
    if (existingItemIndex !== -1) {
      // Check if chartType already exists on the card
      if (updatedWidgetData[existingItemIndex].chartType) {
          alert("This card already has a chart type assigned. No additional charts can be dropped here.");
          return; 
      } else {
          // Update chartType if no chartType was previously assigned
          updatedWidgetData[existingItemIndex].chartType = chartType;
      }
  }else {
      const newItem = {
        id,
        chartType,
        layout: {
          i: uuidv4(), // Generate unique ID
          x: (widgetframeData.length * 4) % 12,
          y: Math.floor(widgetframeData.length / 3) * 4,
          w: 4,
          h: 4,
        },
      };
      updatedWidgetData.push(newItem);
    }
    const updatedatasave = updatedWidgetData.map(item => ({
      chartType: item.chartType,
      i: item.i,
    }));
    // results = results.filter((item)=>item.report_name != chartType)
    setFreamId(updatedatasave)
    setWidgetData(updatedWidgetData);
    setResultdata((currentData) => currentData.filter(item => item.report_name !== chartType));
    const dropchatdata = results.filter(item => item.report_name === chartType);
    setDroppedText(current => [...current, ...dropchatdata]);
    // event.target.appendChild(draggedItem);
    // setDroppedText
  };


  const handleDragOver = (event) => {
    event.preventDefault();
  };


// Filter results based on search query
useEffect(() => {
  if (search) {
    const filteredResults = frameChartdata?.frames[0]?.report_excluded.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
    setResultdata(filteredResults);
  } else {
    setResultdata(frameChartdata && frameChartdata.frames && frameChartdata.frames.length > 0 && frameChartdata?.frames[0]?.report_excluded || []);
  }
}, [search, frameChartdata]);
 


  // Add a new widget to the layout
  const handleAddWidget = () => {
    const newItem = {
      // i: `ContainerWidget${widgetframeData.length+1}`,
      i:uuidv4(),
      x: (widgetframeData.length * 4) % 12,
      y: Math.floor(widgetframeData.length / 3) * 4,
      w: 4,
      h: 4,
      minH: 4,
      maxH: 12,
    };
    setWidgetframeData((prevData) => [...prevData, newItem]);
  };

  
  // Delete the selected widget
  const handleDelete = () => {
    if (selectedItem.chatId !== null) {
      setWidgetData((prevData) => {
        const { [selectedItem.chatId]: deletedItem, ...rest } = prevData;
        return rest;
      });

      const updatedLayout = widgetframeData.filter((item) => item.i !== selectedItem.chatId);
      const updatedidfrom = freameId.filter((item) => item.i !== selectedItem.chatId)
      setFreamId(updatedidfrom)
      setWidgetframeData(updatedLayout);
      const finditem = droppedText.filter((item)=>item.report_name === selectedItem.chartName)
      setResultdata(current => [...current, ...finditem]);
      setDroppedText((currentData) => currentData.filter(item => item.report_name !== selectedItem.chartName));
    }
  };


  // Save the current layout to local storage and dispatch an update action
  const handleSaveAddWidget = () => {
    const framelayout = JSON.stringify(widgetData);
    localStorage.setItem('finalfream', framelayout);
    // setWidgetframeData([])
    const responjson = {
      dashboard_json_frame_data: widgetData,
      customer_id: user.customer_id,
      dashboard_report_name: dashboardreportname
    }
    try {
      const userConfirmed = window.confirm("Are you sure you want to Save the Updated Report?");
      if (userConfirmed) {
        dispatch(updatecanvashframedataformodification(responjson, history));
        localStorage.setItem('finalfream', framelayout);
      } else {
        console.log("User canceled the operation.");
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  // Handle double-click event to select or deselect a widget
  const handleDoubleClick = (item) => {
    if (item.i === selectedItem?.chatId) {
      setSelectedItem({"chatId":null,"chartName":null});
    } else {
      setSelectedItem({"chatId":item.i,"chartName":item.chartType});
    }
  };

  // Redirect to the preview page and clear the layout
  const redurectPreviewPage = () => {
    setWidgetframeData([])
    history('hyphenview/Preview');
  };

  // Update state with the new layout when it changes
  const onLayoutChange = (newLayout) => {
    const updatedLayout = newLayout.map((fream) => {
      const matchingId = freameId.find((item) => item.i === fream.i);
      if (matchingId) {
        return { ...fream, chartType: matchingId.chartType };
      }
      return fream;
    });
    setWidgetData(updatedLayout);
    setWidgetframeData(updatedLayout)
  }


  return (
    <div className="modified_page">
      <div className="header_styling">
        <Header />
      </div>
      <div className="modified_container">
        <div className="modified_side_bar">
          <div class="form-group modified_has-search modified_report_search">
            <span className="fa fa-search form-control-feedback"></span>
            {/* <input type="text" className="form-control" placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} /> */}
            <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="modified_sidebar-content" style={{ maxHeight: 'calc(80vh - 20px)', overflowY: 'auto' }}>
            {resultdata &&
              resultdata.map((element, index) => (
                <div
                  className="modified_chart_type"
                  id={`chart_type_${index}`}
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  key={index}
                  data-report-name={element.report_name}
                  style={{ border: isDragging ? '1px solid black' : '' }}
                >
                  {element.report_name}
                  <p style={{margin:"1px",fontSize:"9px"}}>
                   {element.report_type === 'Chart' ? `${element.report_type}(${element.chart_type})` : element.report_type}
                 </p>

                </div>
              ))}
          </div>
        </div>
        <div className="modified_toggling_part">
          <ResponsiveGridLayout
            className="layout"
            style={{height:"100vh",overflowY:"scroll"}}
            isResizable={true}
            isDraggable={true}
            layouts={{ lg: widgetframeData }}
            breakpoints={{ lg: 1263, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onLayoutChange={onLayoutChange}
            width={1263}
          >
            {widgetframeData &&
              widgetframeData.map((item, index) => (

                <div
                  key={item.i}
                  onDrop={(event) => handleDrop(event, item.i)}
                  onDragOver={handleDragOver}
                  style={{
                    border: selectedItem?.chatId === item.i ? '3px solid black' : '1px solid black',
                    cursor: 'pointer',
                    color: selectedItem?.chatId === item.i ? 'lightblue' : '',
                    overflow: 'hidden',
                    borderRadius: '5px',
                    width: `${item.w * 100}%`,
                    height: `${item.h * 30}px`,
                  }}
                  onClick={() => handleDoubleClick(item)}
                >
                  {item.chartType ? (
                    <HighCharts width={`${item.w * 100}%`} height={`${item.h * 38}px`} charttype={item.chartType} />
                  ) : null}
                </div>
              ))}
          </ResponsiveGridLayout>
        </div>
        <div className="modified_right_part_of_container">
          <Button onClick={handleAddWidget}>
            Add Div
          </Button>
          <Button onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleSaveAddWidget}>
            Save
          </Button>
          <Button onClick={redurectPreviewPage}>
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModifiedCanvasPage;



