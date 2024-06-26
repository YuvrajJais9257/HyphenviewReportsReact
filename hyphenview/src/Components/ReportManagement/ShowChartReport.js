import React, { useEffect, useMemo, useState } from 'react';
import Header from '../header';
import { useDispatch, useSelector } from 'react-redux';
import { generateChartTypeReport } from '../../actions/reportmanagement';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './../globalCSS/SearchTable/SearchTable.module.css';
import { Button } from './../globalCSS/Button/Button';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsExporting from 'highcharts/modules/exporting';
import highchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import 'highcharts/css/highcharts.css';

highchartsExporting(Highcharts);
highchartsOfflineExporting(Highcharts);

const ShowChartReport = () => {
  const containerId = 'highcharts-container';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user data from localStorage
  const user = useMemo(() => JSON.parse(localStorage.getItem("profile")), []);

   // Parse query parameters from the URL
  const queryParameters = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const report_id = queryParameters.get('report_id');
  const access_mask = queryParameters.get('access_mask');
  
  // Retrieve data from Redux store
  const apiData = useSelector((state) => state);
  
  // Dispatch action to generate chart type report
  useEffect(() => {
    dispatch(generateChartTypeReport({ report_id, email: user.user_email_id, database_type: "mysql" }));
  }, [report_id, user.user_email_id, dispatch]);

  // Extract chart detail from the Redux store
  const generatreportdetail = apiData?.reportmanagement?.getcharttypeofreportdetail;

  // Generate chart options based on the retrieved data
  const chartOptions = useMemo(() => {
    if (!generatreportdetail) return {};

    const getChartType = (type) => {
      switch (type) {
        case 'stackarea': return 'area';
        case 'stackbar': return 'bar';
        case 'stackcolumn': return 'column';
        case 'radialBar': return 'bar';
        default: return type;
      }
    };

    const chartType = getChartType(generatreportdetail.chart_type);
     
    // Handle gauge chart type
    if (chartType === 'gauge') {
      return {
        chart: {
          type: 'solidgauge',
        },
        title: {
          text: generatreportdetail.title,
        },
        pane: {
          center: ['50%', '85%'],
          size: '100%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc',
          },
        },
        credits: { enabled: false },
        yAxis: {
          min: 0,
          max: 200,
          tickPixelInterval: 72,
          tickPosition: 'inside',
          labels: {
            distance: 20,
            style: {
              fontSize: '14px',
            },
          },
          plotBands: [
            { from: 0, to: 120, color: '#0B5345', thickness: 40 },
            { from: 120, to: 160, color: '#DDDF0D', thickness: 40 },
            { from: 160, to: 200, color: '#DF5353', thickness: 40 },
          ],
        },
        exporting: {
          enabled: access_mask.includes('p'),
        },
        series: [{
          name: generatreportdetail.series.name,
          data: generatreportdetail.series[0].data,
          dataLabels: {
            format: '{y} km/h',
            style: {
              fontSize: '16px',
            },
          },
          dial: {
            radius: '80%',
            backgroundColor: 'gray',
            baseWidth: 12,
            baseLength: '0%',
            rearLength: '0%',
          },
          pivot: {
            backgroundColor: 'gray',
            radius: 6,
          },
        }],
      };
    }else if (chartType === 'pie') {
      return {
        chart: { type: 'pie' },
        title: { text: generatreportdetail?.title || '' },
        tooltip: { valueSuffix: '%' },
        plotOptions: {
          series: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: [
              { enabled: true, distance: 20 },
              {
                enabled: true,
                distance: -40,
                format: '{point.percentage:.1f}%',
                style: {
                  fontSize: '1.2em',
                  textOutline: 'none',
                  opacity: 0.7,
                },
                filter: {
                  operator: '>',
                  property: 'percentage',
                  value: 10,
                },
              },
            ],
          },
        },
        credits: { enabled: false },
        series: [{
          name: generatreportdetail.series[0].name,
          colorByPoint: true,
          data: generatreportdetail.series[0].data.map((name, index) => ({
            name,
            y: generatreportdetail.series[1].data[index],
          })),
        }],
      };
    }else if(chartType === '3dpie'){
      return {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
          }
        },
        title: {
          text: generatreportdetail?.title || '',
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
            name: generatreportdetail.series[0].name,
            colorByPoint: true,
            data: generatreportdetail && generatreportdetail.series[0].data.map((name, index) => ([
              name,
              generatreportdetail && generatreportdetail.series[1].data[index]
            ]))
          }]
      };
       

    }else if(chartType === '3d donut'){
      return {
        chart: { type: 'pie', options3d: { enabled: true, alpha: 45 } },
        title: { text: generatreportdetail?.title || '', }, accessibility: { point: { valueSuffix: '%' } },
        tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
        credits: { enabled: false },
        plotOptions: { pie: { innerSize: 100, depth: 45 },series: {
          allowPointSelect: true,
          cursor: 'pointer'
          ,} },
        series: [{
          name: generatreportdetail.series[0].name,
          colorByPoint: true,
          data: generatreportdetail && generatreportdetail.series[0].data.map((name, index) => ([
            name,
            generatreportdetail && generatreportdetail.series[1].data[index]
          ]))
        }]
      };

    }
    return {
      chart: { type: chartType },
      title: { text: generatreportdetail.title },
      tooltip: {
        shared: true,
        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
      },
      credits: { enabled: false },
      yAxis: [
        { min: 0, title: { text: 'Values' } },
        { opposite: true, title: { text: 'Time' } },
      ],
      plotOptions: {
        area: {
          pointStart: 1940,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: { enabled: true },
            },
          },
        },
      },
      exporting: { enabled: access_mask.includes('p') },
      xAxis: { categories: generatreportdetail.xAxis.categories },
      series: generatreportdetail.series.map((series) => ({
        name: series.name,
        data: series.data,
      })),
    };
  }, [generatreportdetail, access_mask]);

  return (
    <div>
      <div className='show_table_header'>
        <Header />
      </div>
      <div className="showtablereportgenerator" style={{ margin: "20px" }} id={containerId}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} containerProps={{ id: containerId }} />
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Button type='button' style={{ marginRight: "3px" }} onClick={() => { navigate(-1); }}>Back</Button>
      </div>
    </div>
  );
};

export default ShowChartReport;
