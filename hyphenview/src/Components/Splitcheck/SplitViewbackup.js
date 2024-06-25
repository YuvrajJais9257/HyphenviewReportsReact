import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Splitcheck.css';
import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button } from './../globalCSS/Button/Button';
import { getreporttitlefromondashbaord } from '../../actions/reportmanagement';
import { savecanvasframedata } from '../../actions/canvascreation';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { v4 as uuidv4 } from 'uuid';
import { listofgroup } from "../../actions/newgroup";
import Header from '../header';
import {checkdashboardcanvasname} from "../../actions/canvascreation"

const ResponsiveGridLayout = WidthProvider(Responsive);

const SplitView = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const [widgetData, setWidgetData] = useState([]);
  const [freameId, setFreamId] = useState([])
  const [search, setSearch] = useState("")
  const [resultdata, setResultdata] = useState();
  const dispatch = useDispatch();
  const [droppedText, setDroppedText] = useState([]);
  const [showCanvasOptions, setShowCanvasOptions] = useState(false);
  const [selectedUserGroup, setSelectedUserGroup] = useState(null);
  const [dashboardNameInput, setDashboardNameInput] = useState();
  const [dashboardDescriptionInput, setDashboardDescriptionInput] =useState("");
 

 
  const handleUserGroupChange = (event) => {
    console.log(event.target.value)
    setSelectedUserGroup(event.target.value);
    dispatch(getreporttitlefromondashbaord({ database_type: "mysql", email: user.user_email_id, customer_id: user.customer_id, group_id: event.target.value }));
  };
  
 
  console.log(resultdata, "ResultData");
 
  const handleDashboardNameChange = (e) => {
    console.log(e.target.value, "specified name");
    setDashboardNameInput(e.target.value);
  };
  const handleVerifyClick = () => {
    dispatch(checkdashboardcanvasname({dashboard_report_name:dashboardNameInput,customer_id:user.customer_id}))
  };

  const apiData = useSelector((state) => state);
  const chartTytel = apiData?.reportmanagement.allReportDetail;
  console.log(resultdata,droppedText, "chartTytel")

  const listofallgroup = apiData?.newgroup.list_of_group;

  const checkframename = apiData?.canvascreation.checkdashboardcanvasframe

  console.log(checkframename,"checkframename")

  useEffect(()=>{
    if(checkframename && checkframename.verify===1){
      setShowCanvasOptions(false);
    }else if(checkframename && checkframename.verify===0){
      setShowCanvasOptions(true);
    }
  },[checkframename])


  let results = chartTytel;
  useEffect(()=>{
    if(results){
      setResultdata(results)
    }
    
  },[results])

  console.log(results, 'results')
  // if (search) {
  //   results = chartTytel?.filter(item => {
  //     let found = false;
  //     Object.values(item).forEach(value => {
  //       if (String(value).toLowerCase().includes(search.toLowerCase())) {
  //         found = true;
  //       }
  //     });
  //     return found;
  //   });
  // }

  useEffect(() => {
    if (search) {
        const filteredResults = chartTytel.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(search.toLowerCase())
            )
        );
        setResultdata(filteredResults);
    } else {
        setResultdata(chartTytel || []);
    }
}, [search, chartTytel]);

  const user = JSON.parse(localStorage.getItem('profile'));
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const shemaDetail = JSON.parse(localStorage.getItem('SelectedSchema'));
    console.log(shemaDetail, "shemaDetail")
    dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }));
  }, []);

  let history = useNavigate();

  const handleDragStart = (event) => {
    console.log(event.target.id, "event")
    setIsDragging(true);
    event.dataTransfer.setData('text/plain', event.target.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  console.log(widgetData, "widgetData")


  const handleDrop = (event, id) => {
    console.log(id)
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    // const draggedItem = document.getElementById(data);
    // console.log(data,"draggedItem")
    const draggedItem = document.getElementById(data);
    const chartType = draggedItem.getAttribute('data-report-name');


    // const chartType = draggedItem?.textContent;  
    console.log(chartType, draggedItem, "chartType")
    const updatedWidgetData = [...widgetData];
    const existingItemIndex = updatedWidgetData.findIndex(item => item.i === id);

    // if (existingItemIndex !== -1) {

    //   updatedWidgetData[existingItemIndex].chartType = chartType;
    // } 

    if (existingItemIndex !== -1) {
      // Check if chartType already exists on the card
      if (updatedWidgetData[existingItemIndex].chartType) {
        alert("This card already has a chart type assigned. No additional charts can be dropped here.");
        return;
      } else {
        // Update chartType if no chartType was previously assigned
        updatedWidgetData[existingItemIndex].chartType = chartType;
      }
    } else {

      const newItem = {
        id,
        chartType,
        layout: {
          i: uuidv4(),
          x: (layouts.lg.length * 4) % 12,
          y: Math.floor(layouts.lg.length / 3) * 4,
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
    setFreamId(updatedatasave)
    console.log(updatedWidgetData)
    setWidgetData(updatedWidgetData);
    event.target.appendChild(draggedItem);
    // setResultdata((currentData) => currentData.filter(item => item.report_name !== chartType));
    const dropchatdata = results.filter(item => item.report_name === chartType);
    setDroppedText(current => [...current, ...dropchatdata]);
  };

  console.log("freameId", freameId)


  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleAddWidget = () => {
    const newItem = {
      // i: `ContainerWidget${layouts.lg.length}`,
      i: uuidv4(),
      x: (layouts.lg.length * 4) % 12,
      y: Math.floor(layouts.lg.length / 3) * 4,
      w: 4,
      h: 4,
      minH: 4,
      maxH: 12,
    };

    setLayouts({ ...layouts, lg: [...layouts.lg, newItem] });
  };

  const handleDelete = () => {
    if (selectedItem.chatId !== null) {
      setWidgetData((prevData) => {
        const { [selectedItem.chatId]: deletedItem, ...rest } = prevData;
        return rest;
      });

      const updatedLayout = layouts.lg.filter((item) => item.i !== selectedItem.chatId);
      setLayouts({ ...layouts, lg: updatedLayout });
      const finditem = droppedText.filter((item)=>item.report_name === selectedItem.chartName)
      setResultdata(current => [...current, ...finditem]);
      setDroppedText((currentData) => currentData.filter(item => item.report_name !== selectedItem.chartName));
      setSelectedItem(null);
    }
  };
  
  const onLayoutChange = (newLayout) => {
    console.log(newLayout, "newLayout**")
    const updatedLayout = newLayout.map((fream) => {
      const matchingId = freameId.find((item) => item.i === fream.i);
      if (matchingId) {
        return { ...fream, chartType: matchingId.chartType };
      }
      return fream;
    });

    console.log(updatedLayout, "updatedLayout")
    setWidgetData(updatedLayout);
    setLayouts({ ...layouts, lg: updatedLayout });
  };

  console.log(results, widgetData, "layouts")



  const handleSaveAddWidget = async () => {
    const framelayout = JSON.stringify(widgetData);
    console.log(framelayout, widgetData, "widgetData")
    const responjson = {
      dashboard_json_frame_data: widgetData,
      customer_id: user.customer_id,
      dashboard_report_name: dashboardNameInput,
      group_id: user.group_id 
    }
    try {
      const userConfirmed = window.confirm("Are you sure you want to Add this frame?");

      if (userConfirmed) {
        dispatch(savecanvasframedata(responjson, history));
        localStorage.setItem('finalfream', framelayout);
      } else {
        console.log("User canceled the operation.");
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleDoubleClick = (item) => {
    console.log(item, "item")
    if (item.i === selectedItem?.chatId) {
      setSelectedItem({"chatId":null,"chartName":null});
    } else {
      setSelectedItem({"chatId":item.i,"chartName":item.chartType});
    }
  };
  const redurectPreviewPage = () => {
    history('/Preview');
  };

  return (
    <div className="Generator_page">
      <div className="header_styling">
        <Header />
      </div>
      {/* <div>
        <div id="dashboard-details-input-container">
          <div
            id="group-select-dropdown-container"
            className="input-group flex-nowrap dashboard-detail-entry"
          >
            <select
              required
              className="form-control"
              id="user-group-select-dropdown"
              value={selectedUserGroup}
              onChange={(e) => handleUserGroupChange(e)}
            >
              <option value="">None Selected</option>
              {listofallgroup?.map((groupdetail) => (
                <option key={groupdetail.group_id} value={groupdetail.group_id}>
                  {groupdetail.groupname}
                </option>
              ))}
            </select>
          </div>
          <div
            id="dashboard-name-input-container"
            className="input-group flex-nowrap dashboard-detail-entry"
          >
            <input
              required
              className="form-control"
              id="dashboard-name-input"
              type="text"
              placeholder="Dashboard Name: "
              value={dashboardNameInput}
              onChange={handleDashboardNameChange}
            />
          </div>
          <div
            id="dashboard-description-textarea-container "
            style={{ width: "100%" }}
            className="input-group flex-nowrap dashboard-detail-entry"
          >
            <textarea
              required
              style={{ transform: "translateX(6%)" }}
              className="form-control"
              id="dashboard-description"
              placeholder="Description..."
              value={dashboardDescriptionInput}
              onChange={(e) => setDashboardDescriptionInput(e.target.value)}
            />
          </div>
          <div id="verification-button-container">
            <Button
              onClick={handleVerifyClick}
              id="dashboard-verify-button"
              type="button"
            >
              Verify
            </Button>
          </div>
        </div>
      </div> */}
      <div className="generator_container">
        <div className="side_bar">
          <div class="form-group generator_has-search generator_report_search">
            <span className="fa fa-search form-control-feedback"></span>
            {/* <input type="text" className="form-control" placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} /> */}
            <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="generator_sidebar-content" style={{ maxHeight: 'calc(100vh - 20px)', overflowY: 'auto' }}>
            {resultdata &&
              resultdata?.map((element, index) => (
                <div
                  className="chart_type"
                  id={`chart_type_${index}`}
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  key={index}
                  data-report-name={element.report_name}
                  style={{ border: isDragging ? '1px solid black' : '' }}
                >
                  {element.report_name}
                  <p style={{ margin: "2px", fontSize: "9px" }}>
                    {element.report_type === 'Chart' ? `${element.report_type}(${element.chart_type})` : element.report_type}
                  </p>


                  {/* {element.report_type != "Table" && element.report_type != "Box" &&<p>{element.chart_type}</p>} */}

                </div>
              ))}
          </div>
        </div>
        <div className="toggling_part">
          <ResponsiveGridLayout
            className="layout"
            style={{height:"100vh",overflowY:"scroll"}}
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onLayoutChange={onLayoutChange}
          >
            {layouts.lg.map((item, index) => (
              <div
                onDrop={(event) => handleDrop(event, item.i)}
                onDragOver={handleDragOver}
                key={item.i}
                style={{
                  border: selectedItem?.chatId === item.i ? '3px solid black' : '1px solid black',
                  cursor: 'pointer',
                  color: selectedItem?.chatId === item.i ? 'lightblue' : '',
                }}
                onClick={() => handleDoubleClick(item)}
              >
                <div className="grid-stack-item-content">
                  <div className="p-2">
                    <div className="container" id={item.i}>
                      <span id={`graph${item.i}`} style={{ background: 'white' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
        <div className="right_part_of_container">
          <Button  onClick={handleAddWidget}>
            Add Div
          </Button>
          <Button  onClick={handleDelete}>
            Delete
          </Button>
          <Button  onClick={handleSaveAddWidget}>
            Save
          </Button>
          <Button  onClick={redurectPreviewPage}>
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplitView;