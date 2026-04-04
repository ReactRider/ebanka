import React from 'react'
import PieTypeChart from './PieTypeChart';
import { useState,useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';
import '../css/Tabela.css';
import TransactionsBarChart from './TransakcijaCharts';

const SubAdminHomeRacun = () => {
    const banka_id=localStorage.getItem('banka_id');
    const [loading, setLoading]=useState(true);
    const[racuni, setRacuni]=useState([]);
    const[izabranRacun, setIzabranRacun]=useState(false);
    const[izabrnIdRacuna, setIzabranIdRacuna]=useState();
    

    useEffect(()=>{
          let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://127.0.0.1:8000/api/admin/svi-racuni-banke/${banka_id}`,
            headers: { 
                'Authorization': 'Bearer '+window.sessionStorage.getItem("sub_admin_auth_token"), 
            },
            };

            axios.request(config)
            .then((response) => {
            console.log(JSON.stringify(response.data));
            setLoading(false);
            setRacuni(response.data.racuni);
            })
            .catch((error) => {
            console.log(error);
            });

    },[]);

    const handleSelectedAcc=async(racun)=>{
      setIzabranIdRacuna(racun);
      setIzabranRacun(true);
    }

    const closingTransChart=async()=>{
      setIzabranRacun(false);
    }

  return (
    <>
    {loading==true ? <>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-15em' }}>
            <PulseLoader
              color="#9A616D"     
              size={35}           
              margin={8}          
              speedMultiplier={0.5} 
            />
            </div>
    </> : <>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2em'}}>
      <PieTypeChart b_id={banka_id}/>
    </div>
    <div className="tabela-kontejner-user-admin">
    <table class="user-tabela">
      <thead>
        <tr className="red">
          <th className="kolona">ID</th>
          <th className="kolona">Tip</th>
          <th className="kolona">Broj računa</th>
          <th className="kolona">Stanje računa</th>
          <th className="kolona">Kamata</th>
          <th className="kolona">Dozvoljeni minus</th>
          <th className="kolona">Odrzavanje</th>
          <th className="kolona">Korisnik</th>
        </tr>
      </thead>
      <tbody>
        {racuni.map(r => (
          <tr key={r.id} className="red-sub-admin" onClick={()=>{handleSelectedAcc(r.id)}}>
            <td >{r.id}</td>
            <td >{r.tip}</td>
            <td >{r.detalji.broj_racuna}</td>
            <td >{r.detalji.stanje_racuna}{r.detalji.valuta == null ? ' RSD' : ` ${r.detalji.valuta}`}</td>
            <td >{r.detalji.kamata != null ? `${r.detalji.kamata}%` : '/'}</td>
            <td >{r.detalji.dozvoljeni_minus != null ? `${r.detalji.dozvoljeni_minus} RSD` : '/'}</td>
            <td >{r.detalji.odrzavanje != null ? `${r.detalji.odrzavanje} RSD` : '/'}</td>
            <td >{r.user.ime} {r.user.prezime}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    
    </>}
    {izabranRacun && <>
    <div>
    </div>
    <TransactionsBarChart accountId={izabrnIdRacuna} closing={closingTransChart}/></>}
    </>   

  )
}

export default SubAdminHomeRacun
