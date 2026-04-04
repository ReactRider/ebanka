import React from 'react';
import '../css/CreateNew.css';
import { useState, useEffect } from 'react';
import PopUp from './PopUp';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const CrateNewBank = () => {
    const [isBankCreated, setIsBankCreated] = useState(false);
    const [isBankFailed, setIsBankFailed] = useState(false);
    const [bankaData, setBankaData] = useState({
            naziv: '',
            grad: '',
            broj_dozvole: ''
        });
    const navigate=useNavigate();
    const location=useLocation();
    const {toModify = false, details = {} } = location.state || {};

    useEffect(() => {
            if(toModify && details) {
                setBankaData( prev => ({
                    ...prev,
                    ...details
                }))
                
            }
        }, [toModify, details]);

    function handleInput(e) {
        const { name, value } = e.target;

        setBankaData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const closeMessageBox = () => {
        setIsBankCreated(false);
        window.history.back();
    }
    const closeMessageBoxFailed = () => {
        setIsBankFailed(false);
    }

    function handleReset() {
        if(!window.confirm("Da li ste sigurni?")) {
            return;
        }  

        let input_elems = document.querySelectorAll("input, select");

        for(let i = 0; i < input_elems.length; i++) 
            input_elems[i].value = "";
    }

    function handleRegistration(e) {
        if(!window.confirm("Da li ste sigurni?")) {
            return;
        }

        e.preventDefault();

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/api/admin/banke',
            headers: { 
                'Authorization': 'Bearer ' + window.sessionStorage.getItem("admin_auth_token")
            },
            data: bankaData
        };  
              
        axios.request(config)
        .then( (res) => {
            setIsBankCreated(true);
        })
        .catch((e) => {
            setIsBankFailed(true);
            console.log(e);
        });
        
    }


    function handleBankUpdate() {
        if(!window.confirm("Da li ste sigurni?")) return;
            
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `http://127.0.0.1:8000/api/admin/banke/${details.id}`,
            headers : {
                'Authorization' : 'Bearer ' + window.sessionStorage.getItem("admin_auth_token")
            },
            data: bankaData
        }

        axios.request(config)
        .then( (res) => {
            console.log(res.data);
            console.log("successful user update");
        })
        .catch( (e) => {
            console.log("Desila se greska: " + e);
        })

        navigate("/admin/sve-banke");
    }


  return (
    <div className="main-container-create-new-bank">
        <div className="title-container-create-new-user"> 
            <h1>Kreiranje naloga banke</h1>
        </div>

        <div className="columns-container-create-new-user">
        <div className="single-input-container-create-new-bank">
                <label htmlFor="naziv">Naziv: </label>
                <input value={bankaData['naziv']} onChange={handleInput} type="text" name="naziv" className="input-create-new-bank" id="naziv" required/>
            </div>

            <div className="single-input-container-create-new-user">
            <label htmlFor="grad">Grad: </label>
                <select value={bankaData.grad} onChange={handleInput} name="grad" className="city-select-create-new-bank" id="grad" required>
                    <option value="default" disabled selected>/</option>
                    <optgroup label="A">
                        <option value="Abu Dabi">Abu Dabi</option>
                        <option value="Adis Abeba">Adis Abeba</option>
                        <option value="Akra">Akra </option>
                        <option value="Alžir">Alžir</option>
                        <option value="Aman">Aman</option>
                        <option value="Amsterdam">Amsterdam</option>
                        <option value="Andora la Velja">Andora la Velja</option>
                        <option value="Ankara">Ankara </option>
                        <option value="Antananarivo">Antananarivo </option>
                        <option value="Apija">Apija </option>
                        <option value="Asmara">Asmara</option>
                        <option value="Astana">Astana</option>
                        <option value="Asunsion">Asunsion</option>
                        <option value="Atina">Atina</option>
                    </optgroup>

                    <optgroup label="B">
                        <option value="Bagdad">Bagdad</option>
                        <option value="Baku">Baku</option>
                        <option value="Bamako">Bamako</option>
                        <option value="Bandar Seri Begavan">Bandar Seri Begavan</option>
                        <option value="Bandžul">Bandžul </option>
                        <option value="Bangi">Bangi</option>
                        <option value="Bangkok">Bangkok</option>
                        <option value="Banjul">Banjul </option>
                        <option value="Basseter">Basseter</option>
                        <option value="Beirut">Beirut</option>
                        <option value="Belmopan">Belmopan </option>
                        <option value="Beograd">Beograd</option>
                        <option value="Berlin">Berlin </option>
                        <option value="Bern">Bern</option>
                        <option value="Beč">Beč</option>
                        <option value="Bisau">Bisau </option>
                        <option value="Biškek">Biškek</option>
                        <option value="Blumfontejn">Blumfontejn</option>
                        <option value="Bogota">Bogota</option>
                        <option value="Bratislava">Bratislava</option>
                        <option value="Brazzaville">Brazzaville</option>
                        <option value="Bridžtaun">Bridžtaun </option>
                        <option value="Brisel">Brisel </option>
                        <option value="Buenos Ajres">Buenos Ajres </option>
                        <option value="Bujumbura">Bujumbura</option>
                        <option value="Bukurešt">Bukurešt </option>
                    </optgroup>


                    <optgroup label="D">
                        <option value="Dablin">Dablin</option>
                        <option value="Daka">Daka</option>
                        <option value="Damask">Damask</option>
                        <option value="Dili">Dili</option>
                        <option value="Dodoma">Dodoma </option>
                        <option value="Doha">Doha</option>
                        <option value="Dušanbe">Dušanbe </option>
                    </optgroup>

                    <optgroup label="F">
                        <option value="Funafuti">Funafuti</option>
                    </optgroup>

                    <optgroup label="G">
                        <option value="Gaborone">Gaborone</option>
                        <option value="Gitega">Gitega</option>
                        <option value="Guatemala Siti">Guatemala Siti</option>
                    </optgroup>

                    <optgroup label="H">
                        <option value="Hanoj">Hanoj</option>
                        <option value="Harare">Harare</option>
                        <option value="Havana">Havana</option>
                        <option value="Helsinki">Helsinki</option>
                        <option value="Honiara">Honiara</option>
                    </optgroup>

                    <optgroup label="I">
                        <option value="Islamabad">Islamabad</option>
                    </optgroup>

                    <optgroup label="J">
                        <option value="Jamajka">Jamajka</option>
                        <option value="Jamena">Jamena</option>
                        <option value="Jaunde">Jaunde </option>
                        <option value="Jerevan">Jerevan</option>
                        <option value="Jerusalim">Jerusalim</option>
                    </optgroup>

                    <optgroup label="K">
                        <option value="Kabul">Kabul</option>
                        <option value="Kairo">Kairo</option>
                        <option value="Kampala">Kampala</option>
                        <option value="Kanbera">Kanbera</option>
                        <option value="Karakas">Karakas</option>
                        <option value="Katmandu">Katmandu</option>
                        <option value="Kejptaun">Kejptaun</option>
                        <option value="Kigali">Kigali</option>
                        <option value="Kijev">Kijev</option>
                        <option value="Kingstaun">Kingstaun</option>
                        <option value="Kingston">Kingston</option>
                        <option value="Kinšasa">Kinšasa</option>
                        <option value="Kišinjev">Kišinjev</option>
                    </optgroup>

                    <optgroup label="L">
                        <option value="La Paz">La Paz</option>
                        <option value="Libervil">Libervil</option>
                        <option value="Lilongve">Lilongve</option>
                        <option value="Lima">Lima</option>
                        <option value="Lisabon">Lisabon</option>
                        <option value="Lome">Lome</option>
                        <option value="London">London</option>
                        <option value="Luada">Luada</option>
                        <option value="Luksemburg">Luksemburg</option>
                        <option value="Lusaka">Lusaka</option>
                    </optgroup>

                    <optgroup label="M">
                        <option value="Madrid">Madrid</option>
                        <option value="Malabo">Malabo</option>
                        <option value="Male">Male</option>
                        <option value="Managva">Managva</option>
                        <option value="Manama">Manama</option>
                        <option value="Manila">Manila</option>
                        <option value="Maputo">Maputo</option>
                        <option value="Maseru">Maseru</option>
                        <option value="Maskat">Maskat</option>
                        <option value="Madžuro">Madžuro</option>
                        <option value="Mbabane">Mbabane</option>
                        <option value="Meksiko">Meksiko</option>
                        <option value="Minsk">Minsk</option>
                        <option value="Mogadis">Mogadis</option>
                        <option value="Monako">Monako</option>
                        <option value="Mondovija">Mondovija</option>
                        <option value="Montevideo">Montevideo</option>
                        <option value="Moroni">Moroni</option>
                        <option value="Moskva">Moskva</option>
                    </optgroup>

                    <optgroup label="N">
                        <option value="Najrobi">Najrobi</option>
                        <option value="Nasau">Nasau</option>
                        <option value="Ngerulmud">Ngerulmud</option>
                        <option value="Nejpjudo">Nejpjudo</option>
                        <option value="Nijamaj">Nijamaj</option>
                        <option value="Nikozija">Nikozija</option>
                        <option value="Nuakšot">Nuakšot</option>
                        <option value="Nju Delhi">Nju Delhi</option>
                    </optgroup>

                    <optgroup label="O">
                        <option value="Oslo">Oslo</option>
                        <option value="Otava">Otava</option>
                    </optgroup>

                    <optgroup label="P">
                        <option value="Palkiri">Palkiri</option>
                        <option value="Panama">Panama</option>
                        <option value="Paramaribo">Paramaribo</option>
                        <option value="Pariz">Pariz</option>
                        <option value="Peking">Peking</option>
                        <option value="Pjonjang">Pjonjang</option>
                        <option value="Podgorica">Podgorica</option>
                        <option value="Port Vila">Port Vila</option>
                        <option value="Port Luj">Port Luj</option>
                        <option value="Port Morzbi">Port Morzbi</option>
                        <option value="Port o Prens">Port o Prens</option>
                        <option value="Porto Novo">Porto Novo</option>
                        <option value="Prag">Prag</option>
                        <option value="Praja">Praja</option>
                        <option value="Pretorija">Pretorija</option>
                    </optgroup>


                    <optgroup label="R">
                        <option value="Rabat">Rabat</option>
                        <option value="Rejkjavik">Rejkjavik</option>
                        <option value="Riga">Riga</option>
                        <option value="Rijad">Rijad</option>
                        <option value="Rim">Rim</option>
                        <option value="Rozo">Rozo</option>
                    </optgroup>

                    <optgroup label="S">
                        <option value="San Marino">San Marino</option>
                        <option value="San Salvador">San Salvador</option>
                        <option value="San Hose">San Hose</option>
                        <option value="Sana">Sana</option>
                        <option value="Santijago">Santijago</option>
                        <option value="Santo Domingo">Santo Domingo</option>
                        <option value="Sao Tome">Sao Tome</option>
                        <option value="Sarajevo">Sarajevo</option>
                        <option value="Sent Džons">Sent Džons</option>
                        <option value="Sent Džordžis">Sent Džordžis</option>
                        <option value="Seul">Seul</option>
                        <option value="Singapur">Singapur</option>
                        <option value="Skoplje">Skoplje</option>
                        <option value="Sofija">Sofija</option>
                        <option value="Stokholm">Stokholm</option>
                        <option value="Suva">Suva</option>
                  </optgroup>

                    <optgroup label="T">
                        <option value="Talin">Talin</option>
                        <option value="Taškent">Taškent</option>
                        <option value="Tbilisi">Tbilisi</option>
                        <option value="Tegusigalp">Tegusigalp</option>
                        <option value="Teheran">Teheran</option>
                        <option value="Timbu">Timbu</option>
                        <option value="Tirana">Tirana</option>
                        <option value="Tokio">Tokio</option>
                        <option value="Tripoli">Tripoli</option>
                        <option value="Tunis">Tunis</option>
                    </optgroup>

                    <optgroup label="U">
                        <option value="Uagadugu">Uagadugu</option>
                        <option value="Uan Bator">Uan Bator</option>
                    </optgroup>

                    <optgroup label="V">
                        <option value="Vaduc">Vaduc</option>
                        <option value="Valeta">Valeta</option>
                        <option value="Varšava">Varšava</option>
                        <option value="Vatikan">Vatikan</option>
                        <option value="Vašington">Vašington</option>
                        <option value="Velington">Velington</option>
                        <option value="Vijetnam">Vijetnam</option>
                        <option value="Viktorija">Viktorija</option>
                        <option value="Vilnjus">Vilnjus</option>
                        <option value="Vinduhuk">Vinduhuk</option>

                    </optgroup>


                    <optgroup label="Z">
                        <option value="Zagreb">Zagreb</option>
                    </optgroup>

                    <optgroup label="Dž">
                        <option value="Džakarta">Džakarta</option>
                        <option value="Džibuti">Džibuti</option>
                        <option value="Džordžtaun">Džordžtaun</option>
                        <option value="Džuba">Džuba</option>

                    </optgroup>

                </select>

            </div>

            <div className="single-input-container-create-new-user">
                <label htmlFor="broj_dozvole">Broj dozvole: </label>
                <input value={bankaData['broj_dozvole']} onChange={handleInput} type="number" name="broj_dozvole" className="input-create-new-bank" id="broj_dozvole" placeholder="Unesite petocifreni broj" required/>
            </div>
        </div>

        <div className="buttons-main-container-create-new-user">
            {location.state ?
            <> 
                <div className="button-container-first-create-new-user">
                    <button className="create-new-user-button" onClick={handleBankUpdate}>Ažuriraj Banku</button>
                </div>
            </> 
            :
            <>
                <div className="button-container-first-create-new-user">
                    <button className="create-new-user-button" onClick={handleRegistration}>Kreiraj Banku</button>
                </div>
            </>} 

            <div className="button-container-second-create-new-user">
                <button className="create-new-user-button" onClick={handleReset}>Poništi Unos</button>
            </div>
      </div>
      
        {isBankCreated && <PopUp closeMessageBox={closeMessageBox} messageText={"Banka je uspešno kreirana!"}/>}

        {isBankFailed && <PopUp closeMessageBox={closeMessageBoxFailed} messageText={"Nastala je greška. Proverite unos."}/> }

    </div>
  )
}

export default CrateNewBank
