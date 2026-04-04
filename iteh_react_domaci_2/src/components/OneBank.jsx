import React from 'react'
;import '../css/OneUser.css';
import { useNavigate } from 'react-router-dom';
import PopUp from './PopUp.jsx';
import axios from 'axios';
import {useState, useEffect} from 'react';
import CreateNewBank from './CreateNewBank.jsx';


const OneBank = ({details, closeDetails}) => {
    const [allAccounts, setAllAccounts] = useState([]);
  const [isEverythingDone, setIsEverythingDone] = useState(false);
  const [toModifyBank, setModifyBank] = useState(false);
  const navigate = useNavigate();

  const closeMessageBox = () => {
    setIsEverythingDone(false);
    window.location.reload();
  }


  function handleUserDelete() {
    if (!window.confirm("Da li ste sigurni?")) return;
  
    let config_get_all_accounts = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://127.0.0.1:8000/api/admin/racuni-vezani-za-banku/${details.id}`,
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('admin_auth_token')
      },
    };
  
    axios.request(config_get_all_accounts)
      .then((res) => {
        const racuni = res.data.racuni;
        setAllAccounts(racuni);
  
        const accountIds = racuni.map(acc => acc.id);
  
        let config_delete_accounts_transactions = {
          method: 'delete',
          maxBodyLength: Infinity,
          url: 'http://127.0.0.1:8000/api/admin/obrisi-racune-i-transakcije',
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('admin_auth_token')
          },
          data: { acc_id: accountIds }
        };
  
        return axios.request(config_delete_accounts_transactions);
      })
      .then(() => {
        let config_delete_user = {
          method: 'delete',
          maxBodyLength: Infinity,
          url: `http://127.0.0.1:8000/api/admin/banke/${details.id}`,
          headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('admin_auth_token')
          },
        };
  
        return axios.request(config_delete_user);
      })
      .then(() => {
        console.log("Banka i svi racuni i transakcije su obrisani.");
        setIsEverythingDone(true);
      })
      .catch((e) => {
        console.error("Desila se greska:", e);
      });
  }

  function handleUserModify() {
    navigate('/admin/kreiranje-banke', { state: {toModify: true, details}});
  }
  
  return (
    <div className='oneBank-container'> 
      <h3 className='naslov'>Detalji izabrane banke</h3>
      <br/>
      <div className="paragraf"><p><span className="span1">ID: </span><span className="span2">{details.id}</span></p></div>
      <div className="paragraf"><p><span className="span1">Naziv: </span><span className="span2">{details.naziv}</span></p></div>
      <div className="paragraf"><p><span className="span1">Grad: </span><span className="span2">{details.grad}</span></p></div>
      <div className="paragraf"><p><span className="span1">Broj dozvole: </span><span className="span2">{details.broj_dozvole}</span></p></div>
      <br/>
      <div className='second-user-container'>
      <button className='closed-btn'  onClick={closeDetails}>Zatvori</button>
      <button className='closed-btn' onClick={handleUserModify}>Izmeni</button>
      <button className='closed-btn' onClick={handleUserDelete}>Obrisi</button>
      </div>

      {isEverythingDone && <PopUp closeMessageBox={closeMessageBox} messageText={"Banka je uspešno obrisana."} />}

      {toModifyBank && <CreateNewBank details={details} />}
    </div>
  )
}

export default OneBank
