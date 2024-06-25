
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
import { updatecanvashframedataformodification, canvashframedataformodification } from '../../actions/canvascreation';
import { v4 as uuidv4 } from 'uuid';


import Header from '../header';

const ResponsiveGridLayout = WidthProvider(Responsive);
const ModifiedCanvasPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [widgetData, setWidgetData] = useState([]);
  const [widgetframeData, setWidgetframeData] = useState([]);
  const [freameId, setFreamId] = useState([])
  const [search, setSearch] = useState("")

  const dispatch = useDispatch();
  const apiData = useSelector((state) => state);
  const datareport = apiData?.reportmanagement.allReportDetail
  console.log(datareport, "datareport")
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('profile'));
    dispatch(canvashframedataformodification({ customer_id: user.customer_id }));
    dispatch(getreporttitlefromondashbaord({ database_type: "mysql", email: user.user_email_id, customer_id: user.customer_id, group_id: user.group_id }));
  }, []);
  const frameChartdata = apiData?.canvascreation.canvasframedetail;
  console.log(frameChartdata,"frameChartdata")
  useMemo(() => {
    const frames = frameChartdata?.frame || [];
    console.log(frames, "frames")
    setWidgetframeData(frames);

    // Iterate through the frames and setFreamId for each
    frames.forEach((frame, index) => {
      const { chartType, i } = frame;
      setFreamId((prevIds) => [...prevIds, { chartType, i }]);
    })
  }, [frameChartdata]);

  let history = useNavigate();

  const handleDragStart = (event) => {
    console.log(event.target.id, "event.target.id")
    setIsDragging(true);
    event.dataTransfer.setData('text/plain', event.target.id);
  };

  const handleDragEnd = () => {
    console.log("is end")
    setIsDragging(false);
  };

  var results = frameChartdata?.report_excluded;
  console.log(results, "results")

  const handleDrop = (event, id) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    // const draggedItem = document.getElementById(data);
    const draggedItem = document.getElementById(data);
    const chartType = draggedItem.getAttribute('data-report-name');
    console.log(widgetData,"widgetData")
    
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
      console.log({ chartType: newItem.chartType, i: newItem.layout.i });
      updatedWidgetData.push(newItem);
    }
    const updatedatasave = updatedWidgetData.map(item => ({
      chartType: item.chartType,
      i: item.i,
    }));
    results = results.filter((item)=>item.report_name != chartType)
    setFreamId(updatedatasave)
    setWidgetData(updatedWidgetData);
    event.target.appendChild(draggedItem);
    
  };


   console.log(freameId,"freameId")

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  


  // if (search) {
  //   console.log(search,"search")
  //   results = frameChartdata?.report_excluded.filter(item => {
  //     let found = false;
  //     Object.values(item).forEach(value => {
  //       if (String(value).toLowerCase().includes(search.toLowerCase())) {
  //         found = true;
  //       }
  //     });
  //     console.log(found,"found")
  //     return found;
  //   });
  // }

  if (search) {
    results = frameChartdata?.report_excluded?.filter(item => {
      let found = false;
      Object.values(item).forEach(value => {
        if (String(value).toLowerCase().includes(search.toLowerCase())) {
          found = true;
        }
      });
      return found;
    });
  }



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
    console.log(newItem)
    setWidgetframeData((prevData) => [...prevData, newItem]);
  };


  console.log(widgetframeData, "widgetframeData")

  const handleDelete = () => {
    if (selectedItem !== null) {
      setWidgetData((prevData) => {
        const { [selectedItem]: deletedItem, ...rest } = prevData;
        return rest;
      });

      const updatedLayout = widgetframeData.filter((item) => item.i !== selectedItem);
      const updatedidfrom = freameId.filter((item) => item.i !== selectedItem)
      console.log(updatedLayout, "updatedLayout")
      setFreamId(updatedidfrom)
      setWidgetframeData(updatedLayout);
      setSelectedItem(null);
    }
  };

  console.log(widgetData, "delete")
  const handleSaveAddWidget = () => {
    console.log(widgetData, "widgetData")
    const framelayout = JSON.stringify(widgetData);
    localStorage.setItem('finalfream', framelayout);
    // setWidgetframeData([])
    const responjson = {
      dashboard_json_frame_data: widgetData,
      customer_id: user.customer_id,
      dashboard_report_name: "anything"
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


  const handleDoubleClick = (item) => {
    console.log(item, "item")
    if (item.i === selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item.i);
    }
  };

  console.log(selectedItem, "selectedItem")

  const redurectPreviewPage = () => {
    setWidgetframeData([])
    history('/Preview');
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
    setWidgetframeData(updatedLayout)
  }



  console.log(results,freameId, "FreamId")


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
            {console.log("result//",results)}
            {results &&
              results.map((element, index) => (
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
                  <p style={{margin:"2px",fontSize:"9px"}}>
                   {element.report_type === 'Chart' ? `${element.report_type}(${element.chart_type})` : element.report_type}
                 </p>

                </div>
              ))}
          </div>
        </div>
        <div className="modified_toggling_part">
          <ResponsiveGridLayout
            className="layout"
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
                    border: '1px solid black',
                    cursor: 'pointer',
                    backgroundColor: selectedItem === item.i ? 'lightblue' : '',
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


// import React, { useEffect, useMemo, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import './ModifiedCanvas.css';
// import { useNavigate } from 'react-router-dom';
// import HighCharts from '../HighCharts/HighCharts';
// import { Responsive, WidthProvider } from 'react-grid-layout';
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';
// import { Button } from './../globalCSS/Button/Button';
// import { getreporttitlefromondashbaord } from '../../actions/reportmanagement';
// import { savecanvasframedata, canvashframedataformodification } from '../../actions/canvascreation';

// import Header from '../header';

// const ResponsiveGridLayout = WidthProvider(Responsive);

// const ModifiedCanvasPage = () => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [widgetData, setWidgetData] = useState([]);
//   const [widgetframeData, setwidgetframeData] = useState([]);


//   const dispatch = useDispatch();

//   const apiData = useSelector((state) => state);
//   const user = JSON.parse(localStorage.getItem('profile'));
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('profile'));
//     // const shemaDetail = JSON.parse(localStorage.getItem('SelectedSchema'));
//     // console.log(shemaDetail, "shemaDetail")
//     dispatch(canvashframedataformodification({ customer_id: user.customer_id }));
//     dispatch(getreporttitlefromondashbaord({ database_type: "mysql", email: user.user_email_id }));
//   }, []);



