import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { PulseLoader } from 'react-spinners';
import {SlActionRedo, SlActionUndo} from 'react-icons/sl';
import { IoCloseCircle } from 'react-icons/io5';
import '../css/Charts.css';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const months = [
  'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
  'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
];

const TransactionsBarChart = ({ accountId, closing }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyCounts, setMonthlyCounts] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;
    const fetchTransactions = async () => {


      try {
        setLoading(true);


        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:8000/api/admin/izvrsene-transakcije/${accountId}`,
        headers: { 
            'Authorization': 'Bearer '+window.sessionStorage.getItem("sub_admin_auth_token"), 
        },
        };

        axios.request(config)
        .then((response) => {
        console.log(JSON.stringify(response.data));

            
        const transactions = response.data.transakcije;

        const filtered = transactions.filter(tx => {
          const date = new Date(tx.datum);
          return date.getFullYear() === year;
        });

        const counts = Array(12).fill(0);
        filtered.forEach(tx => {
          const month = new Date(tx.datum).getMonth(); // 0-11
          counts[month]++;
        });

        setMonthlyCounts(counts);



        })
        .catch((error) => {
        console.log(error);
        });

      } catch (error) {
        console.error('Greška pri učitavanju transakcija:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId, year]);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Broj transakcija',
        data: monthlyCounts,
        backgroundColor: '#3C5E96',
        borderRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        font: { size: 16 },
      },
    },
      scales: {
    x: {
      ticks: {
        font: {
          size: 14,
          weight: 'bold',
        },
        color: '#333',
      },
      grid: {
      display: false, 
    },
    },
    y: {
      ticks: {
        font: {
          size: 14,
          weight: 'bold',
        },
        color: '#333',
        beginAtZero: true,
        stepSize: 1,
      },
      grid: {
      display: false, 
    },
    },
    
  },
  };

  return (
    <>
    <div className='izgled-iza-transakcija-bara'></div>
    <div className='centriranje-transakcija-bar'>
    <div style={{  margin: '0 auto', paddingRight: '1em', paddingLeft: '1em' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
       <button
    onClick={() => closing()}
    style={{
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
    }}
    aria-label="Zatvori"
  >
    {<IoCloseCircle size={30}/>}
  </button>
        <button onClick={() => setYear(prev => prev - 1)} style={{ marginRight: '10px', border: 'none', backgroundColor: 'white' }}>
          {<SlActionUndo size={30}/>}
        </button>
        <h2 style={{ margin: 0 }}>Transakcije po mesecima za {year}</h2>
        <button onClick={() => setYear(prev => prev + 1)} style={{ marginLeft: '10px', border: 'none', backgroundColor: 'white'}}>
          {<SlActionRedo size={30}/>}
        </button>
      </div>

      {loading ? (
       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-5em' }}>
      <PulseLoader
        color="#9A616D"     
        size={35}           
        margin={8}          
        speedMultiplier={0.5} 
      />
    </div>
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
    </div>
    </>
  );
};

export default TransactionsBarChart;