import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ScrollProgressBar from './ScrollProgressBar';

const breadcrumbNameMap = {
  user: 'Korisnik',
  register: 'Kreiranje naloga',
  home: 'Početna',
  login: 'Prijava',
  logout: 'Odjava',
  'detalji-naloga': 'Detalji naloga',
  'upload-photo': 'Postavi sliku',
  'new-transaction': 'Nova transakcija',
  'interna-transakcija': 'Interna transakcija',
  'eksterna-transakcija': 'Eksterna transakcija',
  'zakazane-transakcije': 'Zakazana plaćanja',
  menjacnica: 'Menjačnica',
  buy: 'Kupovina',
  sell: 'Prodaja',
  charts: 'Grafikoni',
  'kursna-lista': 'Kursna lista',
  admin: 'Admin',
  'informacije-o-nalogu-system-admin': 'Detalji naloga',
  'informacije-o-nalogu-sub-admin': 'Detalji naloga',
  'svi-korisnici': 'Korisnici',
  'kreiraj-korisnika': 'Kreiranje korisnika',
  'sve-banke': 'Banke',
  'kreiranje-banke': 'Kreiranje banke',
  'bankovni-racuni-korisnika': 'Računi korisnika',
  tekuci: 'Kreiranje tekućeg računa',
  stedni: 'Kreiranje štednog računa',
  devizni: 'Kreiranje deviznog računa',
  studentski: 'Kreiranje studentskog računa',
  sub: 'Sub-admin',
  racuni: 'Računi',
  racuni_izrabranog_korisnika: 'Računi korisnika',
};

// Segments that act as intermediate path steps but should redirect to a logical page
const getRedirectMap = () => {
  const isSubAdmin = window.sessionStorage.getItem('sub_admin_auth_token') != null;
  return {
    '/user': '/user/home',
    '/user/new-transaction': '/user/home',
    '/admin': isSubAdmin ? '/admin/home/sub' : '/admin/home',
    '/admin/home': isSubAdmin ? '/admin/home/sub' : '/admin/home',
  };
};

// These path segments are displayed as plain text (not clickable links)
const nonNavigable = new Set([
  '/admin/svi-korisnici/bankovni-racuni-korisnika',
  '/admin/svi-korisnici/bankovni-racuni-korisnika/tekuci',
  '/admin/svi-korisnici/bankovni-racuni-korisnika/stedni',
  '/admin/svi-korisnici/bankovni-racuni-korisnika/devizni',
  '/admin/svi-korisnici/bankovni-racuni-korisnika/studentski',
]);

const Breadcrumbs = () => {
  const location = useLocation();

  const isLoggedIn =
    window.sessionStorage.getItem('user_auth_token') != null ||
    window.sessionStorage.getItem('admin_auth_token') != null ||
    window.sessionStorage.getItem('sub_admin_auth_token') != null;

  if (!isLoggedIn) return null;

  const redirectMap = getRedirectMap();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav style={{
      backgroundColor: '#9A616D',
      fontSize: '1.2em',
      padding: '.75em',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '2px',
    }}>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[value] || decodeURIComponent(value);
        const isLast = index === pathnames.length - 1;
        const linkTo = redirectMap[to] || to;
        const color = isLast ? 'yellow' : 'white';

        const separator = !isLast
          ? <span style={{ color: 'white', margin: '0 6px' }}>/</span>
          : null;

        if (nonNavigable.has(to)) {
          return (
            <span key={to} style={{ color }}>
              {name}{separator}
            </span>
          );
        }

        return (
          <span key={to}>
            <Link to={linkTo} style={{ textDecoration: 'none', color }}>
              {name}
            </Link>
            {separator}
          </span>
        );
      })}
      <ScrollProgressBar />
    </nav>
  );
};

export default Breadcrumbs;
