import React, {useEffect} from 'react'
import { useState } from 'react'
import axios from 'axios';
import {BrowserRouter, Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import '../css/LogInPageUser.css';

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

    function handleInput(e) {
        let newUserData = userData;
        newUserData[e.target.name] = e.target.value;
        setUserData(newUserData);
    }

    function handleLogin(e) {
        e.preventDefault();

        axios.post("http://127.0.0.1:8000/api/korisnik/login", userData).then( (res) => {
            if(res.data.token) {
                console.log("success");
                console.log(res.data);
                window.sessionStorage.setItem("user_auth_token", res.data.token);
                handleLoginState(true);
                navigate('/user/home');
            }
        })
        .catch( (e) => {
            alert("Neispravan email i/ili lozinka!");
            console.log(e);
        })
    }

  return (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}

export default LoginPageUser
