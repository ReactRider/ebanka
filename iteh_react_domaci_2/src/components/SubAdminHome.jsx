import React, { useEffect,useState } from 'react'
import UserYearCharts from './UserYearCharts';
import axios from 'axios';
import '../css/Tabela.css';
import RenderPagination from './RenderPagination';
import { PulseLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';


const SubAdminHomeKorisnici = () => {

    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const navigate=useNavigate();
    const[users, setUsers]=useState([]);
    const [loading, setLoading]=useState(true);
    const banka_id=localStorage.getItem('banka_id');

    
    useEffect( () => {
        fetchPaginatedUsers(currentPage);
    },[currentPage]);


    const fetchPaginatedUsers = async (page) => {

            let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `http://127.0.0.1:8000/api/admin/svi-korisnici-banke/${banka_id}?page=${page}`,
            headers: { 
                'Authorization': 'Bearer '+window.sessionStorage.getItem("sub_admin_auth_token"), 
            },
            };

            axios.request(config)
            .then((response) => {
            console.log(JSON.stringify(response.data));
            setLoading(false);
            setUsers(response.data.users);
            setPagination({
                currentPage: response.data.meta.current_page,
                lastPage: response.data.meta.last_page,
                total: response.data.meta.total,
                perPage: response.data.meta.per_page,
            });
            })
            .catch((error) => {
            console.log(error);
            });

    };

    const handleNewWindow=async(user_id)=>{
      navigate('/admin/home/racuni_izrabranog_korisnika',{
        state:{user: user_id}
      })
    }

  return (
    <>
    {loading==true ? <>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-15em' }}>
            <PulseLoader
              color="#9A616D"     
              size={35}           
              margin={8}          
              speedMultiplier={0.5} 
            />
            </div></>:<>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2em'}}>
              <UserYearCharts bid={banka_id}/>
            </div>
            <br></br>
    <div className="tabela-kontejner-user-admin">
    <table class="user-tabela">
      <thead>
        <tr className="red">
          <th className="kolona">ID</th>
          <th className="kolona">Ime</th>
          <th className="kolona">Prezime</th>
          <th className="kolona">Matični broj</th>
          <th className="kolona">Email</th>
          <th className="kolona">Broj lične karte</th>
          <th className="kolona">Adresa</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="red" onClick={()=>handleNewWindow(user.id)}>
            <td>{user.id}</td>
            <td>{user.ime}</td>
            <td>{user.prezime}</td>
            <td>{user.maticni_broj}</td>
            <td>{user.email}</td>
            <td>{user.broj_licne_karte}</td>
            <td>{user.adresa}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    {users && <RenderPagination 
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
    />}
    
  </>}
    </>
  )
}

export default SubAdminHomeKorisnici
