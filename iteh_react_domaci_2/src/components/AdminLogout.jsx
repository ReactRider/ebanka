import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogout = () => {
    const navigate = useNavigate();

    useEffect( () => {

        let admin = window.sessionStorage.getItem("admin_auth_token");
        let sub_admin=window.sessionStorage.getItem("sub_admin_auth_token");

        if(admin != null) {
            window.sessionStorage.removeItem("admin_auth_token");
            navigate("/admin/login");
        }else if(sub_admin!=null){
            window.sessionStorage.removeItem("sub_admin_auth_token");
            localStorage.removeItem('banka_id');
            navigate("/admin/login");
        }else{
            navigate("/admin/login");
        }
    }, [navigate]);

  return null;
}

export default AdminLogout
