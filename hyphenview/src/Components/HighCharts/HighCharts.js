import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import { getreportformateddata } from '../../actions/auth';
import highchartsExporting from 'highcharts/modules/exporting';
import highchartsOfflineExporting from 'highcharts/modules/offline-exporting';
// import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import DashboardReport from '../DashboardReport/DashboardReport';
import BoxPreview from './BoxPreview';
import 'highcharts/css/highcharts.css';
import { useMatch } from 'react-router-dom';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsMap from 'highcharts/modules/map';


// Initialize the exporting module
highchartsExporting(Highcharts);
highchartsOfflineExporting(Highcharts);
Highcharts3D(Highcharts);
HighchartsMap(Highcharts);
// HighchartsSolidGauge(Highcharts);
const apiUrlEndPoint1 = process.env.REACT_APP_API_URL1;
function HighCharts({ height, width, charttype, key }) {
  const [chartDatastore, setchartDatastore] = useState();
  const [data, setData] = useState();
  const [TableData, setTableData] = useState();
  const [Boxdata, setBoxdata] = useState();
  const [showDrilldownModal, setShowDrilldownModal] = useState(false);
  const [topology, setTopology] = useState(null);
  const containerId = 'highcharts-container';
  const dispatch = useDispatch();

  const apiData = useSelector((state) => state);


  // Define a list of colors
  const colors = ['#0B5345', '#DDDF0D', '#DF5353', '#2E86C1', '#AF7AC5', '#F39C12', '#D35400', '#16A085'];

  // Function to get a random color from the list
  function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const randomColor = getRandomColor(colors);


  const user = JSON.parse(localStorage.getItem('profile'));
  const shemaDetail = JSON.parse(localStorage.getItem('SelectedSchema'));



  useEffect(() => {
    const postData = async () => {
      try {
        const response = await axios.post('http://localhost:3002/getReportData', {
          report_title: charttype,
          database_type: "mysql",
          email: user.user_email_id,
        });

        console.log(response.data, "response");

        if (response?.data?.report_type === 'chart' && response?.data?.chart_type !== 'geomap') {
          setData(response.data);
        } else if (response?.data && response?.data.report_type === 'table') {
          const tabledata = response.data;
          setTableData(tabledata);
        } else if (response?.data?.report_type === 'box') {
          setBoxdata(response.data);
        } else if (response?.data?.report_type === 'chart' && response?.data?.chart_type === 'geomap') {
          const fetchTopology = async () => {
            const response = await fetch('https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json');
            const topologyData = await response.json();
            setTopology(topologyData);
          };
          fetchTopology();
        }
      } catch (error) {
        console.log(error);
      }
    };

    postData();
  }, [charttype]);



  useMemo(() => {
    if (!data || !data.chart_type) return;
    let chartData = {};
    const getNameFromValue = (value) => {
      for (let obj of data.series) {
        if (obj.data.includes(value)) {
          return obj.name;
        }
      }
      return null;
    };
    const wantedInfo = (title, category, seriesName, value) => {
      const category_name = getNameFromValue(category);
      console.log(category_name, category, seriesName, value, "category_name")
      const wantedData = {
        report_title: title,
        category_name: category_name,
        category_value: category,
        selected_series_name: seriesName,
        selected_value_y_coordinate: value,
      };
      console.log(wantedData, "wantedData")
      if (wantedData) {
        const queryString = new URLSearchParams(wantedData).toString();
        window.open(`/drillDown?${queryString}`, '_blank', 'width=600,height=400');
      }
    };

    switch (data.chart_type) {
      case 'line':
        const pointEvents = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }
        chartData = {chart: {type: 'line',events: {}},
          title: {text: data.title || '',},
          tooltip: {shared: true,},
          credits: {enabled: false,},
          xAxis: { categories: data && data.xAxis[0].categories },
          yAxis: [
            {
              min: 0,
              title: {
                text: null,
              },
            },
            {
              opposite: true,
              title: {
                text: null,
              },
            },
          ],
          plotOptions: {
            line: {
              cursor: "pointer",
              point: {
                events: pointEvents,
              },
              marker: {
                enabled: true,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
            },
          },
          navigation: {
            menuStyle: {
              background: '#E0E0E0',
              height: '150px',
              overflow: 'scroll'
            }
          },

          series: data.series.filter((series, index) => {
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
      case 'area':
        const pointEvent = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }
        chartData = {
          chart: {
            type: 'area',
            backgroundColor: "rgba(33,37,41,0.1)",
          },
          title: {
            text: data.title || '',
          },
          tooltip: {
            shared: true,
          },
          credits: {
            enabled: false,
          },
          xAxis: { categories: data && data.xAxis[0].categories },
          yAxis: [
            {
              min: 0,
              title: {
                text: null,
              },
            },
            {
              opposite: true,
              title: {
                text: null,
              },
            },
          ],
          plotOptions: {
            area: {
              cursor: "pointer",
              point: {
                events: pointEvent,
              },
              marker: {
                enabled: true,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
            },
          },
          // series: data.series.map(series => ({
          //   name: series.name,
          //   data: series.data,
          // })),

          series: data.series.filter((series, index) => {
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
        const pointEvent2 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }
        chartData = {
          chart: {
            type: 'bar',
          },
          title: {
            text: data.title || '',
          },
          tooltip: {
            shared: true,
          },
          credits: {
            enabled: false,
          },
          xAxis: { categories: data && data.xAxis[0].categories },
          yAxis: [
            {
              min: 0,
              title: {
                text: null,
              },
            },
            {
              opposite: true,
              title: {
                text: null,
              },
            },
          ],
          plotOptions: {
            bar: {
              cursor: "pointer",
              point: {
                events: pointEvent2,
              },
              marker: {
                enabled: true,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
            },
          },
          credits: { enabled: false },
          // series: data.series.map((series,index) => ({
          //   name: series.name,
          //   data: series.data,
          // })),
          series: data.series.filter((series, index) => {
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
      case 'pie':
        const pointEvent3 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = this.series.name;
            const category = this.name; // For pie chart, use this.name to get the category
            wantedInfo(data?.title, category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        };

        chartData = {
          chart: {
            type: 'pie', events: {
            },
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
            valueSuffix: '%'
          },
          plotOptions: {
            series: {
              allowPointSelect: true,
              cursor: 'pointer',
              point: {
                events: pointEvent3,
              },
              dataLabels: [{
                enabled: true,
                distance: 20
              }, {
                enabled: true,
                distance: -40,
                format: '{point.percentage:.1f}%',
                style: {
                  fontSize: '1.0em',
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
          navigation: {
            menuStyle: {
              background: '#E0E0E0',
              height: '150px',
              overflow: 'scroll'
            }
          },
          title: { text: data.title || '' },

          series: [
            {
              name: data?.series[0]?.name,
              colorByPoint: true,
              data: data?.series[0]?.data.map((name, index) => ({
                name,
                y: data?.series[1]?.data[index]
              }))
            }],
          // credits: { enabled: false },
        };
        break;
      case '3dpie':
        const pointEvent31 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = this.series.name;
            const category = this.name; // For pie chart, use this.name to get the category
            wantedInfo(data?.title, category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        };
        chartData = {
          chart: {
            type: 'pie',
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
            }
          },
          title: {
            text: data.title || '',
          },
          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          credits: { enabled: false },
          plotOptions: {
            series: {
              allowPointSelect: true,
              cursor: 'pointer',
              point: {
                events: pointEvent31,
              },
            },
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                enabled: true,
                format: '{point.name}'
              }
            }
          },
          series: [
            {
              name: data && data?.series[0]?.name,
              colorByPoint: true,
              data: data && data?.series[0]?.data.map((name, index) => ([
                name,
                data && data?.series[1]?.data[index]
              ]))
            }]
        };
        break;
      case '3d donut':
        const pointEvent32 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = this.series.name;
            const category = this.name; // For pie chart, use this.name to get the category
            wantedInfo(data?.title, category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        };
        chartData = {
          chart: { type: 'pie', options3d: { enabled: true, alpha: 45 } },
          title: { text: data.title || '', }, accessibility: { point: { valueSuffix: '%' } },
          tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
          credits: { enabled: false },
          plotOptions: { pie: { innerSize: 100, depth: 45 },series: {
            allowPointSelect: true,
            cursor: 'pointer',
            point: {
              events: pointEvent32,
            },} },
          series: [{
            name: data && data?.series[0]?.name,
            colorByPoint: true,
            data: data && data?.series[0]?.data.map((name, index) => ([
              name,
              data && data?.series[1]?.data[index]
            ]))
          }]
        };
        break;
      case 'speedometer':
        chartData = {
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
    
        // the value axis
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
                to: 130,
                // color: '#55BF3B', // green
                thickness: 20,
                borderRadius: '50%'
            }, {
                from: 150,
                to: 200,
                // color: '#DF5353', // red
                thickness: 20,
                borderRadius: '50%'
            }, {
                from: 120,
                to: 160,
                // color: '#DDDF0D', // yellow
                thickness: 20
            }]
        },
    
        series: [{
          name: data?.series[0].name,
          data: data?.series[0].data,
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
        const pointEvent_2 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }
        chartData = {

          chart: {
            type: 'solidgauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,

          },
          title: {
            text: data.title || '',
          },
          pane: {
            center: ['50%', '75%'],
            size: '150%',
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
            max: 500,
            tickPixelInterval: 72,
            tickPosition: 'inside',
            tickLength: 20,
            tickWidth: 2,
            minorTickInterval: null,
            labels: {
              distance: 10,
              style: {
                fontSize: '14px'
              }
            },
            lineWidth: 0,
            plotBands: [{
              from: 0,
              to: 150,
              color: '#0B5345', // green
              thickness: 40
            },
            {
              from: 150,
              to: 300,
              color: '#DDDF0D', // yellow
              thickness: 40
            }, {
              from: 300,
              to: 500,
              color: '#DF5353', // red
              thickness: 40
            }
            ]
          },
          navigation: {
            menuStyle: {
              background: '#E0E0E0',
              height: '150px',
              overflow: 'scroll'
            }
          },

          plotOptions: {
            series: {
              cursor: 'pointer',
              point: pointEvent_2,
            }
          },

          series: [{
            name: data?.series[0].name,
            data: data?.series[0].data,
            color: randomColor,
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
      case 'stackcolumn':
        const pointEvent9 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }

        chartData = {
          chart: {
            type: 'column',
          },
          title: {
            text: data.title || '',
          },
          tooltip: {
            shared: true,
          },
          credits: {
            enabled: false,
          },
          xAxis: { categories: data && data.xAxis[0].categories },
          yAxis: [
            {
              min: 0,
              title: {
                text: null,
              },
            },
            {
              opposite: true,
              title: {
                text: null,
              },
            },
          ],
          plotOptions: {
            column: {
              cursor: "pointer",
              point: {
                events: pointEvent9,
              },
              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            }
          },
          // series: data.series.map(series => ({
          //   name: series.name,
          //   data: series.data,
          // })),

          series: data.series.filter((series, index) => {
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
      case '3darea':
          chartData = {
          chart: {
            type: 'area',
            options3d: {
              enabled: true,
              alpha: 15,
              beta: 30,
              depth: 200
            }
          },
          title: {
            text: data.title || '',
          },
          accessibility: {
            description: 'The chart is showing the shapes of three mountain ' +
              'ranges as three area line series laid out in 3D behind each ' +
              'other.',
            keyboardNavigation: {
              seriesNavigation: {
                mode: 'serialize'
              }
            }
          },
          lang: {
            accessibility: {
              axis: {
                xAxisDescriptionPlural: 'The chart has 3 unlabelled X axes, ' +
                  'one for each series.'
              }
            }
          },
          yAxis: {
            title: {
              // text: 'Height Above Sea Level',
              x: -40
            },
            labels: {
              format: '{value:,.0f}'
            },
            gridLineDashStyle: 'Dash'
          },
          xAxis: [{
            visible: false
          }, {
            visible: false
          }, {
            visible: false
          }],
          plotOptions: {
            area: {
              depth: 100,
              marker: {
                enabled: false
              },
              states: {
                inactive: {
                  enabled: false
                }
              }
            }
          },
          // tooltip: {
          //   valueSuffix: ' MAMSL'
          // },
          credits: {
            enabled: false,
          },
          // series: [{
          //   name: 'Tatra Mountains visible from Rusinowa polana',
          //   lineColor: 'rgb(180,90,50)',
          //   color: 'rgb(200,110,50)',
          //   fillColor: 'rgb(200,110,50)',
          //   data: [
          //     ['Murań', 1890],
          //     ['Nowy Wierch', 2009],
          //     ['Hawrań', 2152],
          //     ['Płaczliwa Skała', 2142],
          //     ['Szalony Wierch', 2061],
          //     ['Karczmarski Wierch', 1438],
          //     ['Jagnięcy Szczyt', 2230],
          //     ['Czerwona Turnia', 2284],
          //     ['Kołowy Szczyt', 2418],
          //     ['Czarny Szczyt', 2429],
          //     ['Baranie Rogi', 2526],
          //     ['Śnieżny Szczyt', 2465],
          //     ['Lodowy Szczyt', 2627],
          //     ['Lodowa Kopa', 2602],
          //     ['Szeroka Jaworzyńska', 2210],
          //     ['Horwacki Wierch', 1902],
          //     ['Spismichałowa Czuba', 2012],
          //     ['Zielona Czuba', 2130],
          //     ['Wielicki Szczyt', 2318],
          //     ['Gerlach', 2655],
          //     ['Batyżowiecki Szczyt', 2448],
          //     ['Kaczy Szczyt', 2395],
          //     ['Zmarzły Szczyt', 2390],
          //     ['Kończysta', 2538],
          //     ['Młynarz', 2170],
          //     ['Ganek', 2462],
          //     ['Wysoka', 2547],
          //     ['Ciężki Szczyt', 2520],
          //     ['Rysy', 2503],
          //     ['Żabi Mnich', 2146],
          //     ['Żabi Koń', 2291],
          //     ['Żabia Turnia Mięguszowiecka', 2335],
          //     ['Wołowa Turnia', 2373]
          //   ]
          // }, {
          //   xAxis: 1,
          //   lineColor: 'rgb(120,160,180)',
          //   color: 'rgb(140,180,200)',
          //   fillColor: 'rgb(140,180,200)',
          //   name: 'Dachstein panorama seen from Krippenstein',
          //   data: [
          //     ['Kufstein', 2049],
          //     ['Hohe Wildstelle', 2746],
          //     ['Kleiner Miesberg', 2173],
          //     ['Großer Miesberg', 2202],
          //     ['Hochstein', 2543],
          //     ['Lackner Miesberg', 2232],
          //     ['Wasenspitze', 2257],
          //     ['Sinabell', 2349],
          //     ['Feister Scharte', 2198],
          //     ['Eselstein', 2556],
          //     ['Landfriedstein', 2536],
          //     ['Scheichenspitz', 2667],
          //     ['Schmiedstock', 2634],
          //     ['Gamsfeldspitze', 2611],
          //     ['Edelgriess', 2305],
          //     ['Koppenkarstein', 2863],
          //     ['Niederer Gjaidstein', 2483],
          //     ['Hoher Gjaidstein', 2794],
          //     ['Hoher Dachstein', 2995],
          //     ['Niederer Dachstein', 2934],
          //     ['Hohes Kreuz', 2837],
          //     ['Hoher Ochsenkogel', 2513]
          //   ]
          // }, {
          //   xAxis: 2,
          //   lineColor: 'rgb(200, 190, 140)',
          //   color: 'rgb(200, 190, 140)',
          //   fillColor: 'rgb(230, 220, 180)',
          //   name: 'Panorama from Col Des Mines',
          //   data: [
          //     ['Combin de la Tsessette', 4141],
          //     ['Grand Combin de Grafeneire', 4314],
          //     ['Combin de Corbassière', 3716],
          //     ['Petit Combin', 3672],
          //     ['Pointe de Boveire', 3212],
          //     ['Grand Aget', 3133],
          //     ['Mont Rogneux', 3084],
          //     ['Dents du Grand Lé', 2884],
          //     ['Monts Telliers', 2951],
          //     ['Grand Golliat', 3238],
          //     ['Mont Grande Rochère', 3326],
          //     ['Mont de la Fouly', 2871],
          //     ['Tête de la Payanne', 2452],
          //     ['Pointe Allobrogia', 3172],
          //     ['Six Blanc', 2334],
          //     ['Mont Dolent', 3820],
          //     ['Aiguille de Triolet', 3870],
          //     ['Le Tour Noir', 3836],
          //     ['Aiguille de l\'A Neuve', 3753],
          //     ['Aiguille d\'Argentière', 3900],
          //     ['Aiguille du Chardonnet', 3824],
          //     ['Aiguille du Tour', 3540],
          //     ['Aiguille du Pissoir', 3440],
          //     ['Le Catogne', 2598],
          //     ['Pointe de Prosom', 2762],
          //     ['Pointe Ronde', 2700],
          //     ['Mont Buet', 3096],
          //     ['Le Cheval Blanc', 2831],
          //     ['Pointe de la Finive', 2838],
          //     ['Pic de Tenneverge', 2985],
          //     ['Pointe d\'Aboillon', 2819],
          //     ['Tour Sallière', 3220],
          //     ['Le Dôme', 3138],
          //     ['Haute Cime', 3257],
          //     ['Pierre Avoi', 2473],
          //     ['Cime de l\'Est', 3178]
          //   ]
          // }]
          series: [{
            name: data && data?.series[0]?.name,
            lineColor: 'rgb(180,90,50)',
            color: 'rgb(200,110,50)',
            fillColor: 'rgb(200,110,50)',
            data: data && data?.series[0]?.data.map((name, index) => ([
              name,
              data && data?.series[1]?.data[index]
            ]))
          }]
        }
        break;
      case 'geomap':
        if (!topology) return {};
        chartData = {
          chart: { map: topology },
          title: { text: data.title || '', },
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
            name: data && data?.series[0]?.name,
            data: data && data?.series[0]?.data.map((name, index) => ([
              name,
              data && data?.series[1]?.data[index]
            ])),
            states: { hover: { color: '#2BD925' } },
            dataLabels: { enabled: true, format: '{point.name}' }
          }]
        }
        break;
      case 'column':
        const pointEvent4 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }
        chartData = {
          chart: {
            type: 'column',
          },
          title: {
            text: data.title || '',
          },
          tooltip: {
            shared: true,
          },
          credits: {
            enabled: false,
          },
          xAxis: { categories: data && data.xAxis[0].categories },
          yAxis: [
            {
              min: 0,
              title: {
                text: null,
              },
            },
            {
              opposite: true,
              title: {
                text: null,
              },
            },
          ],
          plotOptions: {
            column: {
              cursor: "pointer",
              point: {
                events: pointEvent4,
              },
              marker: {
                enabled: true,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
            },
          },
          credits: { enabled: false },
          // series: data.series.map(series => ({
          //   name: series.name,
          //   data: series.data,
          // })), 

          series: data.series.filter((series, index) => {
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
      case 'stackarea':
        const pointEvent5 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }
        chartData = {
          chart: {
            type: 'area',
            backgroundColor: "rgba(33,37,41,0.1)",
          },
          title: {
            text: data.title || '',
          },
          tooltip: {
            shared: true,
          },
          credits: {
            enabled: false,
          },
          xAxis: { categories: data && data.xAxis[0].categories },
          legend: {
            shadow: false
          },
          yAxis: [
            {
              min: 0,
              title: {
                text: null,
              },
            },

            {
              opposite: true,
              title: {
                text: null,
              },
            },
          ],
          plotOptions: {
            area: {
              cursor: "pointer",
              point: {
                events: pointEvent5,
              },
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              cursor: "pointer",
              // events: {
              //   click: function () {
              //     const seriesName = data.series.map(
              //       (series) => this.series.name
              //     )[0];
              //     wantedInfo(data.title, this.category, seriesName, this.y);
              //   },
              // },
              marker: {
                lineWidth: 1,
                lineColor: '#666666'
              }
            }
          },
          // series: data.series.map(series => ({
          //   name: series.name,
          //   data: series.data,
          // })),

          series: data.series.filter((series, index) => {
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
        const pointEvent6 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }
        chartData = {
          chart: {
            type: 'bar',
          },
          legend: {
            reversed: true
          },
          title: {
            text: data.title || '',
          },
          tooltip: {
            shared: true,
          },
          credits: {
            enabled: false,
          },
          xAxis: { categories: data && data.xAxis[0].categories },
          yAxis: [
            {
              min: 0,
              title: {
                text: null,
              },
            },
            {
              opposite: true,
              title: {
                text: null,
              },
            },
          ],
          plotOptions: {
            series: {
              cursor: "pointer",
              point: {
                events: pointEvent6,
              },
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                style: {
                  textOutline: false,
                }
              }
            },
            // shadow:false,
          },
          // series: data.series.map(series => ({
          //   name: series.name,
          //   data: series.data,
          // })),

          series: data.series.filter((series, index) => {
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
      case 'radialbar':
        const pointEvent8 = data.drilldown === 'yes' ? {
          click: function () {
            const seriesName = data?.series.map(
              (series) => this.series.name
            )[0];
            wantedInfo(data?.title, this.category, seriesName, this.y);
          }
        } : {
          click: function () {
            alert('Drilldown is not enabled');
          }
        }
        chartData = {
          // colors: ['#FFD700', '#C0C0C0', '#CD7F32'],
          chart: {
            type: 'column',
            inverted: true,
            polar: true
          },
          title: {
            text: data.title || '',
          },
          tooltip: {
            shared: true,
          },
          credits: {
            enabled: false,
          },
          pane: {
            size: '85%',
            innerSize: '40%',
            endAngle: 270
          },
          xAxis: {
            tickInterval: 1,
            labels: {
              align: 'right',
              useHTML: true,
              allowOverlap: true,
              step: 1,
              y: 3,
              style: {
                fontSize: '13px'
              }
            },
            lineWidth: 0,
            gridLineWidth: 0,
            // categories: data && data.xAxis[0].categories
            categories: data.xAxis[0].categories.map((category, index) => `${category} <span class="f16"><span id="flag" class="flag ${index}"></span></span>`)
          },
          yAxis: {
            lineWidth: 0,
            tickInterval: 25,
            reversedStacks: false,
            endOnTick: true,
            showLastLabel: true,
            gridLineWidth: 0
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              borderWidth: 0,
              pointPadding: 0,
              groupPadding: 0.15,
              borderRadius: '50%'
            },
            bar: {
              cursor: "pointer",
              point: {
                events: pointEvent8,
              },
              marker: {
                enabled: true,
                states: {
                  hover: {
                    enabled: true,
                  },
                },
              },
            },
          },
          series: data.series.filter((series, index) => {
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
      default:
        break;
      }
    setchartDatastore(chartData);
  }, [data, topology]);

  return (
    <div>
      <div style={{ width: { width }, height: { height } }}>
        <div id={key} >
          {TableData && (
            <DashboardReport TableData={TableData} />
          )}
          {chartDatastore && (
            <HighchartsReact
              highcharts={Highcharts}
              options={chartDatastore}
              containerProps={{ id: key, style: { height: height } }}
            />
          )}
          {Boxdata && (
            <BoxPreview Boxdata={Boxdata} style={{ height: { height }, width: { width } }} />
          )}
        </div></div></div>
  );
}

export default HighCharts;

