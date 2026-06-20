import React, { useEffect, useState } from 'react';
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
    axios.get(`http://127.0.0.1:8000/api/admin/broj-korisnika-mesecno/${bid}`, {
      headers: { Authorization: 'Bearer ' + window.sessionStorage.getItem('sub_admin_auth_token') },
    })
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }, [bid]);

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const yMax = maxCount + 1;
  const yTicks = Array.from({ length: yMax + 1 }, (_, i) => i);

  return (
    <div style={{ width: '70%', height: 550 }}>
      <h3 className='tekst-izbora-centriran'>Broj novih korisnika po mesecu (poslednjih 6 meseci)</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#404040', fontWeight: 500 }} />
          <YAxis
            tick={{ fontSize: 14, fill: '#404040', fontWeight: 500 }}
            domain={[0, yMax]}
            ticks={yTicks}
            allowDecimals={false}
          />
          <Tooltip />
          <Line type="linear" dataKey="count" name="Korisnici" stroke="#3C5E96" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserYearCharts;
