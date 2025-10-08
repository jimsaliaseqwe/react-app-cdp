import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function () {
    const query = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    useEffect(() => {
        if (query.get('fw')) {
            setHistory((prev) => [...prev, query.get('fw')]);
        }
    }, []);

    useEffect(() => {
        if (history.length > 0) {
            navigate(history[history.length - 1]);
        }
    }, [history]);

    return <div />;
}
