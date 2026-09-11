import React from 'react'
import {useState, useEffect } from 'react';
import "../css/MenjKupovinaProdaja.css";
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import ConfirmModal from './ConfirmModal';
import PopUp from './PopUp';

const MenjKupovinaProdaja = ({action}) => {
  const [toBuy, setToBuy] = useState(null);
  const [devizniRacuni, setDevizniRacuni] = useState([]);
  const [tekuciRacuni, setTekuciRacuni] = useState([]);

  const [selectedDevizni, setSelectedDevizni] = useState({
    broj_racuna:'',
    stanje_racuna:'',
    valuta:''
  });

  const [selectedTekuci, setSelectedTekuci] = useState({
    broj_racuna:'',
    stanje_racuna:''
  });

  const [iznos, setIznos] = useState("");
  const[loading, setLoading]=useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [transactionDone, setTransactionDone] = useState(false);

  useEffect( () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://127.0.0.1:8000/api/korisnik/bankovni-racuni`,
      headers: {
        'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
      },
    };

    axios.request(config)
    .then( (res) => {
      let devizni_niz = [];
      let tekuci_niz = [];

      res.data.racuni.map( (racun) => {
        if(racun.tip === "devizni")
          devizni_niz.push(racun);
        else if(racun.tip === "tekuci")
          tekuci_niz.push(racun);
      })

      setDevizniRacuni(devizni_niz);
      setTekuciRacuni(tekuci_niz);
      setLoading(false);
    })
    .catch( (e) => {
      console.log("Nastala je greska: " + e);
    });

    if(action == "buy")
      setToBuy(true);
    else if(action == "sell")
      setToBuy(false);

  }, []);

  const handleSaRacuna = (e) => {
    if(e.target.name === "combo-sa-racuna-devizni") {
      let newData = selectedDevizni;
      newData.broj_racuna = e.target.value.split('/')[0];
      newData.stanje_racuna = e.target.value.split('/')[1];
      newData.valuta = e.target.value.split('/')[2];

      setSelectedDevizni(newData);
    } else if(e.target.name === "combo-sa-racuna-tekuci") {
      let newData = selectedTekuci;
      newData.broj_racuna = e.target.value.split('/')[0];
      newData.stanje_racuna = e.target.value.split('/')[1];

      setSelectedTekuci(newData);
    }
  }

  const handleNaRacun = (e) => {
    if(e.target.name === "combo-na-racun-tekuci") {
      let newData = selectedTekuci;
      newData.broj_racuna = e.target.value.split('/')[0];
      newData.stanje_racuna = e.target.value.split('/')[1];

      setSelectedTekuci(newData);
    } else if(e.target.name === "combo-na-racun-devizni") {
      let newData = selectedDevizni;
      newData.broj_racuna = e.target.value.split('/')[0];
      newData.stanje_racuna = e.target.value.split('/')[1];
      newData.valuta = e.target.value.split('/')[2];

      setSelectedDevizni(newData);
    }
  }

  const handleIznos = (e) => {
    setIznos(e.target.value);
  }

  const handlePotvrdiMenjacnica = () => {

    if(!toBuy) {
      if(selectedDevizni.broj_racuna === '' || selectedTekuci.broj_racuna === ''){
        setPopupMessage("Izaberite željene račune!");
        return;
      }
      if(iznos === '') {
        setPopupMessage("Unesite željeni iznos!");
        return;
      }

      if(Number(iznos) <= 0) {
        setPopupMessage("Iznos mora biti pozitivan broj!");
        return;
      }
      if(Number(iznos) > Number(selectedDevizni.stanje_racuna)) {
        setPopupMessage("Nemate dovoljno sredstava na deviznom racunu!");
        return;
      }

      setShowConfirm(true);
      return;
    } else if(toBuy) {
      if(selectedDevizni.broj_racuna === '' || selectedTekuci.broj_racuna === ''){
        setPopupMessage("Izaberite željene račune!");
        return;
      }
      if(iznos === '') {
        setPopupMessage("Unesite željeni iznos!");
        return;
      }

      if(Number(iznos) <= 0) {
        setPopupMessage("Iznos mora biti pozitivan broj!");
        return;
      }

      setShowConfirm(true);
    }
  }

  const izvrsiTransakciju = () => {
    setShowConfirm(false);

    if(!toBuy) {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:8000/api/korisnik/kursna-lista/${selectedDevizni.valuta}`,
        headers : {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
        }
      }

      axios.request(config)
      .then( (res) => {
        let temp_stanje = selectedTekuci.stanje_racuna;
        let konvertovani_iznos = Number(iznos) * res.data.exchange_sell;
        temp_stanje = Number(temp_stanje) + Number(konvertovani_iznos);

        let newDataTekuci = selectedTekuci;
        newDataTekuci.stanje_racuna = temp_stanje;
        setSelectedTekuci(newDataTekuci);

        let newDataDevizni = selectedDevizni;
        newDataDevizni.stanje_racuna = Number(newDataDevizni.stanje_racuna) - Number(iznos);
        setSelectedDevizni(newDataDevizni);

      let config_2 = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:8000/api/korisnik/tekuci_racun/${selectedTekuci.broj_racuna}/${selectedTekuci.stanje_racuna}`,
        headers : {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
        }
      }

      axios.request(config_2)
      .then( (res) => {
        console.log("Uspesno povecano stanje tekuceg!");
      })

      let config_3 = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:8000/api/korisnik/devizni_racun/${selectedDevizni.broj_racuna}/${selectedDevizni.stanje_racuna}`,
        headers : {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
        }
      }

      axios.request(config_3)
      .then( (res) => {
        console.log("Uspešno smanjeno stanje deviznog!");
      })

      setPopupMessage("Uspešno izvršena transakcija! Devizni => Tekući");
      setTransactionDone(true);
    })
  } else if(toBuy) {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://127.0.0.1:8000/api/korisnik/kursna-lista/${selectedDevizni.valuta}`,
      headers : {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
      }
    }

    axios.request(config)
    .then( (res) => {
      let temp_stanje = selectedDevizni.stanje_racuna;
      temp_stanje = Number(temp_stanje) + Number(iznos);

      let newDataDevizni = selectedDevizni;
      newDataDevizni.stanje_racuna = temp_stanje;
      setSelectedDevizni(newDataDevizni);

      let newDataTekuci = selectedTekuci;
      if(Number(iznos) * res.data.exchange_buy > Number(selectedTekuci.stanje_racuna)) {
        setPopupMessage("Nemate dovoljno sredstava na tekućem racunu!");
        return;
      }

      newDataTekuci.stanje_racuna -= Number(iznos) * res.data.exchange_buy;
      setSelectedTekuci(newDataTekuci);

    let config_2 = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `http://127.0.0.1:8000/api/korisnik/tekuci_racun/${selectedTekuci.broj_racuna}/${selectedTekuci.stanje_racuna}`,
      headers : {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
      }
    }

    axios.request(config_2)
    .then( (res) => {
      console.log("Uspesno smanjeno stanje tekuceg!");
    })

    let config_3 = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `http://127.0.0.1:8000/api/korisnik/devizni_racun/${selectedDevizni.broj_racuna}/${selectedDevizni.stanje_racuna}`,
      headers : {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
      }
    }

    axios.request(config_3)
    .then( (res) => {
      console.log("Uspešno povećano stanje deviznog!");
    })

    setPopupMessage("Uspešno izvršena transakcija! Tekuci => Devizni");
    setTransactionDone(true);
  })
  }
}

  const closePopup = () => {
    setPopupMessage('');
    if(transactionDone) {
      window.location.reload();
    }
  }

  return (
    <>
      {toBuy && (
         <div className="buy main-container-action-menjacnica">

         <div className="sa-racuna-container">

           <div><span style={{fontSize: '1.4em', fontWeight: '400'}}>Sa računa:</span></div>

           <div>
            {loading===true ? <>
               <div >
                <PulseLoader
                  color="#9A616D"
                  size={35}
                  margin={8}
                  speedMultiplier={0.5}
                />
              </div>
            </> : <>
              {tekuciRacuni == null ? <></> : tekuciRacuni.length === 0 ?
             <h3> Nema tekućih računa</h3> :
             <select defaultValue="" onChange={(e)=>{handleSaRacuna(e)}} name="combo-sa-racuna-tekuci" className="combo-menjacnica">
                 <option value="" disabled>Izaberite račun</option>
               {tekuciRacuni == null ? <></> :

                 tekuciRacuni.map( (racun) => (
                   <option style={{textTransform: 'capitalize'}} key={racun.id} value={`${racun.detalji.broj_racuna}/${racun.detalji.stanje_racuna}`}>
                    {racun.banka.naziv} / {racun.detalji.broj_racuna} / {racun.detalji.stanje_racuna}RSD
                   </option>
                 ))
               }
             </select>
             }
            </>}

           </div>

         </div>

         <div className="na-racun-container">

           <div><span style={{fontSize: '1.4em', fontWeight: '400'}}>Na račun:</span></div>

           <div>
            {loading===true ? <>
              <div >
                <PulseLoader
                  color="#9A616D"
                  size={35}
                  margin={8}
                  speedMultiplier={0.5}
                />
              </div>
            </> : <>
              { devizniRacuni == null ? <></> : devizniRacuni.length === 0 ?
              <h3> Nema deviznih računa</h3> :
             <select defaultValue="" onChange={(e)=>{handleNaRacun(e)}} name="combo-na-racun-devizni" className="combo-menjacnica">
                 <option value="" disabled>Izaberite račun</option>
               {devizniRacuni == null ? <></> :

                 devizniRacuni.map( (racun) => (
                   <option style={{textTransform: 'capitalize'}} key={racun.id} value={`${racun.detalji.broj_racuna}/${racun.detalji.stanje_racuna}/${racun.detalji.valuta}`}>
                     {racun.banka.naziv} / {racun.detalji.broj_racuna} / {racun.detalji.stanje_racuna}{racun.detalji.valuta}
                   </option>
                 ))
               }
             </select>
             }
            </>}

           </div>

         </div>

         <div className="iznos-menjacnica-container">
           <div>
             <input type="number" min="1" max="100000"step="100" onChange={(e)=>{handleIznos(e)}} className="iznos-input-menjacnica" placeholder="Iznos" />
           </div>

           <div>
             <select style={{fontSize:'1.1em', cursor:'pointer'}}>
               <option>{selectedDevizni.valuta == null ? <></> : selectedDevizni.valuta}</option>
             </select>
           </div>

           <div>
             <button onClick={()=>{handlePotvrdiMenjacnica()}} className="btn-potvrdi-menjacnica">Potvrdi</button>

           </div>
         </div>
       </div>

      )}

      {!toBuy && (
        <div className="sell main-container-action-menjacnica">

          <div className="sa-racuna-container">

            <div><span style={{fontSize: '1.4em', fontWeight: '400'}}>Sa računa:</span></div>

            <div>
              {loading===true ? <>
                <div >
                <PulseLoader
                  color="#9A616D"
                  size={35}
                  margin={8}
                  speedMultiplier={0.5}
                />
              </div>
              </> : <>
                {devizniRacuni == null ? <></> : devizniRacuni.length === 0 ?
              <h3> Nema deviznih računa</h3> :
              <select defaultValue="" onChange={(e)=>{handleSaRacuna(e)}} name="combo-sa-racuna-devizni" className="combo-menjacnica">
                  <option value="" disabled>Izaberite račun</option>
                {devizniRacuni == null ? <></> :

                  devizniRacuni.map( (racun) => (
                    <option style={{textTransform: 'capitalize'}} key={racun.id} value={`${racun.detalji.broj_racuna}/${racun.detalji.stanje_racuna}/${racun.detalji.valuta}`}>
                        {racun.detalji.broj_racuna} / {racun.detalji.stanje_racuna}{racun.detalji.valuta} /  {racun.banka.naziv}
                    </option>
                  ))
                }
              </select>
              }
              </>}

            </div>

          </div>

          <div className="na-racun-container">

            <div><span style={{fontSize: '1.4em', fontWeight: '400'}}>Na račun:</span></div>

            <div>
              {loading===true ? <>
                <div >
                <PulseLoader
                  color="#9A616D"
                  size={35}
                  margin={8}
                  speedMultiplier={0.5}
                />
              </div>
              </> : <>
              { tekuciRacuni == null ? <></> : tekuciRacuni.length === 0 ?
               <h3> Nema tekućih računa</h3> :
              <select defaultValue="" onChange={(e)=>{handleNaRacun(e)}} name="combo-na-racun-tekuci" className="combo-menjacnica">
                  <option value="" disabled>Izaberite račun</option>
                {tekuciRacuni == null ? <></> :

                  tekuciRacuni.map( (racun) => (
                    <option style={{textTransform: 'capitalize'}} key={racun.id} value={`${racun.detalji.broj_racuna}/${racun.detalji.stanje_racuna}`}>
                       {racun.banka.naziv} / {racun.detalji.broj_racuna} / {racun.detalji.stanje_racuna}RSD
                    </option>
                  ))
                }
              </select>
              }
              </>}

            </div>

          </div>

          <div className="iznos-menjacnica-container">
            <div>
              <input type="number" min="1" max="100000" step="100" onChange={(e)=>{handleIznos(e)}} className="iznos-input-menjacnica" placeholder="Iznos" />
            </div>

            <div>
              <select className="valuta-menjacnica" >
                <option>{selectedDevizni == null ? <></> : selectedDevizni.valuta}</option>
              </select>
            </div>

            <div>
              <button onClick={()=>{handlePotvrdiMenjacnica()}} className="btn-potvrdi-menjacnica">Potvrdi</button>

            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          title="Potvrda transakcije"
          message="Da li ste sigurni da želite da izvršite ovu transakciju?"
          confirmText="Potvrdi"
          cancelText="Odustani"
          onConfirm={izvrsiTransakciju}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {popupMessage && <PopUp closeMessageBox={closePopup} messageText={popupMessage} />}

    </>
  )
}

export default MenjKupovinaProdaja
