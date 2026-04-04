import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Racuni from './Racuni';
import axios from 'axios';
import "../css/HomePageData.css";
import { PiVaultBold } from "react-icons/pi";
import TransactionDetails from './TransactionDetails';
import PopUp from './PopUp';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';
import { PulseLoader } from 'react-spinners';

const UserHome = ({accountFocus, focusedAcc}) => {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);

    const [tabFocused, setTabFocused]=useState({
      tab1: false,
      tab2: true,
      tab3: false
    });

    const [selectedTransaction, setSelectedTransaction] = useState(null);  
    const [showDetails, setShowDetails] = useState(false);

    const [sortiraniNiz, setSortiraniNiz]=useState(null);
    const [sortOrderIznos, setSortOrderIznos] = useState('asc');
    const [sortOrderDatum, setSortOrderDatum] = useState('asc');

    const [detailsAccount,setDetailsAccount]=useState();

    const [isExportEmpty, setIsExportEmpty] = useState(false);

    const [loading, setLoading]=useState(true);

    const sortDataIznos=()=>{
      let newDataOrder=[...transactions].sort((a,b)=>{
        if(sortOrderIznos==='asc'){
          return a.iznos - b.iznos;
        }else{
          return b.iznos - a.iznos;
        }
      });
    
      setSortiraniNiz(newDataOrder);
      setSortOrderIznos(sortOrderIznos==='asc' ? 'desc' : 'asc'); 
    }

    const sortDataDatum=()=>{
      let newDataOrder=[...transactions].sort((a,b)=>{
        if(sortOrderDatum==='asc'){
          return new Date(a.datum) - new Date(b.datum);
        }else{
          return new Date(b.datum) - new Date(a.datum);
        }
      });
    
      setSortiraniNiz(newDataOrder);
      setSortOrderDatum(sortOrderDatum==='asc' ? 'desc' : 'asc');
      
    }


    function handleTabFocus(tab){
      if(focusedAcc == null)
        return;
      
      if(showDetails) {
        setShowDetails(false);
        setSelectedTransaction(null);
        document.querySelector("body").classList.remove("lock-background");
      }

      if(isExportEmpty) {
        closeMessageBox();
      }
      
      switch(tab){
        case 'tab1':
          setTabFocused({tab1:true,tab2:false,tab3:false});
          getAccountDetails(focusedAcc);
          break;
        case 'tab2':
          setTabFocused({tab1:false,tab2:true,tab3:false});
          break;
        case 'tab3':
          setTabFocused({tab1:false,tab2:false,tab3:true});
          break;
      }
    }

    function retrieveExports(exportDateRange) {
      let mesec = exportDateRange.split(' ')[0];
      let godina = exportDateRange.split(' ')[1];

        console.log(mesec);
        console.log(godina);
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:8000/api/korisnik/export/${focusedAcc.id}/${mesec}/${godina}`,
        headers: { 
          'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
        },
        responseType: 'blob'
      }

      axios.request(config)
      .then( (res) => {
        if(res.data.size === 0) {
          setIsExportEmpty(true);
          return;
        }

       const file = new Blob([res.data], {type: 'application/pdf'});
       const fileURL = URL.createObjectURL(file);
       const link = document.createElement('a');
 
       link.href = fileURL;
       link.download = "Mesečni_Izvod_" + godina + "_" + mesec;
 
       link.click();
 
       URL.revokeObjectURL(fileURL);
      })
      .catch( (e) => {
        console.log("Nastala je greska: " + e);
      })
    }

    const handleAccountFocus = (acc) => {
      if(accountFocus)
        accountFocus(acc);

      if(showDetails) {
        setShowDetails(false);
        setSelectedTransaction(null);
        document.querySelector("body").classList.remove("lock-background");
      }

      if(isExportEmpty) {
        closeMessageBox();
      }

      getAccountDetails(acc);
      prepareTransactions(acc);
    }

    function prepareTransactions(acc) {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:8000/api/korisnik/izvrsene-transakcije/${acc.id}`,
        headers: { 
          'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
        }
      };
      
      axios.request(config)
      .then((response) => {
        setTransactions(response.data.transakcije);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });

    }
    
    function getAccountDetails(account){
      let config;
      
      switch(account.tip){
        case "tekuci":
          config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://127.0.0.1:8000/api/korisnik/tekuci_racun/${account.detalji.id}`,
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'), 
            },
          };

          axios.request(config)
          .then((response) => {    
            setDetailsAccount(response.data.tekuci_racun);
          })
          .catch((error) => {
            console.log(error);
          });
          break;

        case "stedni":
          config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://127.0.0.1:8000/api/korisnik/stedni_racun/${account.detalji.id}`,
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'), 
            },
          };

          axios.request(config)
          .then((response) => {
            setDetailsAccount(response.data.stedni_racun);
          })
          .catch((error) => {
            console.log(error);
          });
          break;

        case "studentski":
          config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://127.0.0.1:8000/api/korisnik/studentski_racun/${account.detalji.id}`,
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'), 
            },
          };

          axios.request(config)
          .then((response) => {
            setDetailsAccount(response.data.studentski_racun);
          })
          .catch((error) => {
            console.log(error);
          });
          break;

        case "devizni":
          config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://127.0.0.1:8000/api/korisnik/devizni_racun/${account.detalji.id}`,
            headers: { 
              'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'), 
            },
          };

          axios.request(config)
          .then((response) => {
            setDetailsAccount(response.data.devizni_racun);
          })
          .catch((error) => {
            console.log(error);
          });
          break;
      }
    }

    const [months, setMonths] = useState([]);
    const [randomStartOfMonth, setRandomStartOfMonth] = useState([]);

    useEffect( () => {
      const monthNames = [
        'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
        'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
      ];
      
      const arr = [];
      
      for(let i = 0; i < 12; i++)
        arr.push(Math.floor(Math.random()*6) + 1);
      setRandomStartOfMonth(arr);

      const monthsList = [];

      const currentDate = new Date();
      let year = currentDate.getFullYear();
      let monthIndex = currentDate.getMonth()-1;

      if (monthIndex < 0) {
        monthIndex = 11; 
        year -= 1;
      }

      for (let i = 0; i < 12; i++) {
        monthsList.push(`${monthNames[monthIndex]} ${year}`);

        monthIndex -= 1;

        if (monthIndex < 0) {
          monthIndex = 11; 
          year -= 1;
        }
    }

    setMonths(monthsList.reverse());

      let user = window.sessionStorage.getItem("user_auth_token");
      let admin = window.sessionStorage.getItem("admin_auth_token");

      if(admin != null)
        navigate("/admin/home");

      if(user == null)
        navigate("/user/login");

    }, [navigate]);

    const showTransactionDetails = async(trans_id) => {
      document.querySelector("body").classList.add("lock-background");
      
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:8000/api/korisnik/transakcija/${trans_id}`,
        headers: { 
          'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
        }
      };
      
      axios.request(config)
      .then( (res) => {
        console.log(res.data.transakcija);  
        setSelectedTransaction(res.data.transakcija);
        setShowDetails(true);
      })
      .catch((e)=> {
        console.log("Greska pri ucitavanju detalja o transakciji: " + e);
      })
    }

    const closeDetails = () => {
      setShowDetails(false);
      setSelectedTransaction(null);
      document.querySelector("body").classList.remove("lock-background");
    }

    const closeMessageBox = () => {
      setIsExportEmpty(false);
    }

    const messageText='Za izabrani mesec nema transakcija za dati nalog!';

    const mapOfMonths = {
      'Januar' : '01.',
      'Februar' : '02.',
      'Mart': '03.',
      'April': '04.',
      'Maj': '05.',
      'Jun': '06.',
      'Jul': '07.',
      'Avgust': '08.',
      'Septembar': '09.',
      'Oktobar': '10.',
      'Novembar': '11.',
      'Decembar': '12.'
    }

  return (
      <>
        <Racuni onAccountFocus={handleAccountFocus} />

        {showDetails && <TransactionDetails details={selectedTransaction} closeDetails={closeDetails}/>}

        <div className="main-container">
          <div className="tabs-container">
            <div onClick={()=>{handleTabFocus('tab1')}} className={`${tabFocused.tab1 ? "focused-tab" : ""} bank-account tab`}>Detalji Računa</div>
            <div onClick={()=>{handleTabFocus('tab2')}} className={`${tabFocused.tab2 ? "focused-tab" : ""} transactions tab`}>Transakcije</div>
            <div onClick={()=>{handleTabFocus('tab3')}} className={`${tabFocused.tab3 ? "focused-tab" : ""} transactions-export tab`}>Izvodi</div>
          </div>

          <div className="data-container"> 
            {tabFocused.tab2 && loading===true ? <>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-15em' }}>
            <PulseLoader
              color="#9A616D"     
              size={35}           
              margin={8}          
              speedMultiplier={0.5} 
            />
            </div>
            </> : <>
              {tabFocused.tab2 && (<>
              <div className="list-of-transactions-container">
              <div className="lista-trans-icon-headline">
                <div><PiVaultBold style={{fontSize:'1.8em', marginBottom:'3px', color:'darkBlue'}} /></div>
                <div><h3>Lista Transakcija Za {focusedAcc == null ? <></> : focusedAcc.tip} Račun:</h3></div>
              </div>
              <div className="lista-trans-br-racuna">
                {focusedAcc == null ? <>/</>:focusedAcc.detalji.broj_racuna}
              </div>
            </div>

            <table>
              <thead>
              <tr>
                  <th className="transactions-tbl-heading">Datum  {sortOrderDatum === 'asc' ? <IoIosArrowDown onClick={sortDataDatum}/> : <IoIosArrowUp onClick={sortDataDatum}/>}</th>
                  <th className="transactions-tbl-heading">Iznos  {sortOrderIznos === 'asc' ? <IoIosArrowDown onClick={sortDataIznos}/> : <IoIosArrowUp onClick={sortDataIznos}/>}</th>
                  <th className="transactions-tbl-heading">Opis Transakcije</th>
                  <th className="transactions-tbl-heading">Broj Računa Primaoca</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? <tr style={{borderBottom : 'none'}}><td>/</td><td>/</td><td>/</td><td>/</td></tr>: <></>}
                {transactions == null  ? <></> : (sortiraniNiz==null ? (transactions.map( (transakcija) => {
             return (
                <tr onClick={() => {showTransactionDetails(transakcija.id)}} className="data-row" key={transakcija.id}>
                  <td>{transakcija.datum}</td>
                  <td >{transakcija.iznos} <span>{focusedAcc.detalji.valuta == null ? "RSD" : focusedAcc.detalji.valuta}</span></td>
                  <td id="opis-trans">{transakcija.opis_transakcije}</td>
                  <td>{transakcija.broj_racuna_primaoca}</td>
                </tr>
             );
            })) : (sortiraniNiz.map((trans)=>{
              return(
                <tr onClick={() => {showTransactionDetails(trans.id)}} className="data-row" key={trans.id}>
                  <td>{trans.datum}</td>
                  <td>{trans.iznos} <span>{focusedAcc.detalji.valuta == null ? "RSD" : focusedAcc.detalji.valuta}</span></td>
                  <td>{trans.opis_transakcije}</td>
                  <td>{trans.broj_racuna_primaoca}</td>
                </tr>
              );
            })) )
            }
            </tbody>
          </table>
          </>
            )}
            </>}
            

            {tabFocused.tab1 && (<>
              <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}} className="list-of-transactions-container">
              <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}} className="lista-trans-icon-headline">
                <div><h2>Detalji za {focusedAcc == null ? <></> : focusedAcc.tip} Račun</h2></div>
              </div>
            </div>
            <div className="invoice-details">
            <div className="invoice-row">
              <span className="label">Broj računa:</span>
              <span className="value">{detailsAccount==null ? <></> : detailsAccount.broj_racuna}</span>
            </div>
            <div className="invoice-row">
              <span className="label">Stanje računa:</span>
              <span className="value">{detailsAccount==null ? <></> : detailsAccount.stanje_racuna} {detailsAccount==null ? <></> : (detailsAccount.hasOwnProperty("valuta") ? detailsAccount.valuta : "RSD") }</span>
            </div>
            <div className="invoice-row">
              <span className="label">Održavanje:</span>
              <span className="value">{detailsAccount==null ? <></> : (detailsAccount.hasOwnProperty("valuta") ? (detailsAccount.odrzavanje + " " + detailsAccount.valuta) : ( detailsAccount.odrzavanje+" RSD"))} </span>
            </div>
            <div className="invoice-row">
              <span className="label">Dozvoljeni minus:</span>
              <span className="value">{detailsAccount==null ? <></> : (detailsAccount.racun.tip === 'tekuci' ? detailsAccount.dozvoljeni_minus + " RSD" : "/")}</span>
            </div>
            <div className="invoice-row">
              <span className="label">Kamata:</span>
              <span className="value">{detailsAccount==null ? <></> : (detailsAccount.kamata != null ? detailsAccount.kamata + "%" : "/")}</span>
            </div>
            <div className="invoice-row">
              <span className="label">Valuta:</span>
              <span className="value">{detailsAccount==null ? <></> : (detailsAccount.hasOwnProperty("valuta") ? detailsAccount.valuta : "/")}</span>
            </div>
            <div className="invoice-row">
              <span className="label">Tip štednje:</span>
              <span className="value">{detailsAccount==null ? <></> : (detailsAccount.hasOwnProperty("tip_stednje") ? detailsAccount.tip_stednje : "/")}</span>
            </div>
            <div className="invoice-row">
              <span className="label">Banka u kojoj je otvoren račun:</span>
              <span className="value">{detailsAccount==null ? <></> : detailsAccount.racun.banka.naziv},{detailsAccount==null ? <></> : detailsAccount.racun.banka.grad}</span>
            </div>
            </div>
            </>)}

            {tabFocused.tab3 && (
              <div className="exp-container">
                <div className="exports-headers">
                  <div className='exp-header'>Izvod Za</div>
                  <div className='exp-header'>Generisano</div>
                  <div className='exp-header'>Akcija</div>
                </div>

                <div className="exports-container">
                  
                  { months.map( (month, index) => (
                      <div className="single-export-container" key={index}>
                        <div className="month export-column" key={index}>{month}</div>
                        <div className="generated export-column">{`0${randomStartOfMonth[index]}. ${month.split(' ')[0]} ${month.split(' ')[1]}.`}</div>
                        <div className="download export-column" style={{borderRight:'none'}}><button download onClick={()=>{retrieveExports(month)}} className="export-download-button">Preuzmi</button></div>
                      </div>
                    
                  ))}

                </div>
              </div>
            )}

            {isExportEmpty && <PopUp closeMessageBox={closeMessageBox} messageText={messageText}/>}

        </div>  
            
      </div> 
      </>
  )
}

export default UserHome
