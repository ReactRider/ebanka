import React, {useEffect} from 'react'
import { useState } from 'react'
import axios from 'axios';
import {BrowserRouter, Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import '../css/LogInPageUser.css';
import PopUp from './PopUp';

const LoginPageUser = ({handleLogInStatus}) => {
    const navigate = useNavigate();

    const handleLoginState = (status) => {
      if(handleLogInStatus)
        handleLogInStatus(true);
    }

    // Ukoliko je admin ulogovan, pri pokusaju logina kao regularan => automatsko preusmeravanje
    useEffect( () => {
      let user = window.sessionStorage.getItem("user_auth_token");
      let admin = window.sessionStorage.getItem("admin_auth_token");

      if(user != null)
        navigate("/user/home");
      else if(admin != null)
        navigate('/admin/home');

      window.sessionStorage.setItem("type", "user");
    }, [navigate]);

    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const [step, setStep] = useState('login'); // 'login' | 'verify'
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState(null);
    const [otpEmpty, setOtpEmpty] = useState(false);

    function handleInput(e) {
        let newUserData = userData;
        newUserData[e.target.name] = e.target.value;
        setUserData(newUserData);
    }

    function handleLogin(e) {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/korisnik/login", userData).then( (res) => {
            if(res.data.requires_2fa) {
                setStep('verify');
            } else if(res.data.token) {
                window.sessionStorage.setItem("user_auth_token", res.data.token);
                handleLoginState(true);
                navigate('/user/home');
            } else {
                setOtpError('Neispravan email i/ili lozinka. Proverite unos.');
            }
        })
        .catch( (e) => {
            setOtpError('Neispravan email i/ili lozinka. Proverite unos.');
            console.log(e);
        })
    }

    function handleVerify(e) {
        e.preventDefault();

        if(otpCode == ''){
          setOtpEmpty(true);
          return;
        }

        axios.post("http://127.0.0.1:8000/api/korisnik/verify-2fa", {
            email: userData.email,
            code: otpCode,
        }).then( (res) => {
            if(res.data.token) {
                window.sessionStorage.setItem("user_auth_token", res.data.token);
                handleLoginState(true);
                navigate('/user/home');
            } else
              setOtpError(res.data);
        })
        .catch( (e) => {
            setOtpError('Neispravan ili istekli verifikacioni kod. Pokušajte ponovo.');
            console.log(e);
        })
    }

  return (
    <>
    <section className="vh-94" style={{ backgroundColor: "#ba919b", height: '94vh', marginTop: '0px' }}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-xl-10">
        <div className="card" style={{ borderRadius: "1rem" }}>
          <div className="row g-0">
            <div className="col-md-6 col-lg-5 d-none d-md-block">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                alt="login form"
                className="img-fluid"
                style={{ borderRadius: "1rem 0 0 1rem" }}
              />
            </div>
            <div className="col-md-6 col-lg-7 d-flex align-items-center">
              <div className="card-body p-4 p-lg-5 text-black">

                {step === 'login' && (
                  <form onSubmit={handleLogin}>
                    <h5
                      className="fw-normal mb-3 pb-3"
                      style={{ letterSpacing: 1 }}
                    >
                      Prijavite se na svoj nalog
                    </h5>
                    <div data-mdb-input-init="" className="form-outline mb-4">
                      <input onInput={handleInput}
                        type="email"
                        name="email"
                        id="formEmail"
                        className="form-control form-control-lg"
                        autoComplete='off'
                      />
                      <label className="form-label" htmlFor="formEmail">
                        Email adresa
                      </label>
                    </div>
                    <div data-mdb-input-init="" className="form-outline mb-4">
                      <input onInput={handleInput}
                        name="password"
                        type="password"
                        id="formPassword"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="formPassword">
                        Lozinka
                      </label>
                    </div>
                    <div className="pt-1 mb-4">
                      <button
                        data-mdb-button-init=""
                        data-mdb-ripple-init=""
                        className="btn btn-dark btn-lg btn-block"
                        type="submit"
                      >
                        Prijava
                      </button>
                    </div> <br/>

                    <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                      <Link to="/user/register" className="user-login-link" style={{ color: "#393f81", textDecoration:'none' }}>
                        Registrujte se ovde
                      </Link> <br></br>
                      <Link to="/admin/login" className="user-login-link" style={{ color: "#393f81", textDecoration:'none' }}>
                      Administrativna prijava
                      </Link>
                    </p>
                  </form>
                )}

                {step === 'verify' && (
                  <form onSubmit={handleVerify}>
                    <h5
                      className="fw-normal mb-3 pb-3"
                      style={{ letterSpacing: 1 }}
                    >
                      Dvofaktorska verifikacija
                    </h5>
                    <p className="text-muted mb-4">
                      Poslali smo verifikacioni kod na vašu email adresu. Unesite ga ispod.
                    </p>
                    <div data-mdb-input-init="" className="form-outline mb-4">
                      <input
                        type="text"
                        id="formOtp"
                        className="form-control form-control-lg"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => { setOtpCode(e.target.value); setOtpEmpty(false); }}
                        placeholder="000000"
                        autoComplete="off"
                        style={{ letterSpacing: '0.4em', textAlign: 'center', border: otpEmpty ? '3px solid red' : '' }}
                      />
                      <label className="form-label" htmlFor="formOtp">
                        Verifikacioni kod
                      </label>
                    </div>
                    <div className="pt-1 mb-4">
                      <button
                        data-mdb-button-init=""
                        data-mdb-ripple-init=""
                        className="btn btn-dark btn-lg btn-block"
                        type="submit"
                      >
                        Potvrdi
                      </button>
                    </div>
                    <p
                      className="mb-0"
                      style={{ color: "#393f81", cursor: 'pointer' }}
                      onClick={() => setStep('login')}
                    >
                      Nazad na prijavu
                    </p>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  {otpError && <PopUp closeMessageBox={() => setOtpError(null)} messageText={otpError} />}
  </>
  )
}

export default LoginPageUser
