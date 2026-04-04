import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ScrollProgressBar from './ScrollProgressBar';

const breadcrumbNameMap = {
  user: "Korisnik",
  register: "Kreiranje Naloga",
  home: "Početna",
  login: "Prijava",
  logout: 'Odjava',
  'detalji-naloga': 'Detalji naloga',
  'upload-photo': 'Postavi sliku',
  'new-transaction': 'Nova transakcija',
  'interna-transakcija': 'Interna transakcija',
  'eksterna-transakcija': 'Eksterna transakcija',
  menjacnica: 'Menjačnica',
  buy: 'Kupovina',
  sell: 'Prodaja',
  charts: 'Grafikoni',
  admin: "Admin",
  "informacije-o-nalogu": "Detalji Naloga",
  "svi-korisnici": "Korisnici",
  "kreiraj-korisnika": "Kreiranje Korisnika",
  "sve-banke": "Banke",
  "kreiranje-banke": "Kreiranje Banke",
  "bankovni-racuni-korisnika": " Računi korisnika",
  "tekuci" : "Kreiranje tekućeg računa",
  "stedni": "Kreiranje štednog računa",
  "devizni": "Kreiranje deviznog računa",
  "studentski": "Kreiranje studentskog računa"
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav style={{ backgroundColor: '#9A616D', fontSize: '1.2em', padding: '.75em', display: window.sessionStorage.getItem('user_auth_token') == null && window.sessionStorage.getItem("admin_auth_token")== null ? 'none' : 'flex'}}>
      {
        pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[value] || decodeURIComponent(value);
        const isLast = index === pathnames.length - 1;

        return (
          <span key={to}>
            {to === "/admin/svi-korisnici/bankovni-racuni-korisnika" || to === "/admin/svi-korisnici/bankovni-racuni-korisnika/studentski" || to === "/admin/svi-korisnici/bankovni-racuni-korisnika/tekuci" || to === "/admin/svi-korisnici/bankovni-racuni-korisnika/stedni" || to === "/admin/svi-korisnici/bankovni-racuni-korisnika/devizni" ? <p style={{color: isLast ? "yellow" : "#fff"}}>{name} / </p> : (
            <Link to={to === "/user" || to === "/user/new-transaction"  ? "user/home" : (to ==="/admin" ? "admin/home" : (to === "/admin/bankovni-racuni-korisnika" ? "admin/svi-korisnici" : (to === "/admin/kreiranje-racuna/tekuci" || to === "/admin/kreiranje-racuna/stedni" || to === "/admin/kreiranje-racuna/studentski" || to === "/admin/kreiranje-racuna/devizni" ? "" : (to === "/admin/svi-korisnici/bankovni-racuni-korisnika" ? "/admin/svi-korisnici/bankovni-racuni-korisnika" : to)) ))} style={{ textDecoration: 'none', color: isLast ? 'yellow' : 'white'}} > 
               {name == "kursna-lista" ? 
              ( window.sessionStorage.getItem("admin_auth_token") != null ?
              "Admin / Kursna-Lista"
                :
              window.sessionStorage.getItem("type") != null ? 
              "Korisnik / Kursna-Lista" : "Admin / Kursna-Lista" ) :  name } /
            </Link>)}
          </span>
        );

      })}
      <ScrollProgressBar/>
    </nav>
);

};

export default Breadcrumbs;
