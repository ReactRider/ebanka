import React from 'react'
import '../css/ExportEmptyPopUp.css';

const ExportEmpty = ({closeMessageBox, messageText}) => {
  return (
    <div className="message-box">
      <div>
        <h2>{messageText}</h2>
      </div>
      
      <div>
        <button className="close-message-box" onClick={()=>closeMessageBox()}>Zatvori</button>
      </div>
    </div>
  )
}

export default ExportEmpty
