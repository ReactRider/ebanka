import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Bar_LineChartTotalTransaction = ({racunID, chartType}) => {
 const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  

  useEffect(() => {
    
      let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `http://127.0.0.1:8000/api/admin/potrosnja_korisnika_mesecno/${racunID}`,
  headers: { 
    'Authorization': 'Bearer '+window.sessionStorage.getItem('sub_admin_auth_token'), 
  },
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  
        const data = response.data;
        const months = data.map(item => item.month);
        const totals = data.map(item => parseFloat(item.total_spent));
        setLabels(months);
        setValues(totals);
})
.catch((error) => {
  console.log(error);
});




  }, [racunID]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Potrošnja po mesecu',
        data: values,
        backgroundColor: '#3C5E96',
        borderColor: '#3C5E96',
        fill: chartType === 'line' ? false : true,
        tension: 0, 
        pointRadius: 5, 
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `${value} RSD`,
        },
        grid: {
        display: false, 
        },
      },
      x:{
        grid: {
        display: false, 
        },
      }
    },
  };

  return <>



  <h2 style={{color: '#9A616D', marginLeft: '2em'}}>Potrošnja po mesecima</h2>
    {chartType === 'bar' ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
  </>;
}

export default Bar_LineChartTotalTransaction
