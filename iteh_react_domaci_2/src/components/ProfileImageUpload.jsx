import React from 'react';
import {useState,useEffect} from 'react';
import axios from 'axios';
import '../css/AccountInfo.css';




const ProfileImageUpload = ({update}) => {

    const [image,setImage]=useState(null);
    const [preview,setPreview]=useState(null);
    const [message,setMessage]=useState("");
    const [imagePath, setImagePath] = useState(null);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(()=>{
        const fetchProfileImage = async () => {
                    
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:8000/api/korisnik/uzimanje-slike',
                headers: { 
                'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'), 
                },
            };
            
            axios.request(config)
            .then((response) => {
                setImagePath("storage/"+response.data.imagePath);  
                
            })
            .catch((error) => {
                console.log(error);
            });
        };

        fetchProfileImage();
    },[])


    
        const handleFileChange=(e)=>{
            const file=e.target.files[0];
            if(file){
                setImage(file);
                setPreview(URL.createObjectURL(file));
            }
        };
    
    
        const handleUpload=async()=>{
            if(!image){
                setMessage("Please select an image");
                return;
            }
    
            const formData=new FormData();
            formData.append("image",image);
    
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:8000/api/korisnik/postavljanje-slike',
                headers: { 
                  'Authorization': 'Bearer '+window.sessionStorage.getItem('user_auth_token'), 
                 
                },
                data : formData
              };
              
              axios.request(config)
              .then((response) => {

                setMessage(response.data.message);
              })
              .catch((error) => {
                console.log(error);
              });
    
        
    }

    const handleClick = () => {
        setIsClicked(true);
      }



    const allFunctions=()=>{
        handleUpload();
        handleClick();
    }


  return (
    <div>
      {update===false ? 
      <>
      {(imagePath!=null && preview==null) ? <img className="profile-image" src={"http://127.0.0.1:8000/" + imagePath} alt="preview"/> : <></>}
      {(imagePath==null && preview==null) ? <img className="profile-image"  src="../../slike/placeholder.jpg"/> : <></>}
      {((preview==null && imagePath!=null) || (preview==null && imagePath==null)) ? <input type="file" accept="image/*" onChange={handleFileChange}/> : <></>}
      {preview && <img className="profile-image" src={preview} alt="Preview" />} 
      {((imagePath!=null && preview!=null) || (imagePath==null && preview!=null)) && !isClicked && <button onClick={allFunctions} className="btn-upload">Potvrdite izmene</button>}
      </> : 
      <>
      {imagePath && <img className="profile-image" alt="profile_image" src={"http://127.0.0.1:8000/"+imagePath} />}
       {(imagePath==null && preview==null) ? <img className="profile-image"  src="../../slike/placeholder.jpg"/> : <></>}
       {preview && <img className="profile-image" src={preview} alt="Preview" />}
      </>}
      
    </div>
  )
}

export default ProfileImageUpload
