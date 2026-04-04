import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import '../css/AccountInfo.css';
import {Link} from 'react-router-dom';
import {BsPencilFill} from 'react-icons/bs';
import ProfileImageUpload from './ProfileImageUpload';
import { PulseLoader } from 'react-spinners';

const AccountInfo = () => {
    const [info,setInfo]=useState({
      ime:"",
      prezime: "",
      datum_rođenja: "",
      maticni_broj: "",
      email: "",
      broj_telefona: "",
      broj_licne_karte: "",
      adresa: "",
      grad: "",
      drzava: ""
    });

    const [isClicked, setIsClicked]=useState(false);
    const [disabledFil, setDisabledFil]=useState(true);
    const [loading, setLoading]=useState(true);

    useEffect(()=>{
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/korisnik/informacije-o-nalogu',
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'), 
            },
            
          };
          
          axios.request(config)
          .then((response) => {
            setInfo(response.data.users);
            setLoading(false)
          })
          .catch((error) => {
            console.log(error);
          });
    },[]);

    const enableFields = () => {
      setDisabledFil(false);
      setIsClicked(true);
    };

    const handleInput=(e)=>{
      const {name, value}=e.target;
      setInfo((prevData)=>({
        ...prevData,
        [name]: value
      }));

    };

    function changeAccountData(){
      
      let formData={
        email: info.email,
        adresa: info.adresa,
        grad: info.grad
      };

      let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/api/korisnik/izmena-naloga',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
        },
        data : JSON.stringify(formData)
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        window.location.href=window.location.href;
      })
      .catch((error) => {
        console.log(error);
      });
    }



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
      <div className="account-info-body">
      
      <div className="container-image-edit">

        <div className="container-image">
          <ProfileImageUpload update={disabledFil}/>
        </div>
        <div className="container-edit">
        {!isClicked && <button type="button" className="btn-edit" onClick={enableFields}>Izmena podataka   <BsPencilFill style={{marginLeft:'.4em'}}/></button>}
        {isClicked && <button type="button" className="btn-save" onClick={changeAccountData}>Sacuvajte izmene</button>}        
        </div>
      </div>

      
    <div className="container-info">
      
    <div> {info==null ? <></> : (<>Ime i prezime:<p><input className="user-data" type="text"  disabled value={info.ime +" "+ info.prezime} name="ime" /></p></>)}</div>
      <div >{info==null ? <></> : (<>Datum rođenja:<p><input className="user-data" type="text" disabled value={info.datum_rođenja.split('-')[2]+"/"+info.datum_rođenja.split('-')[1]+"/"+info.datum_rođenja.split('-')[0]} name="datum" /></p></>)}</div>
      <div >{info==null ? <></> : (<>Jedinstveni matični broj:<p><input className="user-data" type="text" disabled value={info.maticni_broj} name="maticni_broj" /></p></>)}</div>
      <div >{info==null ? <></> : (<>E-mail:<p><input className={`${disabledFil === true ? "user-data" : "user-data-animation"}`} type="text" disabled={disabledFil} onChange={handleInput} value={info.email} name="email" /></p></>)}</div>
      <div >{info==null ? <></> : (<>Broj telefona:<p><input className="user-data" type="text" disabled value={info.broj_telefona} name="broj_telefona" /></p ></>)}</div> 
      <div >{info==null ? <></> : (<>Broj lične karte:<p><input className="user-data" type="text" disabled value={info.broj_licne_karte} name="licna" /></p></>)}</div>
    </div>
    
    <div className="container-info-2">
     
    <div>{info==null ? <></> : (<>Adresa:<p><input className={`${disabledFil === true ? "user-data" : "user-data-animation"}`} type="text" disabled={disabledFil} onChange={handleInput} value={info.adresa} name="adresa" /></p></>)}</div>
      <div>{info==null ? <></> : (<>Grad:<p><input className={`${disabledFil === true ? "user-data" : "user-data-animation"}`} type="text" disabled={disabledFil} onChange={handleInput} value={info.grad} name="grad" /></p></>)}</div>
      <div>{info==null ? <></> : (<>Država:<p><input className="user-data" type="text" disabled value={info.drzava} name="drzava" /></p></>)}</div>
    </div>
    
    </div>
    </>}
    </>
  )
}

export default AccountInfo
