import React, {useRef} from 'react';
import '../css/Tabela.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import OneUser from './OneUser';
import { PulseLoader } from 'react-spinners';
import OneBank from './OneBank';
import RenderPagination from './RenderPagination';
import { useLocation, useNavigate } from 'react-router-dom';
import PopUp from './PopUp.jsx';
import Options from './Options.jsx';
import { FiFilter } from 'react-icons/fi';
import ConfirmModal from './ConfirmModal';


const Table = ({tipTabele}) => {

  
  const location = useLocation();
    const[clickedOprcije, setClickedOprcije]=useState(false);
    const openOptionWindor=()=>{
      setClickedOprcije(true);
    }

    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const fetchPaginatedUsers = async (page) => {
      const token = window.sessionStorage.getItem("admin_auth_token");

      const response = await fetch(`http://127.0.0.1:8000/api/admin/korisnici?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept' : 'application/json'
        }
      });
      const data = await response.json();

      setKorisnici(data.data);
      setPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
          perPage: data.per_page,
      });
    };

    const [selectedBankFilter, setSelectedBankFilter] = useState("default-option");
    const [selectedRadioBtn, setSelectedRadioBtn] = useState([]);
    const [noAccountToDeleteChosen, setNoAccountToDeleteChosen] = useState(false);
    const[korisnici, setKorisnici]=useState([]);
    const[banke, setBanke]=useState([]);
    const[oneKorisnik, setOneKorisnik]=useState();
    const[oneBank, setOneBank]=useState();
    const[clickedUser, setClickedUser]=useState(false);
    const[clickedBank, setClickedBank]=useState(false);
    const[loading, setLoading]=useState(true);
    const [bankAccountDeleted, setBankAccountDeleted] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // State koji cuva sve podatke o racunima korisnika, samom korisniku, povezanim bankama(racuncollection)
    const [details, setDetails] = useState([]);
  
    useEffect(()=>{
      if(tipTabele==='banke' || tipTabele === 'racuni-korisnika'){
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://127.0.0.1:8000/api/admin/banke',
          headers: { 
            'Authorization': 'Bearer '+window.sessionStorage.getItem('admin_auth_token'), 
          },
        };
        
        axios.request(config)
        .then((response) => {
          setBanke(response.data.banke);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
      }

      if(tipTabele==='racuni-korisnika') {
        let getUserAccounts = {
          method : 'get',
          maxBodyLength: Infinity,
          url: `http://127.0.0.1:8000/api/admin/bankovni-racuni-korisnika/${location.state.id}`,
          headers: {
            'Authorization' : 'Bearer ' + window.sessionStorage.getItem("admin_auth_token")
          },
        };
        axios.request(getUserAccounts)
        .then( (res) => {
          setDetails(res.data.racuni);
        })
        .catch((e) => {
          console.log("Greska pri pronalazenju racuna korisnika: " + e);
        });
      }
    },[tipTabele]);

  const handleUserDetails = async(user_id)=>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://127.0.0.1:8000/api/admin/korisnici/${user_id}`,
        headers: { 
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('admin_auth_token'), 
        },
    };
      
    axios.request(config)
    .then((response) => {
      setOneKorisnik(response.data.users);
      setClickedUser(true);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleBankDetails=async(banka_id)=>{
      let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `http://127.0.0.1:8000/api/admin/banke/${banka_id}`,
          headers: { 
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('admin_auth_token'), 
          },
      };
        
      axios.request(config)
      .then((response) => {
        setOneBank(response.data.banke);
        setClickedBank(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const closeDetails = () => {
    setClickedUser(false);
    setClickedBank(false);
    setOneKorisnik(null);
    document.querySelector("body").classList.remove("zakljucan-background");
  }
  
  const closeMessageBox = () => {
    if(noAccountToDeleteChosen)
      setNoAccountToDeleteChosen(false);
    if(bankAccountDeleted) {
      setBankAccountDeleted(false);
      window.location.reload();
    }
  }

  const [searchInputUser, setSearchInputUser] = useState({
    jmbg: ''
  });

  const [searchInputBank, setSearchInputBank] = useState({
    naziv: ''
  });

  useEffect( () => {
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if(searchInputUser.jmbg === '') {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/api/admin/korisnici',
        headers: { 
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('admin_auth_token'),   
        },
      };
      
      axios.request(config)
      .then((response) => {
        setKorisnici(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    
      return;
    }
      
    let searchUserBySSN = {
      method : 'get',
      maxBodyLength: Infinity,
      url : `${searchInputUser.jmbg}` != '' ? `http://127.0.0.1:8000/api/admin/pretraga-korisnika/${searchInputUser.jmbg}` : 'http://127.0.0.1:8000/api/admin/pretraga-korisnika/cleared-field',
      headers : {
        'Authorization' : 'Bearer ' + window.sessionStorage.getItem("admin_auth_token")
      }
    }

    axios.request(searchUserBySSN)
    .then( (res) => {
      setKorisnici(res.data);
      setLoading(false);
    })
    .catch( (e) => {
      console.log("Greska pri pretrazi korisnika po jmbg-u. " + e);
    })
  }, [searchInputUser]);

  const isFirstRender = useRef(true);

  const handleInputUser = (e) => {
    const {name, value} = e.target;
    
    const digitsOnly = value.replace(/\D/g, '');

    setSearchInputUser(prev => ({
      ...prev,
      [name]: digitsOnly
    }));
  }

  const handleInputBank = (e) => {
    const {name, value} = e.target;
    
    setSearchInputBank(prev => ({
      ...prev,
      [name]: value
    }));
  }

  useEffect( () => {
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if(searchInputBank.naziv === '') {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/api/admin/banke',
        headers: { 
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('admin_auth_token'),   
        },
      };
      
      axios.request(config)
      .then((response) => {
        setBanke(response.data.banke);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    
      return;
    }
      
    let searchBankByName = {
      method : 'get',
      maxBodyLength: Infinity,
      url : `${searchInputBank.naziv}` != '' ? `http://127.0.0.1:8000/api/admin/pretraga-banaka/${searchInputBank.naziv}` : 'http://127.0.0.1:8000/api/admin/pretraga-banaka/cleared-field',
      headers : {
        'Authorization' : 'Bearer ' + window.sessionStorage.getItem("admin_auth_token")
      }
    }

    axios.request(searchBankByName)
    .then( (res) => {
      setBanke(res.data);
      setLoading(false);
    })
    .catch( (e) => {
      console.log("Greska pri pretrazi banaka po nazivu. " + e);
    })
  }, [searchInputBank]);

  useEffect( () => {
    if(tipTabele==='korisnici'){
      fetchPaginatedUsers(currentPage);
    }
  },[currentPage]);

  const handleBankFilter = (e) => {
    setSelectedBankFilter(e.target.value);
  };

  const handleDeleteRadioBtn = (e) => {
    let elems = e.target.id.split(' ');
    
    setSelectedRadioBtn( prev => ({
      ...prev,
      ...elems
    }));
  };

  const executeBankAccountDelete = () => {
    let url = '';
    switch(selectedRadioBtn[0]) {
      case 'tekuci':
      url = `http://127.0.0.1:8000/api/admin/tekuci_racun/${selectedRadioBtn[1]}`
      break;

      case 'studentski':
      url = `http://127.0.0.1:8000/api/admin/studentski_racun/${selectedRadioBtn[1]}`
      break;

      case 'stedni':
      url = `http://127.0.0.1:8000/api/admin/stedni_racun/${selectedRadioBtn[1]}`
      break;

      case 'devizni':
      url = `http://127.0.0.1:8000/api/admin/devizni_racun/${selectedRadioBtn[1]}`
      break;

      default:
      url='nepostojeci tip';
      break;
    }

    let deleteBankAccount = {
      method : 'delete',
      maxBodyLength: Infinity,
      url: url,
      headers : {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem("admin_auth_token")
      },
    }

    axios.request(deleteBankAccount)
    .then( (res) => {
      console.log(res.data);
      setBankAccountDeleted(true);
    })
    .catch((e)=> {
      console.log("Greska prilikom brisanja bankovnog racuna: " + e);
    })

  }

  const handleBankAccountDelete = () => {
    if(selectedRadioBtn.length == 0) {
      setNoAccountToDeleteChosen(true);
      return;
    }
    setShowDeleteConfirm(true);
  }

  return (
    <>
    {showDeleteConfirm && (
      <ConfirmModal
        message="Da li ste sigurni da želite da obrišete ovaj bankovni račun? Ova akcija se ne može poništiti."
        onConfirm={() => { setShowDeleteConfirm(false); executeBankAccountDelete(); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    )}
    {loading===true ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-5em' }}>
      <PulseLoader
        color="#9A616D"     
        size={35}           
        margin={8}          
        speedMultiplier={0.5} 
      />
    </div> : 
    <>
            {tipTabele==='korisnici' ? 
            <>
    
    <div className="users-search-main-container">
      <div className="users-search-title-container">
        <h2>Pretraga Korisnika: </h2>
      </div>

      <div className="users-search-input-box-container">
        <input onChange={(e)=> handleInputUser(e)} value={searchInputUser.jmbg} name="jmbg" maxLength="13" type="text" className="users-search-text-box" placeholder="Unesite JMBG korisnika" />
      </div>
    </div>

    <div className="tabela-kontejner-user">
      <table className="user-tabela">
        <thead>
          <tr>
            <th className='kolona'>ID</th>
            <th className='kolona'>Ime</th>
            <th className='kolona'>Prezime</th>
            <th className='kolona'>Datum rodjenja</th>
            <th className='kolona'>Email</th>
            <th className='kolona'>Maticni broj</th>
            <th className='kolona'>Broj licne karte</th>
            <th className='kolona'>Adresa</th>
            <th className='kolona'>Grad</th>
            <th className='kolona'>Drzava</th>
            <th className='kolona'>Broj telefona</th> 
          </tr>
        </thead>
      <tbody>
        {korisnici && korisnici.map((user)=>{
            return <tr className='red' onClick={()=>{handleUserDetails(user.id)}} key={user.id}>
                <td className='red'>{user.id}</td>
                <td className='red'>{user.ime}</td>
                <td className='red'>{user.prezime}</td>
                <td className='red'>{user.datum_rođenja}</td>
                <td className='red'>{user.email}</td>
                <td className='red'>{user.maticni_broj}</td>
                <td className='red'>{user.broj_licne_karte}</td>
                <td className='red'>{user.adresa}</td>
                <td className='red'>{user.grad}</td>
                <td className='red'>{user.drzava}</td>
                <td className='red'>{user.broj_telefona}</td>
            </tr>
        })}
               
      </tbody>
    </table>
    </div>
  
  {korisnici && <RenderPagination 
    pagination={pagination}
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
  />}
 </> : 
 <>
  {tipTabele === 'banke' ? 
  <>
    <div className="users-search-main-container">
      <div className="users-search-title-container">
        <h2>Pretraga Banaka: </h2>
      </div>

      <div className="users-search-input-box-container">
        <input onChange={(e)=> handleInputBank(e)} value={searchInputBank.naziv} name="naziv" type="text" className="users-search-text-box" placeholder="Unesite naziv banke" />
      </div>
    </div>

    <div className="tabela-kontejner-banka">
    <table className="user-tabela">
      <thead>
        <tr>
          <th className='kolona'>ID</th>
          <th className='kolona'>Naziv</th>
          <th className='kolona'>Grad</th>
          <th className='kolona'>Broj dozvole</th>
        </tr>
      </thead>
      <tbody>
        {banke.map((banka)=>{
            return <tr className='red-bank' onClick={()=>{handleBankDetails(banka.id)}} key={banka.id}>
                <td className='red-bank'>{banka.id}</td>
                <td className='red-bank'>{banka.naziv}</td>
                <td className='red-bank'>{banka.grad}</td>
                <td className='red-bank'>{banka.broj_dozvole}</td>
            </tr>
        })}
               
      </tbody>
    </table>
    </div>
  </> :
  <>
    <div className="user-bank-accounts-title-container">
      <div>
        <h3><span style={{fontWeight:'400'}}> Prikaz računa korisnika:</span> <strong>{location.state.ime + ' ' + location.state.prezime}</strong> </h3>
      </div>

      <div>
        <h4><span style={{fontWeight: '400'}}>Matični Broj:</span> <strong>{location.state.maticni_broj}</strong></h4> 
      </div>
    </div>

    <div className="user-bank-accounts-filter-container">
        <div style={{display:'flex',alignItems:'center'}}>
          <span className='filter-details-title'>Filtriraj pretragu:</span> 
        
          <FiFilter size={28} color="black"/>
        </div>

        <div>
          <select value={selectedBankFilter} onChange={(e)=>{handleBankFilter(e)}} name="banks-dropdown-filter" className="user-bank-accounts-banks-dropdown-filter">
            <option value="default-option">/</option>
            {banke && banke.map( (banka) => {
              return (
                <option value={banka.naziv} key={banka.id}>{banka.naziv}</option>
              )
            })}

          </select>
        </div>
    </div>

    <div className="tabela-kontejner-banka">
    <table className="user-tabela">
      <thead>
        <tr>
          <th className='kolona'>ID</th>
          <th className='kolona'>Tip</th>
          <th className='kolona'>Banka</th>
          <th className='kolona'>Broj Računa</th>
          <th className='kolona'>Stanje</th>
          <th className='kolona'>Održavanje</th>
          <th className='kolona'>Kamata</th>
          <th className='kolona'>Dozvoljeni Minus</th>
          <th className='kolona'>Valuta</th>
          <th className='kolona'>Tip Štednje</th>   
          <th className='kolona'></th> 
        </tr>
      </thead>
      <tbody>

      {details.length === 0 ?  
      <div style={{width:'80vw', display: 'flex', justifyContent:'center', alignItems: 'center', fontSize: '2em'}}>Ne postoje računi povezani sa ovim korisnikom.</div> 
      :
       details.map((detail)=>{
        if(selectedBankFilter === 'default-option') {
            return (
            <tr className='red' key={detail.id}>
                <td>{detail.detalji.id}</td>
                <td style={{textTransform:'capitalize'}}>{detail.tip}</td>
                <td>{detail.banka.naziv}</td>
                <td>{detail.detalji.broj_racuna}</td>
                <td>{detail.detalji.stanje_racuna}{detail.detalji.valuta == null ? ' RSD' : ` ${detail.detalji.valuta}`}</td>
                <td>{detail.detalji.odrzavanje}{detail.detalji.valuta == null ? ' RSD/mes' : ` ${detail.detalji.valuta}/mes`}</td>
                <td>{detail.detalji.kamata != null ? `${detail.detalji.kamata}%` : '/'}</td>
                <td>{detail.detalji.dozvoljeni_minus != null ? detail.detalji.dozvoljeni_minus + ' RSD': '/'}</td>
                <td>{detail.detalji.valuta != null ? detail.detalji.valuta : 'RSD'}</td>
                <td style={{textTransform: 'capitalize'}}>{detail.detalji.tip_stednje != null ? detail.detalji.tip_stednje : '/'}</td>
                <td><input type="radio" onChange={(e)=>{handleDeleteRadioBtn(e)}} name="delete-account-radio-btn" id={`${detail.tip} ${detail.detalji.id}`} className="user-bank-accounts-radio-button-to-delete"/></td>
            </tr>
            ) 
          }  else if(selectedBankFilter === detail.banka.naziv) {
              return (          
                <tr className='red' key={detail.id}>
                    <td>{detail.detalji.id}</td>
                    <td style={{textTransform:'capitalize'}}>{detail.tip}</td>
                    <td>{detail.banka.naziv}</td>
                    <td>{detail.detalji.broj_racuna}</td>
                    <td>{detail.detalji.stanje_racuna}{detail.detalji.valuta == null ? ' RSD' : ` ${detail.detalji.valuta}`}</td>
                    <td>{detail.detalji.odrzavanje}{detail.detalji.valuta == null ? ' RSD/mes' : ` ${detail.detalji.valuta}/mes`}</td>
                    <td>{detail.detalji.kamata != null ? `${detail.detalji.kamata}%` : '/'}</td>
                    <td>{detail.detalji.dozvoljeni_minus != null ? detail.detalji.dozvoljeni_minus + ' RSD': '/'}</td>
                    <td>{detail.detalji.valuta != null ? detail.detalji.valuta : 'RSD'}</td>
                    <td style={{textTransform: 'capitalize'}}>{detail.detalji.tip_stednje != null ? detail.detalji.tip_stednje : '/'}</td>
                    <td><input type="radio" onChange={(e)=>{handleDeleteRadioBtn(e)}} name="delete-account-radio-btn" id={`${detail.tip} ${detail.detalji.id}`} className="user-bank-accounts-radio-button-to-delete"/></td>
                </tr>
                )
            } 
          })}
  
      </tbody>
    </table>
    </div>
        
    <div className="user-account-action-buttons-container">

      <div style={{display:'flex',justifyContent:'end',flex:'1'}}>
        <button onClick={()=>{handleBankAccountDelete()}} className="delete-user-bank-account-button">Obriši Račun</button>
      </div>
      <div style={{display:'flex',justifyContent:'start',flex:'1'}}>
        <button className="create-user-bank-account-button" onClick={()=>openOptionWindor()}>Otvori Račun</button>
       
      </div>

    </div>

  </>
  }

 </>
 }
</>}
    
  {(clickedBank && tipTabele==='banke') && <OneBank details={oneBank} closeDetails={closeDetails}/>}
  {(clickedUser && tipTabele==='korisnici') && <OneUser details={oneKorisnik} closeDetails={closeDetails}/>}
  {noAccountToDeleteChosen && <PopUp closeMessageBox={closeMessageBox} messageText={"Izaberite račun za brisanje!"} />}
  {bankAccountDeleted && <PopUp closeMessageBox={closeMessageBox} messageText={"Račun je obrisan!"} />}
  {clickedOprcije && <Options userId={location.state.id}/>}
</>
  )
}

export default Table
