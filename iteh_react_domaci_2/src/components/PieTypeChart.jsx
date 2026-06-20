import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../css/Charts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieTypeChart = ({ b_id }) => {
  const [podaci, setPodaci] = useState([]);
     

  useEffect(() => {
    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://127.0.0.1:8000/api/admin/broj-tipova-racuna/${b_id}`,
    headers: { 
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('sub_admin_auth_token')
    },
    };

    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    setPodaci(response.data);
    })
    .catch((error) => {
    console.log(error);
    });

  }, []);

  const labels = podaci.map(item => item.type);
  const dataValues = podaci.map(item => item.ukupno);

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: ['#fb1c4cff', '#0e87d8ff', '#faef2bff', '#3af33aff'],
        hoverOffset: 10
      }
    ]
  };

  const total = podaci.reduce((sum, item) => sum + item.ukupno, 0);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      },
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
          padding: 20,
          font: {
            size: 18
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '650px', height: '650px' }}>
      <h3 className='tekst-naslova-pie'>Statistika raspodela tipova računa izražena u procentima</h3>
      <Pie data={data} options={options}/>
    </div>
  );
};

export default PieTypeChart;