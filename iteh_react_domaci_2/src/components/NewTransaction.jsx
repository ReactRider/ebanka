import React from 'react';
import '../css/NewTransaction.css';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import PopUp from './PopUp';


const NewTransaction = ({focusedAcc, tip}) => {

    const[internalData, setInternalData]=useState();
    const[failedTransaction, setFailedTransaction]=useState(false);
    let newInternalData=[];
    const [invalidAmount, setInvalidAmount] = useState(false);
    const[loading, setLoading]=useState(true);
  
        useEffect(()=>{
            let data = JSON.stringify(focusedAcc);
          
            let config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: 'http://127.0.0.1:8000/api/korisnik/svi_ostali_racuni',
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
              },
              data : data
            };
            
            axios.request(config)
            .then((response) => {
              setInternalData(response.data.racuni);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
            });
          
        },[]);
          
        
        if(internalData!=null){
            internalData.forEach((i,index)=>{
                if(i.detalji.broj_racuna!==focusedAcc.detalji.broj_racuna){
                    newInternalData[index]=i;
                }
            })
           
        }
    

    const [datum, setDatum] = useState('');
    const [successfulTran, setSuccessfulTran]=useState(false);
    const messageText='Transakcija uspesno izvrsena!';
    const failedTransactionMessage='Interne transakcije nije moguce izvrsiti';
    const navigate=useNavigate();

    // DODATO: stanje za zakazanu (recurring) transakciju
    const [isScheduled, setIsScheduled] = useState(false);
    const [danUMesecu, setDanUMesecu] = useState('');
    const [scheduledSuccess, setScheduledSuccess] = useState(false);
    
  useEffect(() => {
    const d = new Date();
    const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setDatum(formattedDate);
  }, []);

  const [transactionData, setTransactionData]=useState({
    iznos: '',
    broj_racuna_primaoca: '',
    opis_transakcije: '',
    naziv_primaoca: '',
    sifra_placanja: ''
  });

  const [errors, setErrors]=useState({});
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  function handleInput(e){
    let temp=transactionData;
    temp[e.target.name]=e.target.value;
    if(tip==='interna'){
        temp.naziv_primaoca=internalData==null ? '' : internalData[0].user.ime + " "+internalData[0].user.prezime
    }
    setTransactionData(temp);
    setErrors({
        ...errors,
        [e.target.name]: ''
    });
  };

  const handleSelectChangeSifra = (event) => {
    let pom=transactionData;
    pom.sifra_placanja=event.target.value;
    setTransactionData(pom);
  };


  const handleSelectChangeRacun = (e) => {
    let t=transactionData;
    console.log(e.target.value);
    t.broj_racuna_primaoca=e.target.value;
    setTransactionData(t);
  };


  useEffect(()=>{
    if(loading===false && tip==='interna'){
      if(newInternalData.length===0){
        setFailedTransaction(true);
      }
    }
  },[loading])



  function handleNewTransaction(e){
        e.preventDefault();
        let error={};

        const noviDatum=new Date();
        const h=noviDatum.getHours();
        const m=noviDatum.getMinutes();
        const s=noviDatum.getSeconds();
        const time=`${h}:${m}:${s}`;
        let id;
        let type;

         
            if(!isScheduled && focusedAcc.detalji.stanje_racuna < transactionData.iznos) {
              setInsufficientFunds(true);
              return;
            }

            if(transactionData.iznos <= 0) {
              setInvalidAmount(true);
              return;
            }


        if(!isScheduled && tip ==='interna'){
            newInternalData.forEach((d, index)=>{
                if(d.detalji.broj_racuna===transactionData.broj_racuna_primaoca){
                    id=d.detalji.id;
                    type=d.tip;
                }
            },[]); 

            switch(type){
                case 'tekuci':
                    let dataPromenaTekuci = JSON.stringify({
                        "iznos": transactionData.iznos,
                      });
                      let configPT = {
                        method: 'patch',
                        maxBodyLength: Infinity,
                        url: `http://127.0.0.1:8000/api/korisnik/promena-tekuceg-stanja-racuna/${id}`,
                        headers: { 
                          'Content-Type': 'application/json', 
                          'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                        },
                        data : dataPromenaTekuci
                      };
                      
                      axios.request(configPT)
                      .then((response) => {
                        console.log(JSON.stringify(response.data));
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    break;
                case 'studentski':
                    let dataPromenaStudentski = JSON.stringify({
                        "iznos": transactionData.iznos,
                      });
                      let configPS = {
                        method: 'patch',
                        maxBodyLength: Infinity,
                        url: `http://127.0.0.1:8000/api/korisnik/promena-studentskog-stanja-racuna/${id}`,
                        headers: { 
                          'Content-Type': 'application/json', 
                          'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                        },
                        data : dataPromenaStudentski
                      };
                      
                      axios.request(configPS)
                      .then((response) => {
                        console.log(JSON.stringify(response.data));
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    break;
                case 'devizni':
                    let dataPromenaDevizni = JSON.stringify({
                        "iznos": transactionData.iznos,
                      });
                      let configPD = {
                        method: 'patch',
                        maxBodyLength: Infinity,
                        url: `http://127.0.0.1:8000/api/korisnik/promena-deviznog-stanja-racuna/${id}`,
                        headers: { 
                          'Content-Type': 'application/json', 
                          'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                        },
                        data : dataPromenaDevizni
                      };
                      
                      axios.request(configPD)
                      .then((response) => {
                        console.log(JSON.stringify(response.data));
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    break;
                default:
                        console.log('evo me');
                        break;
            }
              
        }

        let data = new FormData();

        if(transactionData.iznos != '') {
          data.append('iznos', transactionData.iznos);
        } else {
            error.iznos='Unesite unos';
        }

        if(transactionData.naziv_primaoca != '') {
            data.append('naziv_primaoca',transactionData.naziv_primaoca);
        }else{
            error.naziv_primaoca='Unesite naziv primaoca';
        }

        if(transactionData.broj_racuna_primaoca != '') {
          console.log(transactionData.broj_racuna_primaoca);
            data.append('broj_racuna_primaoca', transactionData.broj_racuna_primaoca);
        } else {
            error.broj_racuna_primaoca='Unesite broj_racuna_primaoca';
        }

        if(transactionData.opis_transakcije != '') {
            data.append('opis_transakcije', transactionData.opis_transakcije);
        } else {
            error.opis_transakcije='Unesite opis';
        }

        if(transactionData.sifra_placanja!=''){
            data.append('sifra_placanja',transactionData.sifra_placanja);
        }else{
            error.sifra_placanja='Morate izabrati sifru placanja';
        }

        if (Object.keys(error).length > 0) {
            setErrors(error);
          }

    
        data.append('datum', datum);
        data.append('vreme', time);
        data.append('racun_id', focusedAcc.id);
        data.append('tip', tip);

        // DODATO: ako je zakazana transakcija, dodaj polja i preskoči odbitak stanja
        if (isScheduled) {
            if (!danUMesecu || danUMesecu < 1 || danUMesecu > 28) {
                alert('Unesite validan dan u mesecu (1–28) za zakazanu transakciju.');
                return;
            }
            data.append('is_scheduled', 'true');
            data.append('dan_u_mesecu', danUMesecu);

            let configZakazana = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:8000/api/korisnik/nova-transakcija',
                headers: { 'Authorization': 'Bearer ' + window.sessionStorage.getItem('user_auth_token') },
                data: data
            };

            axios.request(configZakazana)
                .then(() => setScheduledSuccess(true))
                .catch((error) => console.log(error));

            return; // preskoči odbitak stanja — izvrsava se tek kad komanda proradi
        }

        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/api/korisnik/nova-transakcija',
        headers: {
            'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            setSuccessfulTran(true);
        })
        .catch((error) => {
            console.log(error);
        });

       
        
       switch(focusedAcc.tip){
        case 'tekuci':
            let dataTekuci = JSON.stringify({
                "iznos": transactionData.iznos
              });
              
              let configT = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:8000/api/korisnik/izmena-tekuceg-stanja-racuna/${focusedAcc.detalji.id}`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                },
                data : dataTekuci
              };
              
              axios.request(configT)
              .then((response) => {
                console.log(JSON.stringify(response.data));
              })
              .catch((error) => {
                console.log(error);
              });
              
            break;
        case 'devizni':
            let dataDevizni = JSON.stringify({
                "iznos": transactionData.iznos
              });
              
              let configD = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:8000/api/korisnik/izmena-deviznog-stanja-racuna/${focusedAcc.detalji.id}`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                },
                data : dataDevizni
              };
              
              axios.request(configD)
              .then((response) => {
                console.log(JSON.stringify(response.data));
              })
              .catch((error) => {
                console.log(error);
              });
            break;
        case 'studentski':
            let dataStudentski = JSON.stringify({
                "iznos": transactionData.iznos
              });
              
              let configS = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `http://127.0.0.1:8000/api/korisnik/izmena-studentskog-stanja-racuna/${focusedAcc.detalji.id}`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'),
                },
                data : dataStudentski
              };
              
              axios.request(configS)
              .then((response) => {
                console.log(JSON.stringify(response.data));
              })
              .catch((error) => {
                console.log(error);
              });
            break;
   }
        
    }


    const closeMessageBox=()=>{
      if(successfulTran) {
        setSuccessfulTran(false);
        navigate('/user/home');
      }
      if(scheduledSuccess) {
        setScheduledSuccess(false);
        navigate('/user/zakazane-transakcije');
      }
      if(failedTransaction) {
        setFailedTransaction(false);
        navigate('/user/home');
      }
      if(insufficientFunds) {
        setInsufficientFunds(false);
        return;
      }
      if(invalidAmount) {
        setInvalidAmount(false);
        return;
      }
    }


  return (
    <div className="form-body">
        <form className="main" onChange={(e)=>handleInput(e)}>
            
            <div className="each-container">
                <label className="label-transaction"> Naziv primaoca:  </label>
                {tip==='interna' ? 
                (<input type="text" name="naziv_primaoca" className="input-transaction" defaultValue={internalData==null ? '' : internalData[0].user.ime + " "+internalData[0].user.prezime} disabled/>) 
                : 
                (<input type="text" name="naziv_primaoca" placeholder='ime primaoca' className={errors.naziv_primaoca ? 'input-transaction-error' : 'input-transaction'} />)
                }
           </div>


        <div className="each-container">
            <label className="label-transaction"> Broj računa primaoca:  </label>
            {tip==='interna' ? 
            (<>
            <select onClick={(e)=>handleSelectChangeRacun(e)} value={transactionData.broj_racuna_primaoca} className="input-transaction">
                {newInternalData && newInternalData.map((item, index)=>{
                    return (<option key={index} name="broj_racuna_primaoca" value={item.detalji.broj_racuna}>{item.detalji.broj_racuna}, {item.banka.naziv}</option>)
                })}
            </select>
            </>) 
            : 
            (<input type="text" name="broj_racuna_primaoca" placeholder='broj racuna primaoca' className={errors.broj_racuna_primaoca ? 'input-transaction-error' : 'input-transaction'} required/>)
            }
        </div>

        <div className="sub-container">
        <div className="each-container">
            
            <label className="label-transaction"> Datum:  </label>
            <input type="date" name="datum" defaultValue={datum} disabled className="input-transaction"/>
        </div>

        <div className="each-container">
            <label className="label-transaction"> Iznos:  </label>
            <input type="number" step="100" name="iznos" placeholder='iznos' className={errors.iznos ? 'input-transaction-error' : 'input-transaction'} />
        </div>
        </div>
    
        <div className="each-container">
            <label className="label-transaction"> Opis transakcije:  </label>
            <input type="text" name="opis_transakcije" placeholder='svrha placanja' className={errors.opis_transakcije ? 'input-transaction-error' : 'input-transaction'} />
        </div>

        <div className="each-container">
            <label className="label-transaction"> Sifra plaćanja:  
                <select onChange={(el)=>handleSelectChangeSifra(el)} className={errors.sifra_placanja ? 'input-transaction-error' : 'input-transaction'} >
                    <option value=""></option>
                    <option value="289">289-Transakcije po nalogu gradjana</option>
                    <option value="222">222-Usluge javnih preduzeća</option>
                    <option value="254">254-Uplata poreza i doprinosa po odbitku</option>
                    <option value="221">221-Promet robe i usluga-finalna potrosnja</option>
                    <option value="229">229-Digitalna imovina</option>
                    <option value="230">230-Promet nepokretnosti</option>
                    <option value="240">240-Zarade i druga primanja zaposlenih</option>
                    <option value="253">253-Uplata javnih prihoda izuzev poreza i doprinosa po odbitku</option>
                    <option value="281">281-Pozajmice osnivača za likvidnost</option>
                    <option value="287">287-Donacije i sponzorstva</option>
                    <option value="288">288-Donacije</option>
                    <option value="290">290-Druge transakcije</option>
                </select>
            </label>
        </div>

        <div className="each-container">
            <label className="label-transaction">Naziv platioca:  </label>
            <input type="text" name="racun_id_naziv" placeholder='platilac' className="input-transaction" defaultValue={focusedAcc.user.ime + " " + focusedAcc.user.prezime} disabled/>
        </div>

        <div className="sub-container"> 
            <div className="each-container">
                <label className="label-transaction">Adresa platioca:  </label>
                <input type="text" name="racun_id_adresa" placeholder='platilac' className="input-transaction" defaultValue={focusedAcc.user.adresa} disabled/>
            </div>
            <div className="each-container">
                <label className="label-transaction">Grad platioca:  </label>
                <input type="text" name="racun_id_grad" placeholder='platilac' className="input-transaction" defaultValue={focusedAcc.user.grad} disabled/>
            </div>
        </div>
        
        {/* DODATO: sekcija za zakazivanje transakcije */}
        <div className="each-container" style={{marginTop: '8px'}}>
            <label className="label-transaction" style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}}>
                <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={e => setIsScheduled(e.target.checked)}
                    style={{width:'18px', height:'18px', cursor:'pointer'}}
                />
                Zakazati transakciju (ponavljajuća)
            </label>
        </div>

        {isScheduled && (
            <div className="each-container">
                <label className="label-transaction">Dan u mesecu (1–28):</label>
                <input
                    type="number"
                    min="1"
                    max="28"
                    placeholder="npr. 4"
                    value={danUMesecu}
                    onChange={e => setDanUMesecu(e.target.value)}
                    className="input-transaction"
                />
            </div>
        )}

        <div className='izvrsi-placanje-container'>
            <button type="submit" className="btn-transaction" onClick={(ex)=>{handleNewTransaction(ex)}}>
                {isScheduled ? 'Izvrši Transakciju' : 'Izvrši plaćanje'}
            </button>
        </div>

        </form>
        {successfulTran && <PopUp closeMessageBox={closeMessageBox} messageText={messageText}/>}
        {/* DODATO: poruka uspesnog zakazivanja */}
        {scheduledSuccess && <PopUp closeMessageBox={closeMessageBox} messageText={'Zakazana transakcija je kreirana!'} />}
        {failedTransaction && <PopUp closeMessageBox={(closeMessageBox)} messageText={failedTransactionMessage}/>}
        {insufficientFunds && <PopUp closeMessageBox={closeMessageBox} messageText={"Nemate dovoljno sredstava na računu!"} />}
        {invalidAmount && <PopUp closeMessageBox={closeMessageBox} messageText={"Iznos mora biti pozitivan broj!"} /> }
    </div>
  )
}

export default NewTransaction
