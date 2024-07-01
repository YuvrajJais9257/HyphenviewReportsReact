import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useNavigate } from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Header from '../header';
import { Button } from './../globalCSS/Button/Button';
import HighCharts from '../HighCharts/HighCharts';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Seeonother = () => {
  const [freamData, setfreamData] = useState([]);
  // const dispatch = useDispatch();
  const history = useNavigate();
  
  
  
  // const apiData = useSelector((state) => state?.auth.get_report_formate_data);

  useEffect(() => {
    const sessionFreamVal = localStorage.getItem('finalfream');
    const finalfreamArray = sessionFreamVal ? JSON.parse(sessionFreamVal) : [];
     console.log('No value found in localStorage for the key ', finalfreamArray);
    setfreamData(finalfreamArray);
  },[]);


  



  const handelShowDashboard = () =>{
    history('/Dashboard')
  }

  // const chartdetaidata = apiData?.get_report_formate_data;
  // console.log(chartdetaidata,"chartdetaidata")

  return (
    <div>
      <div className="headerofpreview">
        <Header />
      </div>
      <div className='previewpage_container'>
      <div style={{textAlign:"center"}}><h3>See the chart</h3></div>
     <div className='previewpage_sub_container'>
      <div style={{ width: '75%', margin: '10px', border: "1px solid black", textAlign:"center", marginLeft:"12%"}}>
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: freamData }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          isResizable={false}
          isDraggable={false}
          width={1200}
        >
          {freamData?.map((item, index) => (
            <div
              key={item.i}
              style={{
                border: '1px solid black',
                background: 'white',
                overflow: 'hidden',
                borderRadius: "5px",
                width: `${item.w * 100}%`, // Set width based on grid item width
                height: `${item.h * 30}px`,
              }}
            > 
              {<HighCharts key={index} width={`${item.w * 100}%`} height={`${item.h * 38}px`} charttype={item.chartType}  />}
              
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
      </div>

      <div className="show_Dashboar" style={{ textAlign: 'center', margin : "5px" }}>
      {/* <Button style={{marginRight:"5px"}} onClick={() => {
            history('/ModifiedCanvasPage')}}>Back</Button> */}
        <Button onClick={handelShowDashboard}>Show on Dashboard</Button>
        
      </div>
      </div>
    </div>
  );
};

export default Seeonother;


// import React, { useEffect, useState } from 'react';
// import { Responsive, WidthProvider } from 'react-grid-layout';
// import { useNavigate } from 'react-router-dom';
// import 'react-grid-layout/css/styles.css';
// import Header from '../header';
// import HighCharts from '../HighCharts/HighCharts';

// const ResponsiveGridLayout = WidthProvider(Responsive);

// const Seeonother = () => {
//   const [freamData, setfreamData] = useState([]);
//   const history = useNavigate();

//   useEffect(() => {
//     const sessionFreamVal = localStorage.getItem('finalfream');
//     const finalfreamArray = sessionFreamVal ? JSON.parse(sessionFreamVal) : [];
//     setfreamData(finalfreamArray);
//   }, []);

//   const handleShowDashboard = () => {
//     history('/Dashboard');
//   };

//   console.log(freamData,"freamData")

//   const handleAddFrame = () => {
//     const newItem = {
//       i: `ContainerWidget${freamData.length + 1}`,
//       x: 0,
//       y: Math.floor(freamData.length / 3) * 4,
//       w: 4,
//       h: 4,
//     };

//     setfreamData([...freamData, newItem]);
//   };

//   return (
//     <div>
//       <div className="headerofpreview">
//         <Header />
//       </div>
//       <h3>See the chart</h3>

//       <div style={{ width: '75%', margin: '10px', border: '1px solid black', textAlign: 'center' }}>
//         <ResponsiveGridLayout
//           className="layout"
//           layouts={{ lg: freamData }}
//           breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//           cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
//           rowHeight={30}
//           // isResizable={false}
//           // isDraggable={false}
//           width={1200}
//         >
//           {freamData?.map((item, index) => (
//             <div
//               key={item.i}
//               style={{
//                 border: '1px solid black',
//                 background: 'white',
//                 overflow: 'hidden',
//                 borderRadius: '5px',
//                 width: `${item.w * 100}%`,
//                 height: `${item.h * 30}px`,
//               }}
//             >
//               <HighCharts key={index} width={`${item.w * 100}%`} height={`${item.h * 38}px`} charttype={item.chartType} />
//             </div>
//           ))}
//         </ResponsiveGridLayout>
//       </div>

//       <div className="show_Dashboar" style={{ alignItems: 'center' }}>
//         <button style={{ width: '150px', textAlign: 'center', fontSize: '10px', marginLeft: '30%' }} onClick={handleShowDashboard}>
//           Show on Dashboard
//         </button>
//         <button style={{ width: '150px', textAlign: 'center', fontSize: '10px', marginLeft: '30%' }} onClick={handleAddFrame}>
//           Add Frame
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Seeonother;
