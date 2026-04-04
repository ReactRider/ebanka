import React from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../css/UserAcc.css';
import Bar_LineChartTotalTransaction from './Bar_LineChartTotalTransaction';

const UsersAccPageForAdmin = () => {
    const location=useLocation();
     const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState('');
    const[showBar, setShowBar]=useState(false);
    const[zeljeniId, setZeljeniId]=useState();
    const banka_id=localStorage.getItem('banka_id');
    const user_id=location.state?.user;
    const[choosenChart, setChoosenChart]=useState('bar');
  

  useEffect(() => {
    

    let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `http://127.0.0.1:8000/api/admin/racuni-korisnika-uBanci/${banka_id}/${user_id}`,
  headers: { 
    'Authorization': 'Bearer '+window.sessionStorage.getItem('sub_admin_auth_token'), 
  },
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  const data=response.data.racuni;
  setOptions(data);
  if (data.length > 0) {
          setSelected(data[0].id); 
          setShowBar(true)
          setZeljeniId(data[0].id);
        }
})
.catch((error) => {
  console.log(error);
});


  }, []);

  const handleChange = (e) => {
    setSelected(e.target.value);
    setShowBar(true);
    setZeljeniId(e.target.value);
  };



  return (
    <div className="cela-strana">
       <div className="combo-container">
      <select 
        className="custom-combo" 
        value={selected} 
        onChange={handleChange}
      >
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.tip+" račun,  broj računa: "+option.detalji.broj_racuna}
          </option>
        ))}
      </select>
    </div>
    
  <div className='pozicija-izbora'>
        <label className="tekst-izbora-2" >Tip grafikona: </label>
        <br></br>
          <button className="chart-button-2"  onClick={() => setChoosenChart('bar')}>Bar Chart</button>
          <br></br>
          <button className="chart-button-2"  onClick={() => setChoosenChart('line')}>Line Chart</button>
      </div>
    <div className='centriranje-grafikona'>
    {showBar && <Bar_LineChartTotalTransaction racunID={zeljeniId} chartType={choosenChart}/>}
    </div>
    </div>
  )
}

export default UsersAccPageForAdmin
