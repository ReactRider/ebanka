import { BrowserRouter, Router, Routes, Route, Navigate } from 'react-router-dom';
import {useState, useEffect} from "react";
import './App.css';
import LogInPageUser from './components/LogInPageUser';
import RegisterPageUser from './components/RegisterPageUser';
import LogInPageAdmin from './components/LogInPageAdmin';
import UserHome from './components/UserHome';
import AdminHome from './components/AdminHome';
import UserLogout from './components/UserLogout';
import AdminLogout from './components/AdminLogout';
import KursnaLista from './components/KursnaLista';
import AccountInfo from './components/AccountInfo';
import ProfileImageUpload from './components/ProfileImageUpload';
import NewTransaction from './components/NewTransaction';
import Menjacnica from './components/Menjacnica';
import MenjKupovinaProdaja from './components/MenjKupovinaProdaja';
import Charts from './components/Charts';
import Table from './components/Table';
import CreateNewUser from './components/CreateNewUser';
import CreateNewBank from './components/CreateNewBank';
import AccountInfoAdmin from './components/AccountInfoAdmin';
import CreateNewAcc from './components/CreateNewAcc';
import NewNavBar from './components/NewNavBar';
import SubAdminHomeRacun from './components/SubAdminHomeRacun';
import SubAdminHomeKorisnici from './components/SubAdminHome';
import UsersAccPageForAdmin from './components/UsersAccPageForAdmin';

function App() {

  const [logInStatusUser, setLogInStatusUser]=useState(false);
  const [focusedAcc, setFocusedAcc] = useState(null);

  useEffect( () => {
    if(window.sessionStorage.getItem("user_auth_token") != null)
      setLogInStatusUser(true);
  },[]);

  const handleLogInStatus = (status) => {
    setLogInStatusUser(status);
  }

  const handleAccountFocus = (acc) => {
    setFocusedAcc(acc);
  }

  return (
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Navigate to="/user/login"/>} />

          <Route path="/" element={<NewNavBar login={1}/>}>
            <Route path="user/home" element={<UserHome accountFocus={handleAccountFocus} focusedAcc={focusedAcc}/> }/>
            <Route path="user/logout" element={<UserLogout handleLogInStatus={handleLogInStatus}/>} />
            <Route path="user/detalji-naloga" element={<AccountInfo/>}/>
            <Route path="user/upload-photo" element={<ProfileImageUpload/>}/>
            <Route path="user/new-transaction/interna-transakcija" element={<NewTransaction focusedAcc={focusedAcc} tip={'interna'}/>}/>
            <Route path="user/new-transaction/eksterna-transakcija" element={<NewTransaction focusedAcc={focusedAcc} tip={'eksterna'}/>}/>
            <Route path="user/menjacnica" element={<Menjacnica />} />
            <Route path="user/menjacnica/buy" element={<MenjKupovinaProdaja action={"buy"}/>} />
            <Route path="user/menjacnica/sell" element={<MenjKupovinaProdaja action={"sell"}/>} />
            <Route path="user/charts" element={<Charts focusedAcc={focusedAcc}/>}/>
          </Route>

          <Route path="/" element={<NewNavBar login={2}/>}>
            <Route path="admin/svi-korisnici" element={<Table tipTabele={'korisnici'}/>} />
            <Route path="admin/home" element={<AdminHome /> } />
            <Route path="admin/logout" element={<AdminLogout/>} />
            <Route path="admin/kursna-lista" element={<KursnaLista date={"today"}  />} />
            <Route path="admin/kreiraj-korisnika" element={<CreateNewUser />} />
            <Route path="admin/sve-banke" element={<Table tipTabele={'banke'}/>}/>
            <Route path="admin/kreiranje-banke" element={<CreateNewBank/>}/>
            <Route path="admin/informacije-o-nalogu-system-admin" element={<AccountInfoAdmin tip={'system'}/>}/>
            <Route path="admin/svi-korisnici/bankovni-racuni-korisnika" element={<Table tipTabele={'racuni-korisnika'} />} />
            <Route path="admin/svi-korisnici/bankovni-racuni-korisnika/tekuci" element={<CreateNewAcc tipRacuna={'tekuci'}/>}/>
            <Route path="admin/svi-korisnici/bankovni-racuni-korisnika/devizni" element={<CreateNewAcc tipRacuna={'devizni'}/>}/>
            <Route path="admin/svi-korisnici/bankovni-racuni-korisnika/stedni" element={<CreateNewAcc tipRacuna={'stedni'}/>}/>
            <Route path="admin/svi-korisnici/bankovni-racuni-korisnika/studentski" element={<CreateNewAcc tipRacuna={'studentski'}/>}/>
            
          </Route>

          <Route path="/" element={<NewNavBar login={3}/>}>
            <Route path="admin/home/sub" element={<SubAdminHomeKorisnici/>}/>
            <Route path="admin/home/sub/racuni" element={<SubAdminHomeRacun/>}/>
            <Route path="admin/informacije-o-nalogu-sub-admin" element={<AccountInfoAdmin tip={'sub'}/>}/>
            <Route path="admin/home/racuni_izrabranog_korisnika" element={<UsersAccPageForAdmin/>}/>
          </Route>

          <Route path="/" element={<NewNavBar login={0}/>} >
            <Route path="user/login" element={<LogInPageUser handleLogInStatus={handleLogInStatus}/>}/>
            <Route path="user/register" element={<RegisterPageUser/>} />
            <Route path="kursna-lista" element={<KursnaLista date={"today"} logout={"yes"}/>}/>
            <Route path="admin/login" element={<LogInPageAdmin/>} />
          </Route>

          <Route path="*" element={<div>404 Not Found</div>} /> {/* Fallback ruta */}
          
        </Routes>
      </BrowserRouter>
  );
}

export default App;
