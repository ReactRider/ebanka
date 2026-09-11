import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/NewAcc.css';
import PopUp from './PopUp.jsx';
import { PulseLoader } from 'react-spinners';

const CreateNewAcc = ({tipRacuna}) => {

    const[loading, setLoading]=useState(true);

    const lokacija = useLocation();
    const user = lokacija.state.ID;
    const[isCreacted, setIsCreated]=useState(false);
    const[izabranKorisnik, setIzabranKorisnik]=useState({
        id:'',
        ime:"",
        prezime:'',
        datum_rođenja:'',
        adresa:'',
        grad:'',
        maticni_broj:'',
        email:'',
        broj_licne_karte:'',
        broj_telefona:'',
        drzava:''
    });
    const[banke, setBanke]=useState([{
        id:'',
        naziv:'',
        grad:'',
        broj_dozvole:''
    }]);
    let opcijeRadioButton=['EUR','CAD','USD','CHF','JPY','RUB','CNY','GBP'];
    const[selectedOption, setSelectedOption]=useState();
    const [invalidData, setInvalidData] = useState(false);

    const[racunaDetalji, setRacunDetalji]=useState({
        user_id:'',
        banka_id:'',
        broj_racuna:'',
        stanje_racuna:'',
        odrzavanje:'',

        kamata:'',
        dozvoljeni_minus:'' ,

        valuta:'',

        tip_stednje:''

   });


    useEffect(()=>{
        let configU = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://127.0.0.1:8000/api/admin/korisnici/${user}`,
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('admin_auth_token'), 
            
            },
            
          };
          
          axios.request(configU)
          .then((response) => {
            setLoading(false);
            setIzabranKorisnik(response.data.users);
          })
          .catch((error) => {
            console.log(error);
          });


          let configB = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/admin/banke',
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('admin_auth_token'), 
            
            },
           
          };
          
          axios.request(configB)
          .then((response) => {
            setBanke(response.data.banke);
          })
          .catch((error) => {
            console.log(error);
          });
    },[])

const handleOption=(e)=>{
    setSelectedOption(e.target.value);
}

const handleInput=(e)=>{
    const{name, value}=e.target;
    setRacunDetalji(prev=>({
        ...prev,
        [name]:value
    }))
}

