import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../css/Options.css';

const Options = ({userId}) => {

    const navigate=useNavigate();
    const opcije = [
          { label: 'Tekući račun', url: '/admin/svi-korisnici/bankovni-racuni-korisnika/tekuci' },
          { label: 'Studentski račun', url: '/admin/svi-korisnici/bankovni-racuni-korisnika/studentski' },
          { label: 'Devizni račun', url: '/admin/svi-korisnici/bankovni-racuni-korisnika/devizni' },
          { label: 'Štedni račun', url: '/admin/svi-korisnici/bankovni-racuni-korisnika/stedni' }
        ];
    const correctLink=(o, ID)=>{
        navigate(o.url, {state: {ID}});
    }

  return (
    <div>
      <div className='container-option'>
        <p className='title-izbor'>Izaberite tip računa koji želite da kreirate:</p>
         <div className='two-containers'>
        {opcije.map((o,index)=>{
          return(
          <div key={index}>
            <button className='buttons-second' onClick={()=>correctLink(o, userId)}>{o.label}</button>
          </div>)
        })}
      </div>
      </div>
    </div>
  )
}

export default Options
