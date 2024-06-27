// Author: Ashish, Piyush
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

  console.log(topology, "topology")

  console.log(PreviewchartData, "PreviewchartData")

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
      case '3D Donut':
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
                      color: '#55BF3B', // green
                      thickness: 20
                  }, {
                      from: 150,
                      to: 200,
                      color: '#DF5353', // red
                      thickness: 20
                  }, {
                      from: 120,
                      to: 160,
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
        options = {
          chart: {
            type: 'area',
            options3d: {
              enabled: true,
              alpha: 15,
              beta: 30,
              depth: 200
            }
          },
          title: { text: CustomeDetailOfReport.title || '' },
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
              text: 'Height Above Sea Level',
              x: -40
            },
            labels: {
              format: '{value:,.0f} MAMSL'
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
          tooltip: {
            valueSuffix: ' MAMSL'
          },
          series: [{
            name: PreviewchartData && PreviewchartData?.series[0].name,
            lineColor: 'rgb(180,90,50)',
            color: 'rgb(200,110,50)',
            fillColor: 'rgb(200,110,50)',
            colorByPoint: true,
            data: PreviewchartData && PreviewchartData?.series[0].data.map((name, index) => ([
              name,
              PreviewchartData && PreviewchartData?.series[1].data[index]
            ]))
          }]
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
