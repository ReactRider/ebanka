import React, { useEffect } from 'react';
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import '../css/AccountInfo.css';
import axios from 'axios';

const AccountInfoAdmin = ({tip}) => {
    const[loading, setLoading]=useState(true);
    const[adminData, setAdminData]=useState({
        ime: "",
        prezime: "",
        datum_rođenja: "",
        grad: "",
        email: "",
        role: "",
        broj_legitimacije: ""
    });

    useEffect(()=>{
      if(tip=='system'){
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/admin/informacije-o-nalogu-system-admin',
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('admin_auth_token'), 
              
            },
           
          };
          
          axios.request(config)
          .then((response) => {
            setAdminData(response.data.admins);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
        }else{
          let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/admin/informacije-o-nalogu-sub-admin',
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('sub_admin_auth_token'), 
              
            },
           
          };
          
          axios.request(config)
          .then((response) => {
            setAdminData(response.data.admins);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
        }
        
    },[]);
  return (
    <>
        {loading===true ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-5em' }}>
            <PulseLoader
              color="#9A616D"     
              size={35}           
              margin={8}          
              speedMultiplier={0.5} 
            />
          </div> : <>
            <div className="account-info-body">
                <div className="container-info-admin">
                    <div><p>Ime i prezime:</p> <input className="user-data-admin" disabled value={adminData.ime+ " "+adminData.prezime}/></div>
                    <div><p>Datum rodjenja:</p> <input className="user-data-admin" disabled value={adminData.datum_rođenja.split('-')[2]+"/"+adminData.datum_rođenja.split('-')[1]+"/"+adminData.datum_rođenja.split('-')[0]}/></div>
                    <div><p>Email: </p><input className="user-data-admin" disabled value={adminData.email}/></div>
                    <div><p>Grad: </p><input className="user-data-admin" disabled value={adminData.grad}/></div>
                </div>

                <div className="container-info-admin-2">
                    <div><p>Uloga:</p><input className="user-data-admin" disabled value={adminData.role}/></div>
                    <div><p>Broj legitimacije: </p><input className="user-data-admin" disabled value={adminData.broj_legitimacije}/></div>
                </div>
                {tip=='sub' ? <>
                  <div className='container-info-admin-3'>
                    <div><p>Banka za koju imate ovlašćenja:</p><input className='user-data-admin-2' disabled value={adminData.banka_id.naziv+"  ("+adminData.banka_id.broj_dozvole+")"}/></div>
                  </div>
                </> : <></>}
            </div>
          </>} 
    </>
  )
}

export default AccountInfoAdmin
