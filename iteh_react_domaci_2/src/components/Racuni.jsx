import React, { useState, useEffect, useRef } from 'react';
import OneRacun from './OneRacun';
import axios from 'axios';
import '../css/AccountsCarousel.css';
import { PulseLoader } from 'react-spinners';

const Racuni = ({onAccountFocus, refreshTrigger}) => {
    const [racuni,setRacuni]=useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isHovered, setIsHovered] = useState(false);
    const [zeroAccountsHook, setZeroAccountsHook] = useState(false);
    const isFirstLoad = useRef(true);

    const handleAccountFocus = (acc) => {
      if(onAccountFocus) 
        onAccountFocus(acc);
    }

    const [loading, setLoading]=useState(true);

    useEffect(()=>{
        const fetchRacuni = async () => {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:8000/api/korisnik/bankovni-racuni',
                headers: {
                  'Authorization': 'Bearer ' + window.sessionStorage.getItem("user_auth_token")
                }
              };

              axios.request(config)
              .then((response) => {
                setRacuni(response.data.racuni);
                if (response.data.racuni.length === 0) {
                    setZeroAccountsHook(true);
                } else if (isFirstLoad.current) {
                    handleAccountFocus(response.data.racuni[0]);
                    isFirstLoad.current = false;
                }
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
              });
        }
        fetchRacuni();
    },[refreshTrigger])

      const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % racuni.length);
        handleAccountFocus(racuni[(currentIndex+1) %racuni.length]);
      };

      let carouselItems = [];

      racuni == null ? <></> : racuni.map( racun => {
        carouselItems.push(<OneRacun racun={racun} key={racun.id} /> );
     })

  return (
    <>
   {loading===true ? <>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: '-5em' }}>
      <PulseLoader
        color="#9A616D"     
        size={35}           
        margin={8}          
        speedMultiplier={0.5} 
      />
    </div>
    </> : <>
    <div className="carousel-container">

    {zeroAccountsHook && (<> 
        <h1>Nema računa za prikaz.</h1>
      </>)}

      {!zeroAccountsHook && racuni.length === 1 && (
        <div className="carousel-item-active two-col-container-layout">{carouselItems[0]}</div>
      )}

      {!zeroAccountsHook && racuni.length > 1 && (
        <>
          <div className={`carousel-item-active two-col-container-layout ${isHovered ? "arrow_hovered_active" : "arrow_unhovered"}`}>{carouselItems[currentIndex]}</div>
          <div className="arrow" onMouseEnter={() => {setIsHovered(true)}} onMouseLeave={() => {setIsHovered(false)}} onClick={handleNext}>&#8594;</div>
          <div className={`carousel-item-next two-col-container-layout ${isHovered ? "arrow_hovered_next" : "arrow_unhovered"}`} onClick={handleNext}>{carouselItems[(currentIndex+1)%racuni.length]}</div>
        </>
      )}
      
    </div>
    
    </>}
    </>
  )
}

export default Racuni
