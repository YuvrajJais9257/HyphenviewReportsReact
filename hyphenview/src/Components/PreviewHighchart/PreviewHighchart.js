// Author: Ashish
// Functionality:
// Date:
// Version:


import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customPreviewChartData } from '../../actions/auth';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsExporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import highchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import 'highcharts/css/highcharts.css';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsMap from 'highcharts/modules/map';
import SolidGauge from 'highcharts/modules/solid-gauge';



// Initialize the 3D module
Highcharts3D(Highcharts);
HighchartsMap(Highcharts);
HighchartsMore(Highcharts);
highchartsExporting(Highcharts);
highchartsOfflineExporting(Highcharts);
SolidGauge(Highcharts);




const PreviewHighchart = () => {
  const containerId = 'highcharts-container';
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const selectedShemasection = JSON.parse(localStorage.getItem('SelectedSchema'));
  const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'));
  const [topology, setTopology] = useState(null);
  console.log(selectedShemasection, CustomeDetailOfReport, "CustomeDetailOfReport666");

  const apiData = useSelector((state) => state?.auth);
  const PreviewchartData = apiData?.custom_preview_chart;
  console.log(PreviewchartData,"PreviewchartData")

  useEffect(() => {
    dispatch(
      customPreviewChartData({
        report_name: CustomeDetailOfReport?.title,
        report_type: CustomeDetailOfReport?.type,
        chart_type: CustomeDetailOfReport?.chart_type,
        query: CustomeDetailOfReport?.query,
        email: user.user_email_id,
        database_type: "mysql",
        connection_type: CustomeDetailOfReport?.connection_type,
        schema: CustomeDetailOfReport?.schema,
      })
    );
  }, []);

  useEffect(() => {
    if (CustomeDetailOfReport?.chart_type === 'geomap') {
      const fetchTopology = async () => {
        const response = await fetch('https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json');
        const topologyData = await response.json();
        setTopology(topologyData);
      };
      fetchTopology();
    }
  }, []);


  const chartOptions = useMemo(() => {
    if (!CustomeDetailOfReport || !PreviewchartData) return {};
    const { chart_type } = CustomeDetailOfReport;
    let options = {};
    switch (chart_type) {
      case 'line':
        options = {
          chart: { type: 'line' },
          title: { text: CustomeDetailOfReport.title || '' },
          yAxis: [{ title: { text: null } }, { opposite: true, title: { text: null } }],
          // xAxis: { categories: PreviewchartData.xAxis.map((item) => item.categories) },
          plotOptions: {
            line: {
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: { hover: { enabled: true } },
              },
            },
          },
          xAxis: { categories: PreviewchartData.xAxis[0].categories },
          credits: { enabled: false },
          series: PreviewchartData.series.map((series) => ({ name: series.name, data: series.data })),
        };
        break;
      case 'area':
        options = {
          chart: { type: 'area' },
          title: { text: CustomeDetailOfReport.title || '' },
          yAxis: [{ title: { text: null } }, { opposite: true, title: { text: null } }],
          xAxis: { categories: PreviewchartData.xAxis[0].categories },
          plotOptions: {
            area: {
              marker: {
                enabled: true,
                states: { hover: { enabled: true } },
              },
            },
          },
          credits: { enabled: false },
          series: PreviewchartData?.series.filter((series, index) => {
            if (index === 0) {
              return !series.data.every(item => typeof item === 'string');
            }
            return true;
          }).map(series => ({
            name: series.name,
            data: series.data,
          }))
        };
        break;
      case 'bar':
        options = {
          chart: { type: 'bar' },
          title: { text: CustomeDetailOfReport.title || '' },
          yAxis: [{ title: { text: null } }, { opposite: true, title: { text: null } }],
          // xAxis: { categories: PreviewchartData.series[0] && PreviewchartData.series[0].data},
          xAxis: { categories: PreviewchartData.xAxis[0].categories },
          credits: { enabled: false },
          // series: {data : PreviewchartData.series[1] && PreviewchartData.series[1].data,
          // name :PreviewchartData.series[1].name },
          series: PreviewchartData?.series.filter((series, index) => {
            if (index === 0) {
              return !series.data.every(item => typeof item === 'string');
            }
            return true;
          }).map(series => ({
            name: series.name,
            data: series.data,
          }))
        };
        break;
      case 'column':
        options = {
          chart: { type: 'column' },
          title: { text: CustomeDetailOfReport.title || '' },
          yAxis: [{ title: { text: null } }, { opposite: true, title: { text: null } }],
          xAxis: { categories: PreviewchartData?.xAxis[0].categories },
          credits: { enabled: false },
          series: PreviewchartData?.series.filter((series, index) => {
            if (index === 0) {
              return !series.data.every(item => typeof item === 'string');
            }
            return true;
          }).map(series => ({
            name: series.name,
            data: series.data,
          }))
        };
        break;
      case '3Dpie':
        options = {
          chart: { type: 'pie', options3d: { enabled: true, alpha: 45, beta: 0 } },
          title: { text: CustomeDetailOfReport.title || '' }, accessibility: { point: { valueSuffix: '%' } },
          tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
          credits: { enabled: false },
          plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', depth: 35, dataLabels: { enabled: true, format: '{point.name}' } } },
          series: [{
            name: PreviewchartData && PreviewchartData?.series[0].name,
            colorByPoint: true,
            data: PreviewchartData && PreviewchartData?.series[0].data.map((name, index) => ([
              name,
              PreviewchartData && PreviewchartData?.series[1].data[index]
            ]))
          }]
        };
        break;
      case '3Ddonut':
        options = {
          chart: { type: 'pie', options3d: { enabled: true, alpha: 45 } },
          title: { text: CustomeDetailOfReport.title || '' }, accessibility: { point: { valueSuffix: '%' } },
          tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
          credits: { enabled: false },
          plotOptions: { pie: { innerSize: 100, depth: 45 } },
          series: [{
            name: PreviewchartData && PreviewchartData?.series[0].name,
            colorByPoint: true,
            data: PreviewchartData && PreviewchartData?.series[0].data.map((name, index) => ([
              name,
              PreviewchartData && PreviewchartData?.series[1].data[index]
            ]))
          }]
        };
        break;
      case 'geomap':
        if (!topology) return {};
        options = {
          chart: { map: topology },
          title: { text: CustomeDetailOfReport.title || '' },
          mapNavigation: { enabled: true, buttonOptions: { verticalAlign: 'bottom' } },
          plotOptions: {
            series: {
              point: { events: { click: function () { alert(this.name); } } },
              dataLabels: { enabled: true, style: { textOutline: false, } }
            }
          },
          colorAxis: {
            min: 0
          },
          series: [{
            name: PreviewchartData && PreviewchartData?.series[0].name,
            data: PreviewchartData && PreviewchartData?.series[0].data.map((name, index) => ([
              name,
              PreviewchartData && PreviewchartData?.series[1].data[index]
            ])),
            states: { hover: { color: '#2BD925' } },
            dataLabels: { enabled: true, format: '{point.name}' }
          }]
        }
        break;
      case 'pie':
        options = {
          chart: { type: 'pie' },
          title: { text: CustomeDetailOfReport.title || '' },
          yAxis: [{ title: { text: 'Values' } }, { opposite: true, title: { text: 'Time' } }],
          tooltip: {
            valueSuffix: '%'
          },
          plotOptions: {
            series: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: [{
                enabled: true,
                distance: 20
              }, {
                enabled: true,
                distance: -40,
                format: '{point.percentage:.1f}%',
                style: {
                  fontSize: '1.2em',
                  textOutline: 'none',
                  opacity: 0.7
                },
                filter: {
                  operator: '>',
                  property: 'percentage',
                  value: 10
                }
              }]
            }
          },
          credits: { enabled: false },
          series: [
            {
              name: PreviewchartData && PreviewchartData?.series[0].name,
              colorByPoint: true,
              data: PreviewchartData && PreviewchartData?.series[0].data.map((name, index) => ({
                name,
                y: PreviewchartData && PreviewchartData?.series[1].data[index]
              }))
            }]


        };


        break;
      case 'stackarea':
        options = {
          chart: { type: 'area' },
          title: { text: CustomeDetailOfReport?.title || '' },
          yAxis: [{ title: { text: 'Values' } }, { opposite: true, title: { text: 'Time' } }],
          xAxis: { categories: PreviewchartData.xAxis[0].categories },
          plotOptions: {
            area: {
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              marker: {
                lineWidth: 1,
                lineColor: '#666666'
              }
            }
          },
          credits: { enabled: false }, // Remove Highcharts logo
          series: PreviewchartData?.series.filter((series, index) => {
            if (index === 0) {
              return !series.data.every(item => typeof item === 'string');
            }
            return true;
          }).map(series => ({
            name: series.name,
            data: series.data,
          }))
        };
        break;
      case 'stackbar':
        options = {
          chart: { type: 'bar' },
          title: { text: CustomeDetailOfReport.title || '' },
          yAxis: [{ title: { text: 'Values' } }, { opposite: true, title: { text: 'Time' } }],
          // xAxis: { categories: PreviewchartData.xAxis.map((item) => item.categories) },
          plotOptions: {
            series: {
              stacking: 'normal',
            },
          },
          xAxis: { categories: PreviewchartData?.xAxis[0].categories },
          credits: { enabled: false },
          series: PreviewchartData.series.map((series) => ({ name: series.name, data: series.data })),
        };
        break;
      case 'stackcolumn':
        options = {
          chart: { type: 'column' },
          title: { text: CustomeDetailOfReport.title || '' },
          yAxis: [{ title: { text: 'Values' } }, { opposite: true, title: { text: 'Time' } }],
          xAxis: { categories: PreviewchartData?.xAxis[0].categories },
          plotOptions: {
            series: {
              stacking: 'normal',
            },
          },
          credits: { enabled: false },
          series: PreviewchartData?.series.filter((series, index) => {
            if (index === 0) {
              return !series.data.every(item => typeof item === 'string');
            }
            return true;
          }).map(series => ({
            name: series.name,
            data: series.data,
          }))
        };
        break;
      case 'speedometer':
           options = {
              chart: {
                  type: 'gauge',
                  plotBackgroundColor: null,
                  plotBackgroundImage: null,
                  plotBorderWidth: 0,
                  plotShadow: false,
                  height: '30%'
              },
          
              title: {
                  text: 'Speedometer'
              },
          
              pane: {
                  startAngle: -90,
                  endAngle: 89.9,
                  background: null,
                  center: ['50%', '75%'],
                  size: '110%'
              },
              yAxis: {
                  min: 0,
                  max: 200,
                  tickPixelInterval: 72,
                  tickPosition: 'inside',
                  tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
                  tickLength: 20,
                  tickWidth: 2,
                  minorTickInterval: null,
                  labels: {
                      distance: 20,
                      style: {
                          fontSize: '14px'
                      }
                  },
                  lineWidth: 0,
                  plotBands: [{
                    from: 0,
                    to: 30,
                    color: '#55BF3B',
                    thickness: 20,
                    borderRadius: '50%'
                }, {
                    from: 31,
                    to: 50,
                    color: '#DF5353', // red
                    thickness: 20,
                    borderRadius: '50%'
                }, {
                    from: 51,
                    to: 200,
                    color: '#DDDF0D', // yellow
                    thickness: 20
                }]
              },
          
              series: [{
                  name: PreviewchartData.series[0].name,
                  data: PreviewchartData?.series[0].data,
                  dataLabels: {
                      borderWidth: 0,
                      color: (
                          Highcharts.defaultOptions.title &&
                          Highcharts.defaultOptions.title.style &&
                          Highcharts.defaultOptions.title.style.color
                      ) || '#333333',
                      style: {
                          fontSize: '16px'
                      }
                  },
                  dial: {
                      radius: '80%',
                      backgroundColor: 'gray',
                      baseWidth: 12,
                      baseLength: '0%',
                      rearLength: '0%'
                  },
                  pivot: {
                      backgroundColor: 'gray',
                      radius: 6
                  }
          
              }]
          }
          break;      
      case 'gauge':
        options = {

          chart: {
            type: 'solidgauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            // height: '50%'
          },

          title: { text: CustomeDetailOfReport.title || '' },
          pane: {
            center: ['50%', '85%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: {
              backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc'
            }
          },


          credits: { enabled: false },
          yAxis: {
            min: 0,
            max: 10000,
            tickPixelInterval: 72,
            tickPosition: 'inside',
            // tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
            tickLength: 20,
            tickWidth: 2,
            minorTickInterval: null,
            labels: {
              distance: 20,
              style: {
                fontSize: '14px'
              }
            },
            // lineWidth: 0,
            plotBands: [{
              from: 0,
              to: 120,
              color: '#0B5345', // green
              thickness: 40
            },
            {
              from: 120,
              to: 160,
              color: '#DDDF0D', // yellow
              thickness: 40
            }, {
              from: 160,
              to: 200,
              color: '#DF5353', // red
              thickness: 40
            }
            ]
          },

          exporting: {
            enabled: false
          },

          series: [{
            name: PreviewchartData.series[0].name,
            data: PreviewchartData?.series[0].data,
            color: Highcharts.defaultOptions.chart.backgroundColor,
            // tooltip: {
            //     valueSuffix: ' km/h'
            // },
            dataLabels: {
              // format: '{y} km/h',
              borderWidth: 0,
              color: (
                Highcharts.defaultOptions.title &&
                Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color
              ) || '#333333',
              style: {
                fontSize: '16px'
              }
            },
            dial: {
              radius: '80%',
              backgroundColor: 'gray',
              baseWidth: 12,
              baseLength: '0%',
              rearLength: '0%'
            },
            pivot: {
              backgroundColor: 'gray',
              radius: 6
            }

          }]
        }


        break;
      case 'radialBar':
        options = {
          chart: { type: 'bar' },
          title: { text: CustomeDetailOfReport.title || '' },
          yAxis: [{ title: { text: 'Values' } }, { opposite: true, title: { text: 'Time' } }],
          xAxis: { categories: PreviewchartData?.xAxis[0].categories },
          plotOptions: {
            series: {
              stacking: 'normal',
            },
          },
          credits: { enabled: false },
          series: PreviewchartData?.series.filter((series, index) => {
            if (index === 0) {
              return !series.data.every(item => typeof item === 'string');
            }
            return true;
          }).map(series => ({
            name: series.name,
            data: series.data,
          }))
        };
        break;
      case '3Darea':
        options = {chart: {type: 'area',options3d: {enabled: true,alpha: 15,beta: 30,depth: 200}},
          title: { text: CustomeDetailOfReport.title || '' },
          accessibility: {keyboardNavigation: {seriesNavigation: {mode: 'serialize'}}},
          lang: {accessibility: {axis: {
                xAxisDescriptionPlural: 'The chart has 3 unlabelled X axes, ' +
                  'one for each series.'
              }}},
          yAxis: {
            title: {x: -40},labels: {format: '{value:,.0f}'},gridLineDashStyle: 'Dash'},
          xAxis: { categories: PreviewchartData?.xAxis[0].categories },
          plotOptions: {area: {depth: 100,marker: {enabled: false},states: {inactive: {enabled: false}}}},
          credits: { enabled: false },
          series: PreviewchartData?.series.filter((series, index) => {
            if (index === 0) {
              return !series.data.every(item => typeof item === 'string');
            }
            return true;
          }).map(series => ({
            name: series.name,
            data: series.data,
          }))
        }
        break;
      default:
        break;
    }
    return options;
  }, [CustomeDetailOfReport, PreviewchartData, topology]);

  
  return (
    <div>
      <div className="previewChartpage" id={containerId}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} containerProps={{ id: containerId }} />
      </div>
    </div>
  );
};

export default PreviewHighchart;