const sredjivanjePodataka = () => {
    const data = { ...racunaDetalji };
    data.user_id=izabranKorisnik.id;

    if(tipRacuna === 'studentski'){
        delete data.odrzavanje;
        delete data.kamata;
        delete data.dozvoljeni_minus;
        delete data.valuta;
        delete data.tip_stednje;
    }

    if(tipRacuna === 'tekuci'){
        delete data.valuta;
        delete data.tip_stednje;
    }
  
    if (tipRacuna === 'devizni') {
      delete data.kamata;
      delete data.dozvoljeni_minus;
      delete data.tip_stednje;
    }
  
    if (tipRacuna === 'stedni') {
      delete data.valuta;
      delete data.dozvoljeni_minus;
    }

    if(data.stanje_racuna <= 0 || data.kamata <= 0 || data.odrzavanje <= 0 || data.dozvoljeni_minus <= 0) {
      setInvalidData(true);
      return null;
    }
  
    return data;
  };

  const closeMessageBox = () => {
    if(isCreacted) {
      setIsCreated(false);
      window.history.back();
    }

    if(invalidData) {
      setInvalidData(false);
    }

}

  const potvrda=()=>{
    
    const konacniPodaci=sredjivanjePodataka();
    if(konacniPodaci == null) {
      return;
    }
    console.log(konacniPodaci);
    
      if(tipRacuna==='tekuci'){
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/admin/kreiranje-tekuci_racun',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('admin_auth_token')
            },
            data : konacniPodaci
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            setIsCreated(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if(tipRacuna==='devizni'){
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/admin/kreiranje-devizni_racun',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('admin_auth_token')
            },
            data : konacniPodaci
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            setIsCreated(true);
          })
          .catch((error) => {
            console.log(error);
          });  
      }

      if(tipRacuna==='stedni'){
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/admin/kreiranje-stedni_racun',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('admin_auth_token')
            },
            data : konacniPodaci
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            setIsCreated(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if(tipRacuna==='studentski'){
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/admin/kreiranje-studentski_racun',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('admin_auth_token')
            },
            data : konacniPodaci
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            setIsCreated(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
            
  }




  return (
    <div className='telo-container-forma'>
        {loading===true ? <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-15em' }}>
            <PulseLoader
              color="#9A616D"     
              size={35}           
              margin={8}          
              speedMultiplier={0.5} 
            />
            </div>
        </> :
         <>
      <div className="forma-racun">


        <div className='user'>
          <p className='tekst'>Korisnik</p>
          <div className='container-korisnik-first'> 

            <div className='container-korisnik-first-first-group'> 
              <label for={izabranKorisnik.ime} className='tekst'>Ime: </label>
              <input className='polja-korisnik' disabled value={izabranKorisnik.ime} id={izabranKorisnik.ime}/>
            </div>

            <div className='container-korisnik-first-second-group'>
              <label for={izabranKorisnik.prezime} className='tekst'>Prezime:</label>
              <input className='polja-korisnik' disabled value={izabranKorisnik.prezime} id={izabranKorisnik.prezime} />
            </div>

          </div>

          <div className='container-korisnik-first'>
            
            <div className='container-korisnik-first-first-group'> 
              <label for={izabranKorisnik.datum_rođenja} className='tekst'>Datum rođenja:</label>
              <input className='polja-korisnik' disabled value={izabranKorisnik.datum_rođenja} id={izabranKorisnik.datum_rođenja} type='date'/>
            </div> 

            <div className='container-korisnik-first-second-group'> 
              <label className='tekst' for={izabranKorisnik.broj_telefona}>Broj telefona:</label>
              <input className='polja-korisnik' disabled value={izabranKorisnik.broj_telefona} id={izabranKorisnik.broj_telefona} />
            </div>

          </div>

          <div className='container-korisnik-second'>
            <div>
              <label className='tekst' for={izabranKorisnik.adresa}>Adresa: </label>
            </div>
            
            <div>
              <input className='polja-korisnik-a' disabled value={izabranKorisnik.adresa} id={izabranKorisnik.adresa}/>
            </div>
          </div>
        
        </div>

        <div className='container-korisnik-second' style={{marginLeft: '1em'}}> 
        
          <label className='tekst' for="banka">Banka</label>
        <select className='polja-korisnik-a' id="banka" style={{marginLeft:'1em'}} name='banka_id' onChange={(e)=>handleInput(e)}>
              <option>/</option>
          {banke.map((b,index)=>{
              return <option  key={index} value={b.id}>{b.naziv+",  "+b.broj_dozvole}</option>
          })}
        </select>
        
        </div>

        <div>
            
          <div className='user'>
            
            <p className="tekst">Detalji računa</p>
            
            <div className='detalji-container'>
              <div className="detalji-one-row">
                <label className='tekst' for={racunaDetalji.broj_racuna}>Broj računa:</label>
                <input name='broj_racuna' className='polje-detalji' value={racunaDetalji.broj_racuna} id={racunaDetalji.broj_racuna} onChange={(e)=>handleInput(e)}/>
              </div>

              <div className="detalji-one-row">             
                <label className='tekst' for={racunaDetalji.stanje_racuna}>Stanje na računu:</label> 
                <input name='stanje_racuna' className='polje-detalji' value={racunaDetalji.stanje_racuna} id={racunaDetalji.stanje_racuna} onChange={(e)=>handleInput(e)}/>
              </div>

            {tipRacuna==='tekuci' ? <>
              <div className="detalji-one-row">             
                <label className='tekst' for={racunaDetalji.kamata}>Kamata:</label>
                <input name='kamata' value={racunaDetalji.kamata} id={racunaDetalji.kamata} className='polje-kamata' onChange={(e)=>handleInput(e)}/>%
              </div>

              <div className="detalji-one-row">             
                <label className='tekst' for={racunaDetalji.odrzavanje}>Održavanje:</label> 
                <input name='odrzavanje' value={racunaDetalji.odrzavanje} className='polje-detalji' id={racunaDetalji.odrzavanje} onChange={(e)=>handleInput(e)}/>
              </div>

              <div className="detalji-one-row">             
                <label className='tekst'>Dozvoljeni minus:</label>
                <input name='dozvoljeni_minus' value={racunaDetalji.dozvoljeni_minus} id={racunaDetalji.dozvoljeni_minus} className='polje-detalji' onChange={(e)=>handleInput(e)}/>
              </div>

            </> : <>
              {tipRacuna==='devizni' ? <>
                    <div className="detalji-one-row">             
                      <label for={racunaDetalji.odrzavanje} className='tekst'>Održavanje:</label>
                      <input name='odrzavanje' className='polje-detalji' id={racunaDetalji.odrzavanje} onChange={(e)=>handleInput(e)}/>
                    </div>

                  <p className='tekst'>Valuta:
                      <div className='radio-button-container'>
                          <div className='radio-container-first-group'>
                      {opcijeRadioButton.map((opt, index)=>{
                          if(index < 4){
                              return <div className='radio-one-container'>
                                <label for={index} key={index}>{opt}</label>
                                <input onChange={(e)=>handleInput(e)} className='polje-detalji' type='radio' name='valuta' id={index} value={opt} onClick={(e)=>handleOption(e)}/>
                              </div>
                          }
                      })}
                      </div>
                      <div className='radio-container-second-group'>
                      {opcijeRadioButton.map((o, index)=>{
                          if(index>=4){
                              return <div className='radio-one-container'>
                                <label for={index} key={index}>{o}</label>
                                <input id={index} onChange={(e)=>handleInput(e)} className='polje-detalji' type='radio' name='valuta' value={o} onClick={(e)=>handleOption(e)}/></div>
                          }
                      })}
                      </div>
                      </div>
                  </p>
                
              </> : <>
                  {tipRacuna==='stedni' ? <>
                      <div className="detalji-one-row">             
                        <label className='tekst' for={racunaDetalji.tip_stednje}>Tip štednje:</label>
                        <select className='polje-detalji-stednja' name='tip_stednje' id={racunaDetalji.tip_stednje} onChange={(e)=>handleInput(e)} >
                            <option>/</option>
                            <option value='orocena'>Oročena štednja</option>
                            <option value='po vidjenju'>Štednja po viđenju</option>
                        </select>
                      </div>

                      <div className="detalji-one-row">             
                        <label for={racunaDetalji.kamata} className='tekst'>Kamata:</label> 
                        <input name='kamata' value={racunaDetalji.kamata} id={racunaDetalji.kamata} onChange={(e)=>handleInput(e)} className='polje-kamata'/>%
                      </div>

                      <div className="detalji-one-row">             
                        <label for={racunaDetalji.odrzavanje} className='tekst'>Održavanje:</label>
                        <input name='odrzavanje' value={racunaDetalji.odrzavanje} id={racunaDetalji.odrzavanje} onChange={(e)=>handleInput(e)} className='polje-detalji'/>
                      </div>
                  </> : <></>}
              </>}
            </>}
        </div>
      
      </div>
      </div>

        <div className='btn-container'>
        <button className={`${tipRacuna === 'devizni' ? "btn-potvrda-devizni" : "btn-potvrda"}`} onClick={potvrda}>Potvrdi</button>
        </div>

      </div>

      {isCreacted && <PopUp closeMessageBox={closeMessageBox} messageText={"Novi račun korisnika je uspešno kreiran!"}/>}
      {invalidData && <PopUp closeMessageBox={closeMessageBox} messageText={"Neispravno popunjen obrazac."} />}
    </>
    }
    </div>
  )
}

export default CreateNewAcc