//   let history = useNavigate();

//   const handleDragStart = (event) => {
//     console.log(event.target.id, "event")
//     setIsDragging(true);
//     event.dataTransfer.setData('text/plain', event.target.id);
//   };

//   const handleDragEnd = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (event, divIndex) => {
//     event.preventDefault();
//     const data = event.dataTransfer.getData('text/plain');
//     const draggedItem = document.getElementById(data);
//     console.log(widgetData, "dataget")
//     const chartType = draggedItem.textContent;
//     console.log(chartType)
//     let chartTypeAdded = false;

//     const updatedWidgetData = widgetData.map((item, index) => {
//       if (index === divIndex) {
//         chartTypeAdded = true;
//         return {
//           ...item,
//           chartType: chartType,
//         };
//       }
//       return item;
//     });

//     if (!chartTypeAdded) {
//       updatedWidgetData.push({
//         divIndex,
//         chartType,
//         layout: {
//           i: `ContainerWidget${widgetframeData.length}`,
//           x: (widgetframeData.length * 4) % 12,
//           y: Math.floor(widgetframeData.length / 3) * 4,
//           w: 4,
//           h: 4,
//         },
//       });
//     }
//     setWidgetData((prevData) => [...prevData, ...updatedWidgetData]);


//     event.target.appendChild(draggedItem);
//   };

//   console.log("widgetData",widgetData)
//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   // const handleAddWidget = () => {
//   //   const maxWidgets = 9;
//   //   if (widgetframeData.length >= maxWidgets) {
//   //     alert('Maximum number of widgets reached. You cannot add more.');
//   //     return;
//   //   }

//   //   const newItem = {
//   //     i: `ContainerWidget${widgetframeData.length + 1}`,
//   //     x: 0,
//   //     y: Math.floor(widgetframeData.length / 3) * 4,
//   //     w: 4,
//   //     h: 4,
//   //     minH: 4,
//   //     maxH: 12,
//   //   };

//   //   const newLayouts = [...widgetframeData, newItem];
//   //   // setwidgetframeData(newLayouts)

//   //   // // Update the layouts state with the new array
//   //   setLayouts({ lg: newLayouts });

//   // };
//   const handleAddWidget = () => {
//     const maxWidgets = 9;
//     if (widgetframeData.length >= maxWidgets) {
//       alert('Maximum number of widgets reached. You cannot add more.');
//       return;
//     }

//     const newItem = {
//       i: `ContainerWidget${widgetframeData.length}`,
//       x: (widgetframeData.length * 4) % 12,
//       y: Math.floor(widgetframeData.length / 3) * 4,
//       w: 4,
//       h: 4,
//       minH: 4,
//       maxH: 12,
//     };
//     // const newLayouts = [...widgetframeData, newItem];

//     setwidgetframeData((prevData) => [...prevData, newItem]);
//   };

//   console.log(widgetframeData, "widgetframeData..")

