import React, {useState, useEffect } from 'react'
import '../css/Menjacnica.css';
import KursnaLista from './KursnaLista';
import {Link} from 'react-router-dom';

const Menjacnica = () => {
    const [inputDatum, setInputDatum] = useState('');

    useEffect( () => {
        setInputDatum(new Date().toISOString().split('T')[0]);
    }, [])

    const handleDatePicker = (event) => {
        setInputDatum(event.target.value);
    }

  return (
    
        <div className="main-container-menjacnica">
            <div className="first-column-menjacnica">
                <div style={{display:'flex', width:'100%', justifyContent:'center'}}>
                    <h2>Kursna Lista</h2>
                </div>

                <div style={{display:'flex', width:'100%', justifyContent:'center'}}>
                    <p style={{marginBottom:'2em'}}>Za datum: <strong>{inputDatum == '' ? <></>: `${inputDatum.split('-')[2]}. ${inputDatum.split('-')[1]}. ${inputDatum.split('-')[0]}`}</strong> </p>
                </div>

                <div style={{display:'flex', width:'100%', justifyContent:'center'}}>
                    <p style={{marginBottom:'0.3em'}}>Izaberite datum za prikaz kursne liste</p>
                </div>

                <div className="date-picker-container-menjacnica">
                    <input type="date" id="date-picker-menjacnica" value={inputDatum} onChange={(e)=> {handleDatePicker(e)}} />
                </div>

                <div className="button-container-menjacnica">
                    <div>
                        <button id="buy-button">
                            <Link className="menjacnica-link" to="buy">
                                Kupovina
                            </Link>
                        </button>
                    </div>

                    <div>
                        <button id="sell-button">
                            <Link className="menjacnica-link" to="sell">
                                Prodaja
                            </Link>
                        </button>
                    </div>
                </div>
                
            </div>

            <div className="second-column-menjacnica">
                {inputDatum && <KursnaLista date={inputDatum} logout={"no"} />}
            </div>
        </div>
        
  )
}

export default Menjacnica
