import { useEffect, useRef } from 'react';
import axios from 'axios';

const nowLocalString = () => {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const todayKey = () => new Date().toISOString().split('T')[0];

const loadSeenIds = () => {
    try {
        const raw = localStorage.getItem('seen_zakazane_' + todayKey());
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
};

const persistSeenId = (id) => {
    try {
        const key = 'seen_zakazane_' + todayKey();
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(id);
        localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
};

const useIncomingPaymentNotifications = (loggedIn, onNotification) => {
    const lastChecked = useRef(null);
    const seenScheduledIds = useRef(new Set());
    const pendingNotifs = useRef([]);
    const originalTitle = useRef(document.title);
    const onNotificationRef = useRef(onNotification);

    useEffect(() => {
        onNotificationRef.current = onNotification;
    });

    useEffect(() => {
        if (!loggedIn) return;

        lastChecked.current = nowLocalString();
        seenScheduledIds.current = loadSeenIds();
        originalTitle.current = document.title;

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const handleNotif = (notif) => {
            if (document.visibilityState === 'hidden') {
                pendingNotifs.current.push(notif);
                document.title = `(${pendingNotifs.current.length}) Nova obaveštenja`;
                if (Notification.permission === 'granted') {
                    const body = notif.type === 'zakazana'
                        ? `Zakazano plaćanje od ${notif.iznos} RSD ka ${notif.nazivPrimaoca} je izvršeno u ${notif.vreme}`
                        : `Primili ste ${notif.iznos} RSD na račun ${notif.brojRacuna} u ${notif.vreme}`;
                    new Notification(notif.type === 'zakazana' ? 'Zakazano plaćanje izvršeno' : 'Nova uplata', {
                        body,
                        icon: '/favicon.ico'
                    });
                }
            } else {
                onNotificationRef.current(notif);
            }
        };

        const doPoll = () => {
            const token = window.sessionStorage.getItem('user_auth_token');
            if (!token) return;

            const od = lastChecked.current;
            lastChecked.current = nowLocalString();

            // Poll for incoming payments
            axios.get('http://127.0.0.1:8000/api/korisnik/dolazne-transakcije', {
                params: { od },
                headers: { Authorization: 'Bearer ' + token }
            })
            .then(res => {
                res.data.transakcije.forEach(t => {
                    handleNotif({
                        id: Date.now() + Math.random(),
                        type: 'dolazna',
                        iznos: Number(t.iznos).toLocaleString('sr-RS'),
                        brojRacuna: t.broj_racuna_primaoca,
                        vreme: t.vreme.substring(0, 5),
                    });
                });
            })
            .catch(err => console.log(err));

            // Poll for executed scheduled transactions (ID-based deduplication, no od param)
            axios.get('http://127.0.0.1:8000/api/korisnik/nove-izvrsene-zakazane', {
                headers: { Authorization: 'Bearer ' + token }
            })
            .then(res => {
                res.data.transakcije.forEach(t => {
                    if (!seenScheduledIds.current.has(t.id)) {
                        seenScheduledIds.current.add(t.id);
                        persistSeenId(t.id);
                        handleNotif({
                            id: Date.now() + Math.random(),
                            type: 'zakazana',
                            iznos: Number(t.iznos).toLocaleString('sr-RS'),
                            nazivPrimaoca: t.naziv_primaoca,
                            brojRacuna: t.broj_racuna_primaoca,
                            vreme: t.vreme.substring(0, 5),
                        });
                    }
                });
            })
            .catch(err => console.log(err));
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                pendingNotifs.current.forEach(n => onNotificationRef.current(n));
                pendingNotifs.current = [];
                document.title = originalTitle.current;
                doPoll();
            }
        };

        const interval = setInterval(doPoll, 10000);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.title = originalTitle.current;
        };
    }, [loggedIn]);
};

export default useIncomingPaymentNotifications;
