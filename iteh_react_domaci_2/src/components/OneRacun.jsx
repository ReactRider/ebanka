import React, { useEffect } from 'react';
import '../css/AccountsCarousel.css';
import {IoCashOutline} from 'react-icons/io5';
import {Link} from 'react-router-dom';
import {IoBarChartSharp} from 'react-icons/io5';

const OneRacun = ({racun}) => {

  return (
    <>
    <div className="left-column">
        <p className="broj-racuna">{racun.detalji.broj_racuna}</p>
        <p className="tip-racuna">{racun.tip} račun</p>
        <p className="korisnik">{racun.user.ime} {racun.user.prezime}</p>
        <p className="raspolozivo-stanje-naslov">RASPOLOŽIVO STANJE:</p>
        <p className="stanje-racuna">{racun.detalji.stanje_racuna} {racun.detalji.valuta == null ? <><span className="valuta">RSD</span></> :<span className="valuta">{racun.detalji.valuta}</span>}</p>
        </div>
       <div className="right-column">
         <div className={`${racun.banka.naziv.split(" ")[0]}`}></div> 
         <div className="new-transaction">
         <div>
          <Link to="/user/new-transaction/eksterna-transakcija">
          <IoCashOutline style={{   color: 'green',width: '2.5em',
    height: '2.5em'}}/>
    
         </Link>
         </div>
         <div>
         <Link to="/user/charts">
         <IoBarChartSharp style={{color: 'darkblue', width:'2.5em', height:'2em'}}/>
         </Link>
         </div>
         </div>
       </div>
    </>
  )
}

export default OneRacun
