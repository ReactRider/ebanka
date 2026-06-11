import React from 'react';
import '../css/NotificationToast.css';

const NotificationToast = ({ notifications, onClose }) => {
    if (notifications.length === 0) return null;

    return (
        <div className="nt-container">
            {notifications.map(n => {
                const isZakazana = n.type === 'zakazana';
                return (
                    <div key={n.id} className={`nt-toast ${isZakazana ? 'nt-toast--zakazana' : ''}`}>
                        <div className={`nt-accent ${isZakazana ? 'nt-accent--zakazana' : ''}`} />
                        <div className="nt-body">
                            <div className="nt-header">
                                <span className={`nt-title ${isZakazana ? 'nt-title--zakazana' : ''}`}>
                                    {isZakazana ? 'Zakazano plaćanje' : 'Nova uplata'}
                                </span>
                                <span className="nt-time">{n.vreme}</span>
                            </div>
                            <div className="nt-amount">{n.iznos} RSD</div>
                            <div className="nt-account">
                                {isZakazana ? `Primalac: ${n.nazivPrimaoca}` : `Račun: ${n.brojRacuna}`}
                            </div>
                        </div>
                        <button className="nt-close" onClick={() => onClose(n.id)}>×</button>
                    </div>
                );
            })}
        </div>
    );
};

export default NotificationToast;
