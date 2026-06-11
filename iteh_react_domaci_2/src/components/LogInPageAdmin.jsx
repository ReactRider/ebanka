import React, {useEffect} from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/LogInPageUser.css';
import adminLogInImage from '../slike/admin_login.jpeg';

const LogInPageAdmin = () => {
    const navigate = useNavigate();

    // Ukoliko je korisnik ulogovan kao regularan => automatsko preusmeravanje
    useEffect( () => {
        let user = window.sessionStorage.getItem("user_auth_token");
        let admin = window.sessionStorage.getItem("admin_auth_token");

        if(admin != null)
            navigate("/admin/home");
        else if(user != null)
            navigate('/user/home');

        window.sessionStorage.removeItem("type");
    }, [navigate]);

    const [adminData, setAdminData] = useState({
        email: "",
        password: "",
        banka_id: 0,
    });

    const[selected, setSelected]=useState();
    const[options, setOptions]=useState([]);

    const [step, setStep] = useState('login'); // 'login' | 'verify'
    const [otpCode, setOtpCode] = useState('');
    const [adminType, setAdminType] = useState(''); // 'system' | 'sub'

    useEffect(()=>{
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/api/sve-banke',
      };
      axios.request(config)
      .then((response) => {
        console.log(response.data.banke);
        setOptions(response.data.banke);
      })
      .catch((error) => {
        console.log(error);
      });

    },[]);

    function handleLogin(e) {
        console.log(adminData);
        e.preventDefault();
        if(adminData.banka_id===0){
          axios.post("http://127.0.0.1:8000/api/admin/login-system-admin", adminData)
          .then( (res) => {
        
              if(res.data.requires_2fa) {
                  setAdminType('system');
                  setStep('verify');
              } else if(res.data.access_token) {
                  console.log("success");
                  console.log(res.data);
                  window.sessionStorage.setItem("admin_auth_token", res.data.access_token);
                  navigate('/admin/home');
              }
          })
          .catch( (e) => {
              alert("Neispravna email adresa i/ili lozinka!");
              console.log(e);
          });
        }else{
        axios.post("http://127.0.0.1:8000/api/admin/login-sub-admin", adminData)
        .then( (res) => {
            if(res.data.requires_2fa) {
                setAdminType('sub');
                setStep('verify');
            } else if(res.data.access_token) {
                console.log("success");
                console.log(res.data);
                window.sessionStorage.setItem("sub_admin_auth_token", res.data.access_token);
                navigate('/admin/home/sub');
                localStorage.setItem('banka_id',adminData.banka_id)
            }
        })
        .catch( (e) => {
            alert("Neispravna email adresa i/ili lozinka!");
            console.log(e);
        });
      }
    }

    function handleVerify(e) {
        e.preventDefault();

        const verifyUrl = adminType === 'system'
            ? "http://127.0.0.1:8000/api/admin/verify-2fa-system-admin"
            : "http://127.0.0.1:8000/api/admin/verify-2fa-sub-admin";

        axios.post(verifyUrl, {
            email: adminData.email,
            code: otpCode,
        }).then( (res) => {
            if(res.data.access_token) {
                if(adminType === 'system') {
                    window.sessionStorage.setItem("admin_auth_token", res.data.access_token);
                    navigate('/admin/home');
                } else {
                    window.sessionStorage.setItem("sub_admin_auth_token", res.data.access_token);
                    navigate('/admin/home/sub');
                    localStorage.setItem('banka_id', adminData.banka_id);
                }
            }
        })
        .catch( (e) => {
            alert("Neispravan ili istekli verifikacioni kod!");
            console.log(e);
        });
    }

    function handleInput(e) {
        let newAdminData = adminData;
        newAdminData[e.target.name] = e.target.value;
        setAdminData(newAdminData);
    }

  return (
    <section className="vh-94" style={{ backgroundColor: "#ba919b", height: '94vh' }}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-xl-10">
        <div className="card" style={{ borderRadius: "1rem" }}>
          <div className="row g-0">
            <div className="col-md-6 col-lg-5 d-none d-md-block" style={{height: '70vh'}}>
              <img
                src={adminLogInImage}
                alt="login form"
                className="img-fluid"
                style={{ borderRadius: "1rem 0 0 1rem", width: '100%', height:'100%' }}
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
                      Dobrodošli na administrativnu prijavu
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

                    <div data-mdb-input-init="" className="form-outline mb-4">
                    <select className="form-control form-control-lg" value={selected} onChange={handleInput} name='banka_id'>
                      <option value='default' name='banka_id'></option>
                      {options.map((b)=>(
                        <option key={b.id} value={b.id} name='banka_id'>{b.naziv}</option>
                      ))}
                    </select>
                    <label className="form-label" htmlFor="formPassword">
                      Izaberite banku za koji imate nadležnost pristupa
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
                    </div><br/>

                    <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                      <Link to="/user/login" className="user-login-link" style={{ color: "#393f81", textDecoration:'none' }}>
                      Korisnička prijava
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
                        autoComplete="off"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="000000"
                        style={{ letterSpacing: '0.4em', textAlign: 'center' }}
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
    )
}

export default LogInPageAdmin
