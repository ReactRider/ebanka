import React, {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { SlPeople } from 'react-icons/sl';
import '../css/AdminHone.css';
import { BsBank } from 'react-icons/bs';

const AdminHome = () => {
    const navigate = useNavigate();

    useEffect( () => {
        let user = window.sessionStorage.getItem("user_auth_token");
        let admin = window.sessionStorage.getItem("admin_auth_token");

        if(admin == null)
            navigate("/admin/login");
        else if(user != null)
            navigate("/user/home");
        
    }, [navigate]);

    return (
        <div className="telo-admina">
        <div className="korisnici-container"> 

            <div className='first-column'>
                <div>
                    <p className='first-column-text'>KORISNICI</p>
                </div>

                <div className='ikonica'>
                    <SlPeople style={{width:'5em',height:'5em', color:'blue', marginTop:'1em'}}/>
                </div>
            </div>
            <div className='second-column'>
                <Link to="/admin/svi-korisnici" ><button className="btn-link-u">Prikaz svih korisnika</button></Link>
                <Link to="/admin/kreiraj-korisnika" ><button className="btn-link-u">Kreiranje novog korisnika</button></Link>
            </div>
        </div>
        <div className="banke-kontainer">

            <div className="first-column">
                <div>
                    <p className="first-column-text">BANKE</p>
                </div>

                <div>
                    <BsBank style={{width:'5em',height:'5em', color:'blue', marginTop:'1em'}}/>
                </div>
            </div>
            <div className="second-column">
                <Link to="/admin/sve-banke"><button className="btn-link-b">Prikaz svih banaka</button></Link>
                <Link to="/admin/kreiranje-banke"><button className="btn-link-b">Kreiranje nove banke</button></Link>
            </div>
        </div>
        
    </div>
    )
}

export default AdminHome
