import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/Charts.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const UserYearCharts = ({bid}) => {
    
    const [data, setData] = useState([]);

  useEffect(() => {
    
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `http://127.0.0.1:8000/api/admin/broj-korisnika-godisnje/${bid}`,
  headers: { 
    'Authorization': 'Bearer '+window.sessionStorage.getItem("sub_admin_auth_token"), 
  },
};

axios.request(config)
.then((response) => {
    setData(response.data);
})
.catch((error) => {
  console.log(error);
});
  }, []);



  return (
    <div style={{ width: '70%', height: 550 }}>
      <h3 className='tekst-izbora-centriran'>Godišnji rast broja korisnika</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" vertical={false}/>
          <XAxis dataKey="year" tick={{ fontSize: 16, fill: '#404040', fontWeight: 500}} />
          <YAxis tick={{ fontSize: 16, fill: '#404040', fontWeight: 500}} domain={[0,10]} ticks={[0,1,2,3,4,5,6,7,8,9,10]}/>
          <Tooltip />
          <Line type="linear" dataKey="count" stroke="#3C5E96" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserYearCharts;