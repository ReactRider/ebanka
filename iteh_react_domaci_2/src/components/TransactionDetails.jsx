import React, { useEffect } from 'react'
import "../css/TransactionDetails.css";

const TransactionDetails = ({details, closeDetails}) => {
  return (
    <div className="container-transaction-details">
        <div className="details-header">
            <h2>Detalji transakcije</h2>
        </div>
        
        <div className="details-body">
            <p><strong>ID:</strong> {details.id}</p>
            <p><strong>Datum:</strong> {details.datum}</p>
            <p><strong>Iznos:</strong> {details.iznos} {details.posiljaoc.detalji.hasOwnProperty("valuta") ? details.posiljaoc.detalji.valuta : "RSD"}</p>
            <p><strong>Naziv primaoca:</strong> {details.naziv_primaoca}</p>
            <p><strong>Broj računa primaoca:</strong> {details.broj_racuna_primaoca}</p>
            <p><strong>Broj računa pošiljaoca:</strong> {details.posiljaoc.detalji.broj_racuna}</p>
            <p><strong>Opis:</strong> {details.opis_transakcije}</p>
            <p><strong>Sifra plaćanja:</strong> {details.sifra_placanja}</p>
            <p><strong>Vreme:</strong> {details.vreme}</p>
            <p><strong>Status:</strong> Izvršeno </p>
        </div>

        <div className="details-footer">
            <button onClick={closeDetails} className="close-details-btn">Zatvori</button>
        </div>
    </div>
  )
}

export default TransactionDetails