//   const handleDelete = () => {
//     if (selectedItem !== null) {
//       console.log(selectedItem,"selectedItem")
//       setWidgetData((prevData) => {
//         const { [selectedItem]: deletedItem, ...rest } = prevData;
//         return rest;
//       });
//       const updatedLayout = widgetframeData.filter((item) => item.i !== selectedItem);
//       console.log(updatedLayout,"updatedLayout")
//       setwidgetframeData(updatedLayout );
//       setSelectedItem(null);
//     }
//   };
//   // console.log(widgetframeData,"widgetframeData")



//   // const chartTytel = apiData?.reportmanagement.allReportDetail;
//   const frameChartdata = apiData?.canvascreation.canvasframedetail;


//   useMemo(() => {
//     console.log("dfghjgfhj")
//     // const frameChartdata = apiData?.canvascreation.canvasframedetail;'
//     setWidgetData(frameChartdata?.frame || []);
//     setwidgetframeData(frameChartdata?.frame || []);

//     // console.log(widgetframeData,"widgetframeData")
//     // setLayouts({lg: frameChartdata?.frame || [] });
//     // console.log("chartTytel", layouts.lg)
//   }, [frameChartdata])
//   console.log(widgetData,"widgetData")


//   const handleSaveAddWidget = async () => {

//     const framelayout = JSON.stringify(widgetData);
//     console.log(framelayout, "widgetData//")
//     localStorage.setItem('finalfream', framelayout);
//     // const responjson = {
//     //   dashboard_json_frame_data: widgetData,
//     //   customer_id: user.customer_id,
//     //   dashboard_report_name: "anything"
//     // }
//     // try {
//     //   const userConfirmed = window.confirm("Are you sure you want to Add this frame?");

//     //   if (userConfirmed) {
//     //     dispatch(savecanvasframedata(responjson, history));
//     //     localStorage.setItem('finalfream', framelayout);
//     //   } else {
//     //     console.log("User canceled the operation.");
//     //   }
//     // } catch (error) {
//     //   console.error("Error removing user:", error);
//     // }
//   };

//   const handleDoubleClick = (item) => {
//     if (item.i === selectedItem) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem(item.i);
//     }
//     console.log(selectedItem, "selectedItem");
//   };

//   const redurectPreviewPage = () => {
//     history('/Preview');
//   };

//   const onLayoutChange = (newLayout) => {
//     console.log(newLayout,"newLayout**")
//     setWidgetData(newLayout);
//     // setwidgetframeData([...widgetframeData, newLayout]);
//   };




//   return (
//     <div className="modified_page">
//       <div className="header_styling">
//         <Header />
//       </div>
//       <div className="modified_container">
//         <div className="modified_side_bar">
//           {frameChartdata &&
//             frameChartdata?.report_excluded?.map((element, index) => (
//               <div
//                 className="modified_chart_type"
//                 id={`chart_type_${index}`}
//                 draggable
//                 onDragStart={handleDragStart}
//                 onDragEnd={handleDragEnd}
//                 key={index}
//                 style={{ border: isDragging ? '1px solid black' : '' }}
//               >
//                 {element}
//               </div>
//             ))}
//         </div>
//         <div className="modified_toggling_part">

//           <ResponsiveGridLayout
//             className="layout"
//             isResizable={true}
//             isDraggable={true}
//             layouts={{lg: widgetframeData}}
//             breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//             cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
//             rowHeight={30}
//             onLayoutChange={onLayoutChange}
//           >
//              {console.log(widgetframeData,"widgetframeData")}
//             {widgetframeData && widgetframeData.map((item,index) => (
//               <div
//                 key={item.i}
//                 onDrop={(event) => handleDrop(event, index)}
//                 onDragOver={handleDragOver}
//                 style={{
//                   border: '1px solid black',
//                   cursor: 'pointer',
//                   backgroundColor: selectedItem === item.i ? 'lightblue' : '',
//                   // background: 'white',
//                   overflow: 'hidden',
//                   borderRadius: "5px",
//                   // width: `${item.w * 100}%`,
//                   // height: `${item.h * 30}px`,
//                 }}
//                 onClick={() => handleDoubleClick(item)}
//               >
//                 <div className="grid-stack-item-content">
//                   <div className="p-2">
//                     <div className="container" id={item.i}>
//                       <span id={`graph${item.i}`} style={{ background: 'white' }}></span>
//                     </div>
//                   </div>
//                 </div>
//                 {console.log(item,"item")}
//               {item.chartType ? <HighCharts width={`${item.w * 100}%`} height={`${item.h * 35}px`} charttype={item.chartType} /> : null }
//               </div>
//             ))}
//           </ResponsiveGridLayout>
//         </div>
//         <div className="modified_right_part_of_container">
//           <Button onClick={handleAddWidget}>
//             Add Div
//           </Button>
//           <Button onClick={handleDelete}>
//             Delete
//           </Button>
//           <Button onClick={handleSaveAddWidget}>
//             Save
//           </Button>
//           <Button onClick={redurectPreviewPage}>
//             Preview
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModifiedCanvasPage;



