import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/RegisterPageUser.css';
import { useState } from 'react';
import axios from 'axios';
import PopUp from './PopUp.jsx';
import ConfirmModal from './ConfirmModal';
import regPhoto from '../slike/registration.jpg';

const RegisterPageUser = () => {
    const navigate = useNavigate();
    const [isUserCreated, setIsUserCreated] = useState(false);
    const [isCorrectJMBG, setIsCorrectJMBG] = useState(true);
    const [isCorrectPhoneNum, setIsCorrectPhoneNum] = useState(true);
    const [isCorrectID, setIsCorrectID] = useState(true);
    const [isCorrectPassword, setIsCorrectPassword] = useState(true);
    const [isCorrectName, setIsCorrectName] = useState(true);
    const [isCorrectSurname, setIsCorrectSurname] = useState(true);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Ako ulogovan korisnik/admin pristupi ruti za registraciju
    useEffect( () => {
      let user = window.sessionStorage.getItem("user_auth_token");
      let admin = window.sessionStorage.getItem("admin_auth_token");

      if(user != null) 
        navigate("/user/home");
      else if(admin != null)
        navigate("/admin/home");

    }, [navigate]);

    const [userData, setUserData] = useState({
        ime: "",
        prezime: "",
        email: "",
        password: "",
        adresa: "",
        grad: "",
        datum_rođenja: "",
        maticni_broj: "",
        broj_licne_karte: "",
        broj_telefona: "",
        drzava: ""
    });

    function handleReset() {
        let input_elems = document.getElementsByTagName("input");

        for(let i = 0; i < input_elems.length; i++) 
            input_elems[i].value = "";
    }

    function handleInput(e) {
      let {name, value} = e.target;

      if(name === "maticni_broj" && value.length === 13) 
        value = value.replace(/\D/g, '');
      if(name === "broj_telefona" && value.length === 10)
        value = value.replace(/\D/g, '');
      if(name === "broj_licne_karte" && value.length === 9)
        value = value.replace(/\D/g, '');

      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    const closeMessageBox = () => {
      if(isUserCreated) {
        setIsUserCreated(false);
        navigate('/user/login');
      }

      if(!isCorrectJMBG) 
        setIsCorrectJMBG(true);
      
      if(!isCorrectPhoneNum) 
        setIsCorrectPhoneNum(true);
      
      if(!isCorrectID) 
        setIsCorrectID(true);
      
      if(!isCorrectPassword) 
        setIsCorrectPassword(true);

      if(!isCorrectName)
        setIsCorrectName(true);

      if(!isCorrectSurname)
        setIsCorrectSurname(true);
    }
    
    function handleSignUp(e) {
        e.preventDefault();

        if(userData.ime.length < 3) {
          setIsCorrectName(false);
          return;
        }

        if(userData.prezime.length < 4) {
          setIsCorrectSurname(false);
          return;
        }

        if(userData.password.length < 8 || userData.password.length > 16) {
          setIsCorrectPassword(false);
          return;
        }
   
        if(userData.maticni_broj.length != 13) {
          setIsCorrectJMBG(false);
          return;
        }

        if(userData.broj_licne_karte.length != 9) {
          setIsCorrectID(false);
          return;
        }

        if(userData.broj_telefona.length != 10) {
          setIsCorrectPhoneNum(false);
          return;
        }

        axios.post("http://127.0.0.1:8000/api/registracija", userData)
        .then( (res) => {
            setIsUserCreated(true);
        })
        .catch( (e) => {
            console.log(e);
        }); 
    }

  return (
    <>
    {showResetConfirm && (
      <ConfirmModal
        message="Da li ste sigurni da želite da resetujete sva polja? Svi uneti podaci će biti obrisani."
        onConfirm={() => { handleReset(); setShowResetConfirm(false); }}
        onCancel={() => setShowResetConfirm(false)}
      />
    )}
    <section className="h-100" style={{ backgroundColor: "#ba919b" }}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col">
        <div className="card card-registration my-4">
          <div className="row g-0">
            <div className="col-xl-6 d-none d-xl-block eej">
              <img
                src={regPhoto}
                alt="Sample photo"
                className="img-fluid"
                style={{
                  borderTopLeftRadius: ".25rem",
                  borderBottomLeftRadius: ".25rem",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
            <div className="col-xl-6">
              <div className="card-body p-md-5 text-black">
                <h3 className="mb-5 text-uppercase">
                  Registrujte svoj nalog
                </h3>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div data-mdb-input-init="" className="form-outline">
                      <input
                        onInput={handleInput}
                        type="text"
                        name="ime"
                        minLength="3"
                        id="formName"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="formName">
                        Ime
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div data-mdb-input-init="" className="form-outline">
                      <input
                        onInput={handleInput}
                        type="text"
                        name="prezime"
                        minLength="3"
                        id="formSurname"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="formSurname">
                        Prezime
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div data-mdb-input-init="" className="form-outline">
                      <input
                        onInput={handleInput}
                        type="email"
                        name="email"
                        id="formEmail"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="formEmail">
                        Email adresa
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div data-mdb-input-init="" className="form-outline">
                      <input
                        onInput={handleInput}
                        type="password"
                        name="password"
                        id="formPass"
                        className="form-control form-control-lg"
                        minLength="8"
                      />
                      <label className="form-label" htmlFor="formPass">
                        Lozinka
                      </label>
                    </div>
                  </div>
                </div>

                <div data-mdb-input-init="" className="form-outline mb-4">
                  <input
                    onInput={handleInput}
                    type="text"
                    name="adresa"
                    id="formAddress"
                    className="form-control form-control-lg"
                  />
                  <label className="form-label" htmlFor="formAddress">
                    Adresa
                  </label>
                </div>
                
                <div data-mdb-input-init="" className="form-outline mb-4">
                  <input
                    onInput={handleInput}
                    type="text"
                    name="grad"
                    id="formCity"
                    className="form-control form-control-lg"
                  />
                  <label className="form-label" htmlFor="formCity">
                    Grad
                  </label>
                </div>
                
            
                <div data-mdb-input-init="" className="form-outline mb-4">
                  <input
                    onInput={handleInput}
                    type="date"
                    name="datum_rođenja"
                    id="formDob"
                    className="form-control form-control-lg"
                  />
                  <label className="form-label" htmlFor="formDob">
                    Datum Rođenja
                  </label>
                </div>
                <div data-mdb-input-init="" className="form-outline mb-4">
                  <input
                    onInput={handleInput}
                    type="text"
                    name="maticni_broj"
                    id="formJMBG"
                    className="form-control form-control-lg"
                    minLength="13"
                    maxLength="13"
                  />
                  <label className="form-label" htmlFor="formJMBG">
                    Matični broj
                  </label>
                </div>

                <div data-mdb-input-init="" className="form-outline mb-4">
                  <input
                    onInput={handleInput}
                    type="text"
                    name="broj_licne_karte"
                    id="formID"
                    className="form-control form-control-lg"
                    minLength="9"
                    maxLength="9"
                  />
                  <label className="form-label" htmlFor="formID">
                    Broj Lične Karte
                  </label>
                </div>
                
                <div data-mdb-input-init="" className="form-outline mb-4">
                  <input
                    onInput={handleInput}
                    type="text"
                    name="broj_telefona"
                    id="formPhone"
                    className="form-control form-control-lg"
                    minLength="10"
                    maxLength="10"
                  />
                  <label className="form-label" htmlFor="formPhone">
                    Broj Telefona
                  </label>
                </div>
                
                <div data-mdb-input-init="" className="form-outline mb-4">
                  <select value={userData.drzava} onChange={(e)=>{handleInput(e)}} name="drzava" className="form-control form-control-lg country-select-create-new-user" style={{width: "100%"}} id="formDrzava" required>
                      <option value="default" disabled selected>/</option>
                      <optgroup label="A">
                          <option value="Afghanistan">Afghanistan</option>
                          <option value="Åland Islands">Åland Islands</option>
                          <option value="Albania">Albania</option>
                          <option value="Algeria">Algeria</option>
                          <option value="American Samoa">American Samoa</option>
                          <option value="Andorra">Andorra</option>
                          <option value="Angola">Angola</option>
                          <option value="Anguilla">Anguilla</option>
                          <option value="Antarctica">Antarctica</option>
                          <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                          <option value="Argentina">Argentina</option>
                          <option value="Armenia">Armenia</option>
                          <option value="Aruba">Aruba</option>
                          <option value="Australia">Australia</option>
                          <option value="Austria">Austria</option>
                          <option value="Azerbaijan">Azerbaijan</option>
                      </optgroup>

                      <optgroup label="B">
                          <option value="Bahamas">Bahamas</option>
                          <option value="Bahrain">Bahrain</option>
                          <option value="Bangladesh">Bangladesh</option>
                          <option value="Barbados">Barbados</option>
                          <option value="Belarus">Belarus</option>
                          <option value="Belgium">Belgium</option>
                          <option value="Belize">Belize</option>
                          <option value="Benin">Benin</option>
                          <option value="Bermuda">Bermuda</option>
                          <option value="Bhutan">Bhutan</option>
                          <option value="Bolivia">Bolivia</option>
                          <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                          <option value="Botswana">Botswana</option>
                          <option value="Bouvet Island">Bouvet Island</option>
                          <option value="Brazil">Brazil</option>
                          <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                          <option value="Brunei Darussalam">Brunei Darussalam</option>
                          <option value="Bulgaria">Bulgaria</option>
                          <option value="Burkina Faso">Burkina Faso</option>
                          <option value="Burundi">Burundi</option>
                      </optgroup>

                      <optgroup label="C">
                          <option value="Cambodia">Cambodia</option>
                          <option value="Cameroon">Cameroon</option>
                          <option value="Canada">Canada</option>
                          <option value="Cape Verde">Cape Verde</option>
                          <option value="Cayman Islands">Cayman Islands</option>
                          <option value="Central African Republic">Central African Republic</option>
                          <option value="Chad">Chad</option>
                          <option value="Chile">Chile</option>
                          <option value="China">China</option>
                          <option value="Christmas Island">Christmas Island</option>
                          <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Comoros">Comoros</option>
                          <option value="Congo">Congo</option>
                          <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                          <option value="Cook Islands">Cook Islands</option>
                          <option value="Costa Rica">Costa Rica</option>
                          <option value="Cote D'ivoire">Cote D'ivoire</option>
                          <option value="Croatia">Croatia</option>
                          <option value="Cuba">Cuba</option>
                          <option value="Cyprus">Cyprus</option>
                          <option value="Czech Republic">Czech Republic</option>
                      </optgroup>

                      <optgroup label="D">
                          <option value="Denmark">Denmark</option>
                          <option value="Djibouti">Djibouti</option>
                          <option value="Dominica">Dominica</option>
                          <option value="Dominican Republic">Dominican Republic</option>
                      </optgroup>

                      <optgroup label="E">
                          <option value="Ecuador">Ecuador</option>
                          <option value="Egypt">Egypt</option>
                          <option value="El Salvador">El Salvador</option>
                          <option value="Equatorial Guinea">Equatorial Guinea</option>
                          <option value="Eritrea">Eritrea</option>
                          <option value="Estonia">Estonia</option>
                          <option value="Ethiopia">Ethiopia</option>
                      </optgroup>

                      <optgroup label="F">
                          <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                          <option value="Faroe Islands">Faroe Islands</option>
                          <option value="Fiji">Fiji</option>
                          <option value="Finland">Finland</option>
                          <option value="France">France</option>
                          <option value="French Guiana">French Guiana</option>
                          <option value="French Polynesia">French Polynesia</option>
                          <option value="French Southern Territories">French Southern Territories</option>
                      </optgroup>

                      <optgroup label="G">
                          <option value="Gabon">Gabon</option>
                          <option value="Gambia">Gambia</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Germany">Germany</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Gibraltar">Gibraltar</option>
                          <option value="Greece">Greece</option>
                          <option value="Greenland">Greenland</option>
                          <option value="Grenada">Grenada</option>
                          <option value="Guadeloupe">Guadeloupe</option>
                          <option value="Guam">Guam</option>
                          <option value="Guatemala">Guatemala</option>
                          <option value="Guernsey">Guernsey</option>
                          <option value="Guinea">Guinea</option>
                          <option value="Guinea-bissau">Guinea-bissau</option>
                          <option value="Guyana">Guyana</option>
                      </optgroup>

                      <optgroup label="H">
                          <option value="Haiti">Haiti</option>
                          <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                          <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                          <option value="Honduras">Honduras</option>
                          <option value="Hong Kong">Hong Kong</option>
                          <option value="Hungary">Hungary</option>
                      </optgroup>

                      <optgroup label="I">
                          <option value="Iceland">Iceland</option>
                          <option value="India">India</option>
                          <option value="Indonesia">Indonesia</option>
                          <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                          <option value="Iraq">Iraq</option>
                          <option value="Ireland">Ireland</option>
                          <option value="Isle of Man">Isle of Man</option>
                          <option value="Israel">Israel</option>
                          <option value="Italy">Italy</option>
                      </optgroup>

                      <optgroup label="J">
                          <option value="Jamaica">Jamaica</option>
                          <option value="Japan">Japan</option>
                          <option value="Jersey">Jersey</option>
                          <option value="Jordan">Jordan</option>
                      </optgroup>

                      <optgroup label="K">
                          <option value="Kazakhstan">Kazakhstan</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Kiribati">Kiribati</option>
                          <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                          <option value="Korea, Republic of">Korea, Republic of</option>
                          <option value="Kuwait">Kuwait</option>
                          <option value="Kyrgyzstan">Kyrgyzstan</option>
                      </optgroup>

                      <optgroup label="L">
                          <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                          <option value="Latvia">Latvia</option>
                          <option value="Lebanon">Lebanon</option>
                          <option value="Lesotho">Lesotho</option>
                          <option value="Liberia">Liberia</option>
                          <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                          <option value="Liechtenstein">Liechtenstein</option>
                          <option value="Lithuania">Lithuania</option>
                          <option value="Luxembourg">Luxembourg</option>
                      </optgroup>

                      <optgroup label="M">
                          <option value="Macao">Macao</option>
                          <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                          <option value="Madagascar">Madagascar</option>
                          <option value="Malawi">Malawi</option>
                          <option value="Malaysia">Malaysia</option>
                          <option value="Maldives">Maldives</option>
                          <option value="Mali">Mali</option>
                          <option value="Malta">Malta</option>
                          <option value="Marshall Islands">Marshall Islands</option>
                          <option value="Martinique">Martinique</option>
                          <option value="Mauritania">Mauritania</option>
                          <option value="Mauritius">Mauritius</option>
                          <option value="Mayotte">Mayotte</option>
                          <option value="Mexico">Mexico</option>
                          <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                          <option value="Moldova, Republic of">Moldova, Republic of</option>
                          <option value="Monaco">Monaco</option>
                          <option value="Mongolia">Mongolia</option>
                          <option value="Montenegro">Montenegro</option>
                          <option value="Montserrat">Montserrat</option>
                          <option value="Morocco">Morocco</option>
                          <option value="Mozambique">Mozambique</option>
                          <option value="Myanmar">Myanmar</option>
                      </optgroup>

                      <optgroup label="N">
                          <option value="Namibia">Namibia</option>
                          <option value="Nauru">Nauru</option>
                          <option value="Nepal">Nepal</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="Netherlands Antilles">Netherlands Antilles</option>
                          <option value="New Caledonia">New Caledonia</option>
                          <option value="New Zealand">New Zealand</option>
                          <option value="Nicaragua">Nicaragua</option>
                          <option value="Niger">Niger</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Niue">Niue</option>
                          <option value="Norfolk Island">Norfolk Island</option>
                          <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                          <option value="Norway">Norway</option>
                      </optgroup>

                      <optgroup label="O">
                          <option value="Oman">Oman</option>
                      </optgroup>

                      <optgroup label="P">
                          <option value="Pakistan">Pakistan</option>
                          <option value="Palau">Palau</option>
                          <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                          <option value="Panama">Panama</option>
                          <option value="Papua New Guinea">Papua New Guinea</option>
                          <option value="Paraguay">Paraguay</option>
                          <option value="Peru">Peru</option>
                          <option value="Philippines">Philippines</option>
                          <option value="Pitcairn">Pitcairn</option>
                          <option value="Poland">Poland</option>
                          <option value="Portugal">Portugal</option>
                          <option value="Puerto Rico">Puerto Rico</option>
                      </optgroup>

                      <optgroup label="Q">
                          <option value="Qatar">Qatar</option>
                      </optgroup>

                      <optgroup label="R">
                          <option value="Reunion">Reunion</option>
                          <option value="Romania">Romania</option>
                          <option value="Russian Federation">Russian Federation</option>
                          <option value="Rwanda">Rwanda</option>
                      </optgroup>

                      <optgroup label="S">
                          <option value="Saint Helena">Saint Helena</option>
                          <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                          <option value="Saint Lucia">Saint Lucia</option>
                          <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                          <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                          <option value="Samoa">Samoa</option>
                          <option value="San Marino">San Marino</option>
                          <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="Senegal">Senegal</option>
                          <option value="Serbia">Serbia</option>
                          <option value="Seychelles">Seychelles</option>
                          <option value="Sierra Leone">Sierra Leone</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Slovakia">Slovakia</option>
                          <option value="Slovenia">Slovenia</option>
                          <option value="Solomon Islands">Solomon Islands</option>
                          <option value="Somalia">Somalia</option>
                          <option value="South Africa">South Africa</option>
                          <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                          <option value="Spain">Spain</option>
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="Sudan">Sudan</option>
                          <option value="Suriname">Suriname</option>
                          <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                          <option value="Swaziland">Swaziland</option>
                          <option value="Sweden">Sweden</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                      </optgroup>

                      <optgroup label="T">
                          <option value="Taiwan">Taiwan</option>
                          <option value="Tajikistan">Tajikistan</option>
                          <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                          <option value="Thailand">Thailand</option>
                          <option value="Timor-leste">Timor-leste</option>
                          <option value="Togo">Togo</option>
                          <option value="Tokelau">Tokelau</option>
                          <option value="Tonga">Tonga</option>
                          <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                          <option value="Tunisia">Tunisia</option>
                          <option value="Turkey">Turkey</option>
                          <option value="Turkmenistan">Turkmenistan</option>
                          <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                          <option value="Tuvalu">Tuvalu</option>
                      </optgroup>

                      <optgroup label="U">
                          <option value="Uganda">Uganda</option>
                          <option value="Ukraine">Ukraine</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United States">United States</option>
                          <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                          <option value="Uruguay">Uruguay</option>
                          <option value="Uzbekistan">Uzbekistan</option>
                      </optgroup>

                      <optgroup label="V">
                          <option value="Vanuatu">Vanuatu</option>
                          <option value="Venezuela">Venezuela</option>
                          <option value="Viet Nam">Viet Nam</option>
                          <option value="Virgin Islands, British">Virgin Islands, British</option>
                          <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                      </optgroup>

                      <optgroup label="W">
                          <option value="Wallis and Futuna">Wallis and Futuna</option>
                          <option value="Western Sahara">Western Sahara</option>
                      </optgroup>

                      <optgroup label="Y">
                          <option value="Yemen">Yemen</option>
                      </optgroup>

                      <optgroup label="Z">
                          <option value="Zambia">Zambia</option>
                          <option value="Zimbabwe">Zimbabwe</option>
                      </optgroup>

                  </select>

                  <label className="form-label" htmlFor="formDrzava">
                    Izaberite Državu:
                  </label>
                </div>
                

                <div className="d-flex justify-content-end pt-3">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    type="button"
                    data-mdb-button-init=""
                    data-mdb-ripple-init=""
                    className="btn btn-light btn-lg"
                  >
                    Resetuj sva polja
                  </button>
                  <button
                    onClick={handleSignUp}
                    type="submit"
                    data-mdb-button-init=""
                    data-mdb-ripple-init=""
                    className="btn btn-warning btn-lg ms-2"
                  >
                    Potvrdi registraciju
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {!isCorrectName && <PopUp closeMessageBox={closeMessageBox} messageText="Uneto ime je prekratko!"/>}
  {!isCorrectSurname && <PopUp closeMessageBox={closeMessageBox} messageText="Uneto prezime je prekratko!"/>}
  {!isCorrectPassword && <PopUp closeMessageBox={closeMessageBox} messageText="Uneta lozinka je prekratka/predugačka!"/>}
  
  
  {!isCorrectJMBG && <PopUp closeMessageBox={closeMessageBox} messageText="Neispravan matični broj!"/>}
  {!isCorrectID && <PopUp closeMessageBox={closeMessageBox} messageText="Neispravan broj lične karte!"/>}
  {!isCorrectPhoneNum && <PopUp closeMessageBox={closeMessageBox} messageText="Neispravan broj telefona"/>}
  
  {isUserCreated && <PopUp closeMessageBox={closeMessageBox} messageText="Nalog je uspešno kreiran!"/>}

</section>
  </>
  )
}

export default RegisterPageUser
