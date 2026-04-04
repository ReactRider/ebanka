import React from 'react';
import '../css/KursnaLista.css';

const Valuta = ({val}) => {
 
  return (
    <tr>
        <th className='first-col' scope="row" ><span className={`${val.code}`}></span></th>
        <td>
        <p>{val.parity} {val.code}</p>
        </td>
        <td>{val.exchange_buy}</td>
        <td>{val.exchange_middle}</td>
        <td>{val.exchange_sell}</td>
    </tr>
  )
}

export default Valuta
