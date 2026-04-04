import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
import {useState, useEffect} from 'react';
import axios from 'axios';
import '../css/Charts.css';
import { PulseLoader } from 'react-spinners';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


const Charts = ({focusedAcc}) => {
    const [info, setData] = useState([]);
    const [period, setPeriod]=useState('mesecna');
    const [loading, setLoading]=useState(true);

    

    useEffect(()=>{
        if(period==='mesecna'){
            let data = JSON.stringify({
                "racun_id": focusedAcc.id
              });
              
              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:8000/api/korisnik/total-amonut/month',
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                },
                data : data 
              };
              
              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                setData(response.data);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
              });
        }

        if(period==='godisnja'){
            let data = JSON.stringify({
                "racun_id": focusedAcc.id
              });
              
              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:8000/api/korisnik/total-amonut/year',
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                },
                data : data
              };
              
              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                setData(response.data);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
              });
        }

        if(period==='kvartalna'){
            let data = JSON.stringify({
                "racun_id": focusedAcc.id
              });
              
              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:8000/api/korisnik/total-amonut/quarter',
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                },
                data : data
              };
              
              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                setData(response.data);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
              });
        }
              
    },[period])


const chartData = {
    labels: info.map(d => d.period),
    datasets: [
      {
        label: 'Potrošnja',
        data: info.map(d => d.total_spent),
        backgroundColor: ' #3C5E96',
        borderColor: '#3C5E96',
        
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: period+' potrošnja'
      }
    }
  };

  const [chartType, setChartType] = useState('bar');


  return (
    <>
    {loading===true ? <>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-5em' }}>
      <PulseLoader
        color="#9A616D"     
        size={35}           
        margin={8}          
        speedMultiplier={0.5} 
      />
    </div>
    </> : <>
    
        <div className="body-charts">

    <div className="charts-container">
      <div  className="chart-choose" style={{ marginBottom: '5px' }}>
        <p className="tekst-izbora">Izaberite izgled grafikona</p>
        <button className="chart-button" onClick={() => setChartType('bar')}>Bar Chart</button>
        <button className="chart-button" onClick={() => setChartType('line')}>Line Chart</button>
        <br/>
        <br/>
        <br/>
        <br/>
        <p className="tekst-izbora">Izaberite period za prikazivanje grafikona</p>
        <button className="chart-button" onClick={()=>setPeriod('mesecna')}>Mesečni</button>
        <button className="chart-button" onClick={()=>setPeriod('kvartalna')}>Kvartalni</button>
        <button className="chart-button" onClick={()=>setPeriod('godisnja')}>Godisnji</button>
      </div>

    <div className="secont-chart-container">
      {chartType === 'bar' ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
      </div>
    </div>

    </div>

    </>}
    </>
  )
}

export default Charts
