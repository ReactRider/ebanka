import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import '../css/ZakazaneTransakcije.css';

const ZakazaneTransakcije = ({ focusedAcc }) => {
    const [zakazane, setZakazane] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noAcc, setNoAcc] = useState(false);
    const [confirmId, setConfirmId] = useState(null);

    useEffect(() => {
        if (!focusedAcc) {
            setNoAcc(true);
            setLoading(false);
            return;
        }

        const config = {
            method: 'get',
            url: `http://127.0.0.1:8000/api/korisnik/zakazane-transakcije/${focusedAcc.id}`,
            headers: {
                'Authorization': 'Bearer ' + window.sessionStorage.getItem('user_auth_token')
            }
        };

        axios.request(config)
            .then(res => {
                setZakazane(res.data.zakazane_transakcije);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [focusedAcc]);

    const handleOtkazivanje = (id) => {
        setConfirmId(id);
    };

    const handleConfirm = () => {
        const id = confirmId;
        setConfirmId(null);

        const config = {
            method: 'patch',
            url: `http://127.0.0.1:8000/api/korisnik/zakazana-transakcija/${id}/deaktiviraj`,
            headers: {
                'Authorization': 'Bearer ' + window.sessionStorage.getItem('user_auth_token')
            }
        };

        axios.request(config)
            .then(() => {
                setZakazane(prev => prev.filter(t => t.id !== id));
            })
            .catch(err => console.log(err));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <PulseLoader color="#9A616D" size={35} margin={8} speedMultiplier={0.4} />
            </div>
        );
    }

    if (noAcc) {
        return (
            <div className="zt-page">
                <div className="zt-card">
                    <p className="zt-no-acc">Nema izabranog računa. Molimo izaberite račun na početnoj stranici.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="zt-page">
        {confirmId !== null && (
            <div className="zt-overlay">
                <div className="zt-modal">
                    <h3 className="zt-modal-title">Otkazivanje plaćanja</h3>
                    <p className="zt-modal-text">Da li ste sigurni da želite da otkažete ovo zakazano plaćanje? Ova akcija se ne može poništiti.</p>
                    <div className="zt-modal-actions">
                        <button className="zt-modal-btn-cancel" onClick={() => setConfirmId(null)}>Odustani</button>
                        <button className="zt-modal-btn-confirm" onClick={handleConfirm}>Da, otkaži</button>
                    </div>
                </div>
            </div>
        )}
            <div className="zt-card">
                <h2 className="zt-title">Zakazana plaćanja</h2>
                <p className="zt-subtitle">
                    {zakazane.length === 0
                        ? 'Nemate aktivnih zakazanih plaćanja za ovaj račun.'
                        : `Ukupno aktivnih: ${zakazane.length}`}
                </p>
                <hr className="zt-divider" />

                {zakazane.length === 0 ? (
                    <div className="zt-empty">
                        Još uvek nema zakazanih plaćanja. Možete ih kreirati prilikom slanja transakcije.
                    </div>
                ) : (
                    <table className="zt-table">
                        <thead>
                            <tr>
                                <th>Iznos</th>
                                <th>Primalac</th>
                                <th>Broj računa primaoca</th>
                                <th>Dan u mesecu</th>
                                <th>Sledeće izvršavanje</th>
                                <th>Akcija</th>
                            </tr>
                        </thead>
                        <tbody>
                            {zakazane.map(t => (
                                <tr key={t.id}>
                                    <td><span className="zt-amount">{Number(t.iznos).toLocaleString('sr-RS')} RSD</span></td>
                                    <td>{t.naziv_primaoca}</td>
                                    <td>{t.broj_racuna_primaoca}</td>
                                    <td><span className="zt-badge">{t.dan_u_mesecu}. u mesecu</span></td>
                                    <td><span className="zt-date">{t.sledece_izvrsavanje}</span></td>
                                    <td>
                                        <button
                                            className="zt-btn-cancel"
                                            onClick={() => handleOtkazivanje(t.id)}
                                        >
                                            Otkaži
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ZakazaneTransakcije;
