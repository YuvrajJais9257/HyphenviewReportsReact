import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsExporting from 'highcharts/modules/exporting'; 
import highchartsOfflineExporting from 'highcharts/modules/offline-exporting'; 
import 'highcharts/css/highcharts.css'; 

highchartsExporting(Highcharts);
highchartsOfflineExporting(Highcharts);

function PieChart({height,width,charttype}) {
   console.log(width,height,charttype,"width")
   const containerId = 'highcharts-container';

   const [chartTypeStore, setchartTypeStore] = useState();

   console.log(chartTypeStore,"chartTypeStore")
  
  const chartData =  { 
  chart: {
      type: 'pie'
    },
      title: {
      text: 'LATENCY',
    },
    tooltip: {
      shared: true,
    },
    credits:{
        enabled:false,
      },
    // xAxis: [
    //   {
    //     categories: ['2024-01-10 14:00:02', '2024-01-10 15:00:02'],
    //     crosshair: true,
    //   },
    // ],
      yAxis: [
      {
        min: 0,
        title: {
          text: 'Values',
        },
      },
      {
        opposite: true,
        title: {
          text: 'Time',
        },
      },
    ],
  tooltip: {
      pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
  },
  plotOptions: {
      area: {
          pointStart: 1940,
          marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                  hover: {
                      enabled: true
                  }
              }
          }
      }
  },
  // series: [
  //       { data: [5.0, 5.0], name: 'latency.p98' },
  //       { data: [3.0, 3.0], name: 'latency.p90' },
  //       { data: [11.0, 9.0], name: 'latency.p99' },
  //       { data: [1.0, 1.0], name: 'latency.p25' },
  //       { data: [0.0, 0.0], name: 'latency.min' },
  //       { data: [2.0, 2.0], name: 'latency.p75' },
  //       { data: [155.0, 193.0], name: 'latency.max' },
  //       { data: [1.94, 1.862], name: 'latency.mean' },
  //       { data: [3.0, 3.0], name: 'latency.p95' },
  //       { data: [13627.0, 13535.0], name: 'latency.sum' },
  //       { data: [1.0, 1.0], name: 'latency.p50' },
  //     ],
  "series": [
    {
        "data": [
            1,
            2,
            3,
            4,
            5
        ],
        "name": "role_id"
    },
    {
        "data": [
            "SuperAdmin",
            "Admin",
            "Employee",
            "Guest",
            "ReportEndUser"
        ],
        "name": "role_name"
    },
    {
        "data": [
            1,
            1,
            2,
            1,
            1
        ],
        "name": "group_id"
    }
]
};


  return (
    // <div style={{width:{width},height:{height},border:"1px solid black"}}>
    //   <HighchartsReact highcharts={Highcharts} options={chartData}  />
    // </div>
    <div style={{width : {width}, height : {height}}} >
      <div id={containerId}  style={{ width: '100%', height: '100%' }}>
      <HighchartsReact highcharts={Highcharts} options={chartData} containerProps={{ id: containerId, style: {height: height} }}/>
    </div></div>
  );
}

export default PieChart;

