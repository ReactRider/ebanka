import {React} from 'react'
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {ImSwitch} from 'react-icons/im';
import {MdPeopleAlt} from 'react-icons/md';
import "../css/Navbar.css";
import {GrTransaction} from 'react-icons/gr';
import {FaMoneyCheck} from 'react-icons/fa6';
import {IoCash} from 'react-icons/io5';
import { HiCurrencyEuro } from "react-icons/hi2";
import { MdHome } from 'react-icons/md';
import { MdLogin } from 'react-icons/md';
import Breadcrumb from './Breadcrumb.jsx';


const NewNavBar = ({login}) => {
  return (
    <>
      <div className={`${(login===1 || login===2 || login===3) ? "container-nav-logged-in" : "container-nav-logged-out"}`} >

        <div className={`${(login === 1) ? "container-first-group-logged-in" : "container-first-group-logged-out"}`}>

          <div className="app-logo">
            <Link
              className="navbar-brand"
              to={
                login === 1 ? '/user/home' :
                login === 2 ? '/admin/home' :
                login === 3 ? '/admin/home/sub' :
                '/user/login'
              }
            >
              E-Banka
            </Link>
          </div>

          <div className={`${(login === 1) ? "nav-items-logged-in" : "nav-items-logged-out"}`}>
            {/* Postojeća logika za login 0 i admina */}
            {(login === 0 && window.sessionStorage.getItem("type") != null) ? (
              <>
                <div className="nav-item-kursna-lista ">
                  <a className="nav-link" href="/kursna-lista">
                    Kursna lista <HiCurrencyEuro style={{width:'1.5em', height:'1.5em'}} />
                  </a>
                </div>
                <div className="nav-item-kursna-lista">
                  <a className="nav-link" href="/user/login">
                    Prijava <MdLogin style={{width:'1.5em', height:'1.5em'}} />
                  </a>
                </div>
              </>
            ) : (login===2 && window.sessionStorage.getItem("admin_auth_token") !== null ? (
              <>
                <div className="nav-item-kursna-lista ">
                  <a className="nav-link" href="/admin/home">
                    Administracija <MdHome size={27}/>
                  </a>
                </div>
                <div className="nav-item-kursna-lista ">
                  <a className="nav-link" href="/kursna-lista">
                    Kursna lista <HiCurrencyEuro style={{width:'1.5em', height:'1.5em'}} />
                  </a>
                </div>
              </>
            ) : (login===3 && window.sessionStorage.getItem("sub_admin_auth_token") !== null ? (<>
                <div className="nav-item-kursna-lista ">
                  <a className="nav-link" href="/admin/home/sub">
                    Korisnici <MdPeopleAlt style={{width:'1.5em', height:'1.5em'}} />
                  </a>
                </div>
                <div className="nav-item-kursna-lista ">
                  <a className="nav-link" href="/admin/home/sub/racuni">
                    Računi <FaMoneyCheck style={{width:'1.5em', height:'1.5em'}} />
                  </a>
                </div>
            </>) :(
                <>
                <div className="nav-item-kursna-lista ">
                  <a className="nav-link" href="/kursna-lista">
                    Kursna lista <HiCurrencyEuro style={{width:'1.5em', height:'1.5em'}} />
                  </a>
                </div>
                <div className="nav-item-kursna-lista">
                  <a className="nav-link" href="/admin/login">
                    Prijava <MdLogin size={28} />
                  </a>
                </div>
              </>
            )))}

          </div>

        </div>

        <div className={`${(login === 1 || login===2 || login === 3) ? "container-second-group-logged-in" : "container-second-group-logged-out"}`}>
          <div className="second-group-first-subgroup">
            {login === 1 && (
              <>
                <div className="nav-item">
                  <Link to="user/home" className="nav-link" >
                    Računi <FaMoneyCheck style={{width:'1.5em', height:'1.5em'}} />
                  </Link>
                </div>
                <div className="nav-item">
                  <Link to="user/new-transaction" className="nav-link" >
                    <div className="nav-item">
                      <label type="button" className="nav-item" data-bs-toggle="dropdown" aria-expanded="false">
                        Plaćanja <IoCash style={{width:'1.5em', height:'1.5em'}} />
                      </label>
                      <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="user/new-transaction/interna-transakcija">Interno plaćanje</Link></li>
                        <li><Link className="dropdown-item" to="user/new-transaction/eksterna-transakcija">Eksterno plaćanje</Link></li>
                        <li><Link className="dropdown-item" to="user/zakazane-transakcije">Zakazana plaćanja</Link></li>
                      </ul>
                    </div>
                  </Link>
                </div>
                <div className="nav-item">
                  <Link to="user/menjacnica" className="nav-link" >
                    Menjacnica <GrTransaction style={{width:'1.5em', height:'1.5em'}} />
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="second-group-second-subgroup">
            {login === 1 && (
              <div className="nav-item">
                <Link to="user/detalji-naloga" className="nav-link" >
                  Detalji naloga <MdPeopleAlt style={{width: '1.5em', height: '1.5em'}} />
                </Link>
              </div>
            )}
            {login === 2 && window.sessionStorage.getItem("admin_auth_token") !== null && (
              <div className="nav-item">
                <Link to="admin/informacije-o-nalogu-system-admin" className="nav-link" >
                  Detalji naloga <MdPeopleAlt style={{width: '1.5em', height: '1.5em'}} />
                </Link>
              </div>
            )}
            {/* Dodato za login === 3, ako treba dodatni link ovde */}
            {login === 3 && window.sessionStorage.getItem("sub_admin_auth_token") !== null &&(
              <div className="nav-item">
                <Link to="admin/informacije-o-nalogu-sub-admin" className="nav-link" >
                  Detalji naloga <MdPeopleAlt style={{width: '1.5em', height: '1.5em'}} />
                </Link>
              </div>
            )}
            <div className="nav-item">
              {window.sessionStorage.getItem("user_auth_token") == null ? (
                <>
                  {window.sessionStorage.getItem("admin_auth_token") != null ? <a className="nav-link" href="/admin/logout">Odjava <ImSwitch style={{ width: '1.5em', height: '1.5em'}} /></a> : (
                    <>{
                        window.sessionStorage.getItem("sub_admin_auth_token")== null ? <></> : <a className="nav-link" href="/admin/logout">Odjava <ImSwitch style={{ width: '1.5em', height: '1.5em'}} /></a>
                    }</>
                  )}
                </>
              ) : (
                <a className="nav-link" href="/user/logout">Odjava <ImSwitch style={{ width: '1.5em', height: '1.5em'}} /></a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Breadcrumb/>
      <Outlet/>
    </>
  );
};

export default NewNavBar;


