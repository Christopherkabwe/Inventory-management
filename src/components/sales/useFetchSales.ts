// useFetchSales.js
import { useState, useEffect } from 'react';

const useFetchSales = (userId, format = 'json') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const url = userId ? `/api/sales?userId=${userId}` : "/api/sales";
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                let data;
                switch (format) {
                    case 'json':
                        data = await res.json();
                        break;
                    case 'csv':
                        data = await res.text();
                        // You can parse the CSV data here if needed
                        break;
                    case 'xml':
                        data = await res.text();
                        // You can parse the XML data here if needed
                        break;
                    default:
                        throw new Error(`Unsupported format: ${format}`);
                }

                setData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, [userId, format]);

    return { data, loading, error };
};

export default useFetchSales;