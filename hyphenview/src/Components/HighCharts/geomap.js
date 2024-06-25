


import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMap from 'highcharts/modules/map';

HighchartsMap(Highcharts);

const MapChart = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json');
      const topology = await response.json();

      const data = [
        ['madhya pradesh', 10], ['uttar pradesh', 11], ['karnataka', 12], ['nagaland', 13], 
        ['bihar', 14], ['lakshadweep', 15], ['andaman and nicobar', 16], ['assam', 17], 
        ['west bengal', 18], ['puducherry', 19], ['daman and diu', 20], ['gujarat', 21], 
        ['rajasthan', 22], ['punjab', 27], ['haryana', 28], ['andhra pradesh', 29], 
        ['maharashtra', 30], ['himachal pradesh', 31], ['meghalaya', 32], ['kerala', 33], 
        ['telangana', 34], ['mizoram', 35], ['tripura', 36], ['manipur', 37], 
        ['arunanchal pradesh', 38], ['jharkhand', 39], ['goa', 40], ['nct of delhi', 41], 
        ['odisha', 42], ['jammu and kashmir', 43], ['uttarakhand', 45], ['sikkim', 44]
      ];

      Highcharts.mapChart('container', {
        chart: {
          map: topology 
        },
        title: {
          text: 'Test'
        },
        subtitle: {
          text: 'State wise data'
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        plotOptions:{
          series:{
            point:{
              events:{
                click: function(){
                  alert(this.name);
                }
              }
            },
            dataLabels: {
                enabled: true,
                style: {
                  textOutline: false,
                }
            }
          }
        },
        colorAxis: {
          min: 0
        },
        series: [{
          data: data,
          name: 'Total tickets',
          states: {
            hover: {
              color: '#2BD925'
            }
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }]
      });
    };

    fetchData();
  }, []);

  return (
    <div id="container" style={{ height: '600px', width: '100%' }}></div>
  );
};

export default MapChart;
